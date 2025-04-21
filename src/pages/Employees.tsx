import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  UserPlus, Search, UserCircle , Mail, Phone, MoreHorizontal, 
  Edit, Trash2, UserCheck, UserCog 
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getAllUsers, getUsersByRole, createUser, updateUser, deleteUser, User } from "@/services/ApiService";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const Employees = () => {
  const [employees, setEmployees] = useState<User[]>([]);
  const [managers, setManagers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<User | null>(null);
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    phone_number: "",
    role: "EMPLOYEE",
    managerId: undefined as number | undefined
  });
  const { toast } = useToast();

  // Load employees
  useEffect(() => {
    fetchEmployees();
    fetchManagers();
  }, []);

  const fetchEmployees = async () => {
    try {
      setIsLoading(true);
      const response = await getAllUsers();
      setEmployees(response.employees);
    } catch (error) {
      console.error("Error fetching employees:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load employees. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchManagers = async () => {
    try {
      const response = await getUsersByRole("MANAGER");
      setManagers(response.employees);
    } catch (error) {
      console.error("Error fetching managers:", error);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredEmployees = employees.filter(employee => 
    employee.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddEmployee = async () => {
    try {
      setIsLoading(true);
      
      // Convert managerId to number if it exists
      const formattedEmployee = {
        ...newEmployee,
        managerId: newEmployee.managerId ? parseInt(String(newEmployee.managerId)) : undefined,
      };
      
      await createUser(formattedEmployee);
      await fetchEmployees();
      
      toast({
        title: "Success",
        description: "Employee added successfully",
      });
      
      setShowAddDialog(false);
      setNewEmployee({
        name: "",
        email: "",
        phone_number: "",
        role: "EMPLOYEE",
        managerId: undefined
      });
      
    } catch (error) {
      console.error("Error adding employee:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add employee. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditEmployee = async () => {
    if (!selectedEmployee) return;
    
    try {
      setIsLoading(true);
      
      await updateUser(selectedEmployee.id, selectedEmployee);
      await fetchEmployees();
      
      toast({
        title: "Success",
        description: "Employee updated successfully",
      });
      
      setShowEditDialog(false);
      setSelectedEmployee(null);
      
    } catch (error) {
      console.error("Error updating employee:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update employee. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEmployee = async () => {
    if (!selectedEmployee) return;
    
    try {
      setIsLoading(true);
      
      await deleteUser(selectedEmployee.id);
      await fetchEmployees();
      
      toast({
        title: "Success",
        description: "Employee deleted successfully",
      });
      
      setShowDeleteDialog(false);
      setSelectedEmployee(null);
      
    } catch (error) {
      console.error("Error deleting employee:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete employee. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewEmployee(prev => ({ ...prev, [name]: value }));
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedEmployee) return;
    
    const { name, value } = e.target;
    setSelectedEmployee(prev => {
      if (!prev) return prev;
      return { ...prev, [name]: value };
    });
  };

  const openEditDialog = (employee: User) => {
    setSelectedEmployee(employee);
    setShowEditDialog(true);
  };

  const openDeleteDialog = (employee: User) => {
    setSelectedEmployee(employee);
    setShowDeleteDialog(true);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'MANAGER':
        return <UserCog className="h-4 w-4 text-emerald-600" />;
      case 'SUPERVISOR':
        return <UserCheck className="h-4 w-4 text-teal-600" />;
      default:
        return <UserCircle  className="h-4 w-4 text-green-600" />;
    }
  };

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'MANAGER':
        return "bg-emerald-100 text-emerald-800";
      case 'SUPERVISOR':
        return "bg-teal-100 text-teal-800";
      default:
        return "bg-green-100 text-green-800";
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-green-800">Employees</h2>
        <div className="flex w-full sm:w-auto gap-2">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search employees..."
              className="pl-8 border-green-200"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <Button 
            onClick={() => setShowAddDialog(true)} 
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Add
          </Button>
        </div>
      </div>

      <Card className="border-green-100">
        <CardHeader className="border-b border-green-100 bg-green-50">
          <CardTitle className="text-green-800">Employee Directory</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-green-50">
                <tr className="text-left">
                  <th className="p-4 font-medium text-sm text-green-700">Name</th>
                  <th className="p-4 font-medium text-sm text-green-700">Contact</th>
                  <th className="p-4 font-medium text-sm text-green-700">Role</th>
                  <th className="p-4 font-medium text-sm text-green-700 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-green-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-green-600">
                      Loading employees...
                    </td>
                  </tr>
                ) : filteredEmployees.length > 0 ? (
                  filteredEmployees.map((employee) => (
                    <tr key={employee.id} className="hover:bg-green-50/60">
                      <td className="p-4 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center">
                          {getRoleIcon(employee.role)}
                        </div>
                        <span className="font-medium text-green-800">{employee.name}</span>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <div className="flex items-center">
                            <Mail className="mr-2 h-4 w-4 text-green-400" />
                            <span className="text-green-700">{employee.email}</span>
                          </div>
                          {employee.phone_number && (
                            <div className="flex items-center">
                              <Phone className="mr-2 h-4 w-4 text-green-400" />
                              <span className="text-green-700">{employee.phone_number}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getRoleBadgeClass(employee.role)}`}>
                          {employee.role}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-green-700 hover:text-green-900 hover:bg-green-50">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="border-green-100">
                            <DropdownMenuItem onClick={() => openEditDialog(employee)} className="text-green-700 hover:text-green-900 cursor-pointer">
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openDeleteDialog(employee)} className="text-red-600 hover:text-red-700 cursor-pointer">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-green-600">
                      No employees found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add Employee Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="border-green-200 sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-green-800">Add Employee</DialogTitle>
            <DialogDescription className="text-green-600">
              Add a new employee to the system
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-green-700">Name</Label>
              <Input
                id="name"
                name="name"
                value={newEmployee.name}
                onChange={handleInputChange}
                placeholder="John Doe"
                className="border-green-200"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-green-700">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={newEmployee.email}
                onChange={handleInputChange}
                placeholder="john.doe@example.com"
                className="border-green-200"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone_number" className="text-green-700">Phone Number</Label>
              <Input
                id="phone_number"
                name="phone_number"
                value={newEmployee.phone_number}
                onChange={handleInputChange}
                placeholder="+1 (555) 123-4567"
                className="border-green-200"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role" className="text-green-700">Role</Label>
              <Select 
                value={newEmployee.role} 
                onValueChange={(value) => setNewEmployee(prev => ({ ...prev, role: value }))}
              >
                <SelectTrigger className="border-green-200">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EMPLOYEE">Employee</SelectItem>
                  <SelectItem value="SUPERVISOR">Supervisor</SelectItem>
                  <SelectItem value="MANAGER">Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {(newEmployee.role === "EMPLOYEE" || newEmployee.role === "SUPERVISOR") && (
              <div className="grid gap-2">
                <Label htmlFor="managerId" className="text-green-700">Assign Manager</Label>
                <Select 
                  value={newEmployee.managerId?.toString() || ""} 
                  onValueChange={(value) => setNewEmployee(prev => ({ 
                    ...prev, 
                    managerId: value ? parseInt(value) : undefined 
                  }))}
                >
                  <SelectTrigger className="border-green-200">
                    <SelectValue placeholder="Select a manager" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {managers.map((manager) => (
                      <SelectItem key={manager.id} value={manager.id.toString()}>
                        {manager.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddDialog(false)}
              className="border-green-200 text-green-700"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddEmployee} 
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isLoading ? "Adding..." : "Add Employee"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Employee Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="border-green-200 sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-green-800">Edit Employee</DialogTitle>
            <DialogDescription className="text-green-600">
              Update employee information
            </DialogDescription>
          </DialogHeader>
          {selectedEmployee && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name" className="text-green-700">Name</Label>
                <Input
                  id="edit-name"
                  name="name"
                  value={selectedEmployee.name}
                  onChange={handleEditInputChange}
                  className="border-green-200"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-email" className="text-green-700">Email</Label>
                <Input
                  id="edit-email"
                  name="email"
                  type="email"
                  value={selectedEmployee.email}
                  onChange={handleEditInputChange}
                  className="border-green-200"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-phone" className="text-green-700">Phone Number</Label>
                <Input
                  id="edit-phone"
                  name="phone_number"
                  value={selectedEmployee.phone_number || ""}
                  onChange={handleEditInputChange}
                  className="border-green-200"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-role" className="text-green-700">Role</Label>
                <Select 
                  value={selectedEmployee.role} 
                  onValueChange={(value) => setSelectedEmployee(prev => {
                    if (!prev) return prev;
                    return { ...prev, role: value };
                  })}
                >
                  <SelectTrigger className="border-green-200">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EMPLOYEE">Employee</SelectItem>
                    <SelectItem value="SUPERVISOR">Supervisor</SelectItem>
                    <SelectItem value="MANAGER">Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {(selectedEmployee.role === "EMPLOYEE" || selectedEmployee.role === "SUPERVISOR") && (
                <div className="grid gap-2">
                  <Label htmlFor="edit-manager" className="text-green-700">Manager</Label>
                  <Select 
                    value={selectedEmployee.managerId?.toString() || ""} 
                    onValueChange={(value) => setSelectedEmployee(prev => {
                      if (!prev) return prev;
                      return { ...prev, managerId: value ? parseInt(value) : undefined };
                    })}
                  >
                    <SelectTrigger className="border-green-200">
                      <SelectValue placeholder="Select a manager" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {managers.map((manager) => (
                        <SelectItem key={manager.id} value={manager.id.toString()}>
                          {manager.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowEditDialog(false)}
              className="border-green-200 text-green-700"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleEditEmployee} 
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="border-green-200">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600">Delete Employee</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this employee? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-green-200 text-green-700">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteEmployee}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isLoading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default Employees;