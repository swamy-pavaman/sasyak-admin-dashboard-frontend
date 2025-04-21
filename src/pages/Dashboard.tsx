import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, UserCog, Briefcase, MapPin, LandPlot, 
  Sprout, Tractor, UserPlus, UserCircle, ClipboardList,
  CheckCircle, Clock, AlertCircle, ChevronRight
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import { getAllUsers, getUsersByRole, createUser, User } from "@/services/ApiService";

const Dashboard = () => {
  const [stats, setStats] = useState({
    employees: 0,
    managers: 0,
    supervisors: 0,
    scoutingEvents: 12, // Mock data
    landAcres: 560, // Mock data
    // Task stats
    totalTasks: 45,
    pendingTasks: 15,
    inProgressTasks: 20,
    completedTasks: 10,
    recentTasks: 8,
  });
  
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    phone_number: "",
    role: "EMPLOYEE",
    managerId: undefined as number | undefined,
  });
  
  const [managers, setManagers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch all users
        const allUsersData = await getAllUsers();
        
        // Fetch managers
        const managersData = await getUsersByRole("MANAGER");
        setManagers(managersData.employees);
        
        // Fetch supervisors
        const supervisorsData = await getUsersByRole("SUPERVISOR");
        
        // Update stats
        setStats({
          ...stats,
          employees: allUsersData.employees.length,
          managers: managersData.employees.length,
          supervisors: supervisorsData.employees.length,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast({
          variant: "destructive",
          title: "Error fetching data",
          description: "There was a problem loading the dashboard data.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const handleAddEmployee = async () => {
    try {
      setIsLoading(true);
      
      // Convert managerId to number if it exists
      const formattedEmployee = {
        ...newEmployee,
        managerId: newEmployee.managerId ? parseInt(String(newEmployee.managerId)) : undefined,
      };
      
      await createUser(formattedEmployee);
      
      // Update statistics
      setStats({
        ...stats,
        employees: stats.employees + 1,
        ...(formattedEmployee.role === "MANAGER" ? { managers: stats.managers + 1 } : {}),
        ...(formattedEmployee.role === "SUPERVISOR" ? { supervisors: stats.supervisors + 1 } : {}),
      });
      
      toast({
        title: "Employee added successfully",
        description: `${newEmployee.name} has been added to the system.`,
      });
      
      setOpenAddDialog(false);
      setNewEmployee({
        name: "",
        email: "",
        phone_number: "",
        role: "EMPLOYEE",
        managerId: undefined,
      });
      
    } catch (error) {
      console.error("Error adding employee:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewEmployee((prev) => ({ ...prev, [name]: value }));
  };

  const StatCard = ({ 
    icon: Icon, 
    title, 
    value, 
    href,
    bgColor = "bg-green-50", 
    iconColor = "text-green-600",
    valueColor = "text-green-700"
  }: {
    icon: any;
    title: string;
    value: number;
    href?: string;
    bgColor?: string;
    iconColor?: string;
    valueColor?: string;
  }) => {
    const cardContent = (
      <Card className="stat-card flex flex-col items-center justify-center p-4 h-full border-green-100 hover:shadow-md transition-all">
        <div className={`p-3 rounded-full ${bgColor} mb-3`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
        <p className={`stat-value text-xl font-bold ${valueColor}`}>{value}</p>
        <p className="stat-title text-sm text-center mt-1 text-green-800">{title}</p>
      </Card>
    );

    if (href) {
      return <Link to={href} className="block h-full">{cardContent}</Link>;
    }

    return cardContent;
  };

  return (
    <DashboardLayout>
      <div className="px-4 md:px-6 py-4 max-w-full overflow-hidden">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-green-800">Agriculture Admin Dashboard</h2>
            <p className="text-green-600 mt-1">
              Welcome back, {JSON.parse(localStorage.getItem("authUser") || "{}")?.username || "Admin"}
            </p>
          </div>
          <Button 
            onClick={() => setOpenAddDialog(true)} 
            className="mt-4 md:mt-0 bg-green-600 hover:bg-green-700"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Add Employee
          </Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
          <StatCard 
            icon={UserCircle} 
            title="Total Employees" 
            value={stats.employees} 
            href="/employees"
            bgColor="bg-green-50"
            iconColor="text-green-600"
            valueColor="text-green-700"
          />
          <StatCard 
            icon={UserCog} 
            title="Managers" 
            value={stats.managers} 
            href="/managers"
            bgColor="bg-emerald-50"
            iconColor="text-emerald-600"
            valueColor="text-emerald-700"
          />
          <StatCard 
            icon={Briefcase} 
            title="Supervisors" 
            value={stats.supervisors} 
            href="/supervisors"
            bgColor="bg-teal-50"
            iconColor="text-teal-600"
            valueColor="text-teal-700"
          />
          <StatCard 
            icon={MapPin} 
            title="Scouting Events" 
            value={stats.scoutingEvents}
            href="/scouting"
            bgColor="bg-amber-50"
            iconColor="text-amber-600"
            valueColor="text-amber-700"
          />
          <StatCard 
            icon={LandPlot} 
            title="Total Land (acres)" 
            value={stats.landAcres}
            href="/scouting"
            bgColor="bg-lime-50"
            iconColor="text-lime-600"
            valueColor="text-lime-700"
          />
        </div>

        {/* Task Management Section */}
        <h3 className="text-xl font-semibold text-green-800 mb-4">Task Management</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-green-100">
            <CardContent className="p-4 flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium text-green-700">Total Tasks</h4>
                <div className="bg-green-50 p-2 rounded-full">
                  <ClipboardList className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-green-800">{stats.totalTasks}</p>
              <Link to="/tasks" className="mt-2 text-xs text-green-600 flex items-center hover:text-green-700">
                View all tasks
                <ChevronRight className="ml-1 h-3 w-3" />
              </Link>
            </CardContent>
          </Card>
          
          <Card className="border-green-100">
            <CardContent className="p-4 flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium text-green-700">Pending</h4>
                <div className="bg-amber-50 p-2 rounded-full">
                  <Clock className="h-5 w-5 text-amber-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-amber-600">{stats.pendingTasks}</p>
              <p className="mt-2 text-xs text-amber-600">Waiting for action</p>
            </CardContent>
          </Card>
          
          <Card className="border-green-100">
            <CardContent className="p-4 flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium text-green-700">In Progress</h4>
                <div className="bg-blue-50 p-2 rounded-full">
                  <AlertCircle className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-blue-600">{stats.inProgressTasks}</p>
              <p className="mt-2 text-xs text-blue-600">Currently active tasks</p>
            </CardContent>
          </Card>
          
          <Card className="border-green-100">
            <CardContent className="p-4 flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium text-green-700">Completed</h4>
                <div className="bg-emerald-50 p-2 rounded-full">
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-emerald-600">{stats.completedTasks}</p>
              <p className="mt-2 text-xs text-emerald-600">Successfully completed</p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-green-100 p-6">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-lg font-semibold text-green-800 flex items-center">
                <Sprout className="mr-2 h-5 w-5 text-green-600" />
                Agriculture Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-4">
              <p className="text-green-700">
                Monitor your agricultural operations with our comprehensive dashboard. Track employees, land usage, and scouting events all in one place.
              </p>
              <div className="flex justify-end">
                <Button variant="outline" className="border-green-200 text-green-700 hover:bg-green-50">
                  View Reports
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-100 p-6">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-lg font-semibold text-green-800 flex items-center">
                <Tractor className="mr-2 h-5 w-5 text-green-600" />
                Operation Status
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-green-700">Field Operations</span>
                  <span className="text-green-600 font-medium">Active</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-green-700">Harvesting Schedule</span>
                  <span className="text-amber-600 font-medium">Pending</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-green-700">Equipment Maintenance</span>
                  <span className="text-emerald-600 font-medium">Completed</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-green-700">Recent Tasks</span>
                  <span className="text-blue-600 font-medium">{stats.recentTasks} new</span>
                </div>
              </div>
              <div className="flex justify-end">
                <Button variant="outline" className="border-green-200 text-green-700 hover:bg-green-50">
                  <Link to="/tasks">
                    Manage Tasks
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add Employee Dialog */}
        <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
          <DialogContent className="sm:max-w-[425px] border-green-200">
            <DialogHeader>
              <DialogTitle className="text-green-800">Add New Employee</DialogTitle>
              <DialogDescription className="text-green-600">
                Enter the details of the new employee to add them to the system.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-green-700">Employee Name</Label>
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
  value={newEmployee.managerId?.toString() || "none"} 
  onValueChange={(value) => setNewEmployee(prev => ({ 
    ...prev, 
    managerId: value === "none" ? undefined : parseInt(value) 
  }))}
>
  <SelectTrigger className="border-green-200">
    <SelectValue placeholder="Select a manager" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="none">None</SelectItem>
    {managers.map((manager) => (
      <SelectItem key={manager.id} value={manager.id.toString()}>
        {manager.name}
        </SelectItem>))}
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
                    <SelectItem value="none">None</SelectItem>
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
              <Button variant="outline" onClick={() => setOpenAddDialog(false)} className="border-green-200 text-green-700">
                Cancel
              </Button>
              <Button onClick={handleAddEmployee} className="bg-green-600 hover:bg-green-700" disabled={isLoading}>
                <UserPlus className="mr-2 h-4 w-4" />
                {isLoading ? "Adding..." : "Add Employee"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;