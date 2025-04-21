import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Users, Mail, Phone, MapPin, UserCheck, Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getUsersByRole, deleteUser, User } from "@/services/ApiService";
import { useToast } from "@/components/ui/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const Supervisors = () => {
  const [supervisors, setSupervisors] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSupervisor, setSelectedSupervisor] = useState<User | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSupervisors();
  }, []);

  const fetchSupervisors = async () => {
    try {
      setIsLoading(true);
      const response = await getUsersByRole("SUPERVISOR");
      setSupervisors(response.employees || []);
    } catch (error) {
      console.error("Error fetching supervisors:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load supervisors.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredSupervisors = supervisors.filter(supervisor => 
    supervisor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supervisor.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteSupervisor = async () => {
    if (!selectedSupervisor) return;
    
    try {
      setIsLoading(true);
      await deleteUser(selectedSupervisor.id);
      await fetchSupervisors();
      
      toast({
        title: "Success",
        description: "Supervisor deleted successfully",
      });
      
      setShowDeleteDialog(false);
      setSelectedSupervisor(null);
    } catch (error) {
      console.error("Error deleting supervisor:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete supervisor.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDelete = (supervisor: User) => {
    setSelectedSupervisor(supervisor);
    setShowDeleteDialog(true);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('');
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-green-800">Supervisors</h2>
        <div className="relative flex-1 sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search supervisors..."
            className="pl-8 border-green-200"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-10 text-green-600">
          Loading supervisors...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredSupervisors.length > 0 ? (
            filteredSupervisors.map((supervisor) => (
              <Card key={supervisor.id} className="hover:shadow-md transition-shadow border-green-100">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-semibold text-lg">
                        {getInitials(supervisor.name)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between">
                        <h3 className="text-lg font-semibold text-green-800 truncate">{supervisor.name}</h3>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => confirmDelete(supervisor)}
                          className="h-6 w-6 p-0 rounded-full text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex mt-1">
                        <Badge className="bg-teal-100 text-teal-800">Supervisor</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 space-y-3">
                    <div className="flex items-center text-sm text-green-700">
                      <Mail className="h-4 w-4 mr-3 text-teal-500" />
                      <span className="truncate">{supervisor.email}</span>
                    </div>
                    {supervisor.phone_number && (
                      <div className="flex items-center text-sm text-green-700">
                        <Phone className="h-4 w-4 mr-3 text-teal-500" />
                        <span>{supervisor.phone_number}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-5 pt-4 border-t border-green-100">
                    <Button 
                      variant="outline" 
                      className="w-full border-teal-200 text-teal-700 hover:bg-teal-50 hover:text-teal-800"
                    >
                      <UserCheck className="mr-2 h-4 w-4" />
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center text-green-600 py-12">
              No supervisors found
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="border-green-200">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600">Delete Supervisor</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this supervisor? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-green-200 text-green-700">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteSupervisor}
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

export default Supervisors;