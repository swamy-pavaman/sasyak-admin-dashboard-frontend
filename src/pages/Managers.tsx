import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, UserCog, Phone, Mail, Users, Edit, Trash2, Plus } from "lucide-react";
import { getUsersByRole, getUsersByManager, deleteUser, User } from "@/services/ApiService";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const Managers = () => {
  const [managers, setManagers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedManager, setSelectedManager] = useState<User | null>(null);
  const [managedEmployees, setManagedEmployees] = useState<User[]>([]);
  const [showEmployeesDialog, setShowEmployeesDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchManagers();
  }, []);

  const fetchManagers = async () => {
    try {
      setIsLoading(true);
      const response = await getUsersByRole("MANAGER");
      setManagers(response.employees || []);
    } catch (error) {
      console.error("Error fetching managers:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load managers.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredManagers = managers.filter(manager => 
    manager.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    manager.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewTeam = async (manager: User) => {
    try {
      setSelectedManager(manager);
      setIsLoading(true);
      const response = await getUsersByManager(manager.id);
      setManagedEmployees(response.employees || []);
      setShowEmployeesDialog(true);
    } catch (error) {
      console.error("Error fetching team members:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load team members.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteManager = async () => {
    if (!selectedManager) return;
    
    try {
      setIsLoading(true);
      await deleteUser(selectedManager.id);
      await fetchManagers();
      
      toast({
        title: "Success",
        description: "Manager deleted successfully",
      });
      
      setShowDeleteDialog(false);
      setSelectedManager(null);
    } catch (error) {
      console.error("Error deleting manager:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete manager. Please ensure there are no employees assigned to this manager.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDelete = (manager: User) => {
    setSelectedManager(manager);
    setShowDeleteDialog(true);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('');
  };

  const getRandomColor = (name: string) => {
    const colors = [
      "bg-green-500",
      "bg-emerald-500",
      "bg-teal-500",
      "bg-lime-500",
      "bg-green-600"
    ];
    
    // Use the string to deterministically pick a color
    const charCodeSum = name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return colors[charCodeSum % colors.length];
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-green-800">Managers</h2>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search managers..."
            className="pl-8 border-green-200"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-10 text-green-600">
          Loading managers...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredManagers.length > 0 ? (
            filteredManagers.map((manager) => (
              <Card key={manager.id} className="overflow-hidden border-green-100 hover:shadow-md transition-shadow">
                <div className="bg-gradient-to-r from-green-500 to-green-600 h-20"></div>
                <CardContent className="p-0">
                  <div className="px-6 pb-6 pt-0 -mt-10 flex flex-col items-center">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center text-white text-xl font-bold border-4 border-white ${getRandomColor(manager.name)}`}>
                      {getInitials(manager.name)}
                    </div>
                    <h3 className="mt-3 text-xl font-semibold text-green-800">{manager.name}</h3>
                    <Badge className="mt-1 bg-emerald-100 text-emerald-800 hover:bg-emerald-200">Manager</Badge>
                    
                    <div className="w-full mt-5 space-y-2">
                      <div className="flex items-center text-sm text-green-700">
                        <Mail className="h-4 w-4 mr-3 text-green-500" />
                        <span className="truncate">{manager.email}</span>
                      </div>
                      {manager.phone_number && (
                        <div className="flex items-center text-sm text-green-700">
                          <Phone className="h-4 w-4 mr-3 text-green-500" />
                          <span>{manager.phone_number}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-6 w-full flex gap-2">
                      <Button 
                        onClick={() => handleViewTeam(manager)} 
                        className="flex-1 bg-green-100 text-green-700 hover:bg-green-200 border border-green-200"
                      >
                        <Users className="mr-2 h-4 w-4" />
                        View Team
                      </Button>
                      <Button 
                        onClick={() => confirmDelete(manager)} 
                        variant="outline" 
                        className="border-green-200 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center text-green-600 py-12">
              No managers found
            </div>
          )}
        </div>
      )}

      {/* View Team Dialog */}
      <Dialog open={showEmployeesDialog} onOpenChange={setShowEmployeesDialog}>
        <DialogContent className="max-w-3xl border-green-200">
          <DialogHeader>
            <DialogTitle className="text-green-800">
              Team Members - {selectedManager?.name}
            </DialogTitle>
            <DialogDescription className="text-green-600">
              Employees managed by {selectedManager?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="overflow-y-auto max-h-[60vh]">
            {managedEmployees.length > 0 ? (
              <div className="grid gap-4">
                {managedEmployees.map((employee) => (
                  <div 
                    key={employee.id} 
                    className="flex items-center justify-between p-3 border border-green-100 rounded-lg hover:bg-green-50"
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 mr-4">
                        {employee.name ? getInitials(employee.name) : ""}
                      </div>
                      <div>
                        <h4 className="font-medium text-green-800">{employee.name}</h4>
                        <p className="text-sm text-green-600">{employee.email}</p>
                      </div>
                    </div>
                    <Badge className={employee.role === "SUPERVISOR" ? "bg-teal-100 text-teal-800" : "bg-green-100 text-green-800"}>
                      {employee.role}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-green-600">
                No team members found
              </div>
            )}
          </div>
          <DialogFooter>
            <Button 
              onClick={() => setShowEmployeesDialog(false)} 
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="border-green-200">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600">Delete Manager</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this manager? This action cannot be undone.
              Any employees assigned to this manager will need to be reassigned.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-green-200 text-green-700">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteManager}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default Managers;