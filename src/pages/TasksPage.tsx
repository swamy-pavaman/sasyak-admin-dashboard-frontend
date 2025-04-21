import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Plus, 
  List, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Filter,
  Calendar, 
  ChevronRight, 
  Clipboard
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import TaskCard from "./TaskCard";
import { getUsersByRole } from "@/services/ApiService";

// Mock tasks since we don't have a real API for this demo
const mockTasks = [
  {
    id: 1,
    taskType: "FIELD_INSPECTION",
    description: "Inspect north field for pest damage",
    status: "PENDING",
    createdBy: "Admin User",
    assignedTo: "John Smith",
    createdAt: "2025-04-15T10:30:00Z",
    updatedAt: "2025-04-15T10:30:00Z",
    detailsJson: JSON.stringify({
      location: "North Field - Block A",
      priority: "High",
      estimatedTime: "2 hours"
    }),
    imagesJson: JSON.stringify([]),
    implementationJson: null
  },
  {
    id: 2,
    taskType: "EQUIPMENT_MAINTENANCE",
    description: "Perform regular maintenance on tractor #3",
    status: "IN_PROGRESS",
    createdBy: "Admin User",
    assignedTo: "Michael Johnson",
    createdAt: "2025-04-14T09:15:00Z",
    updatedAt: "2025-04-16T11:45:00Z",
    detailsJson: JSON.stringify({
      equipment: "Tractor #3",
      maintenanceType: "Regular",
      parts: ["Oil filter", "Air filter"]
    }),
    imagesJson: JSON.stringify([]),
    implementationJson: JSON.stringify({
      startTime: "2025-04-16T10:00:00Z",
      notes: "Started maintenance process, waiting for parts"
    })
  },
  {
    id: 3,
    taskType: "CROP_PLANTING",
    description: "Plant corn in east field",
    status: "COMPLETED",
    createdBy: "Admin User", 
    assignedTo: "Sarah Williams",
    createdAt: "2025-04-10T08:00:00Z",
    updatedAt: "2025-04-13T16:30:00Z",
    detailsJson: JSON.stringify({
      cropType: "Corn",
      fieldLocation: "East Field",
      seedAmount: "200 kg"
    }),
    imagesJson: JSON.stringify([]),
    implementationJson: JSON.stringify({
      completionTime: "2025-04-13T16:30:00Z",
      notes: "Planting completed successfully, used tractor #2"
    })
  },
  {
    id: 4,
    taskType: "IRRIGATION_CHECK",
    description: "Check irrigation system in the southern fields",
    status: "PENDING",
    createdBy: "Admin User",
    assignedTo: "Emily Brown",
    createdAt: "2025-04-18T14:20:00Z",
    updatedAt: "2025-04-18T14:20:00Z",
    detailsJson: JSON.stringify({
      system: "Drip irrigation",
      area: "Southern fields",
      priority: "Medium"
    }),
    imagesJson: JSON.stringify([]),
    implementationJson: null
  },
  {
    id: 5,
    taskType: "HARVESTING",
    description: "Harvest wheat in west field",
    status: "SCHEDULED",
    createdBy: "Admin User",
    assignedTo: "David Clark",
    createdAt: "2025-04-17T11:00:00Z",
    updatedAt: "2025-04-17T11:00:00Z",
    detailsJson: JSON.stringify({
      cropType: "Wheat",
      fieldLocation: "West Field",
      scheduledDate: "2025-04-25",
      equipmentNeeded: ["Combine harvester", "Trailer"]
    }),
    imagesJson: JSON.stringify([]),
    implementationJson: null
  }
];

const TasksPage = () => {
  const [tasks, setTasks] = useState(mockTasks);
  const [filteredTasks, setFilteredTasks] = useState(mockTasks);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTab, setCurrentTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false);
  const [employees, setEmployees] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newTask, setNewTask] = useState({
    taskType: "FIELD_INSPECTION",
    description: "",
    assignedToId: "",
    details: {
      location: "",
      priority: "Medium",
      notes: ""
    }
  });
  
  const tasksPerPage = 5;
  const { toast } = useToast();

  // Fetch employees for task assignment
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await getUsersByRole("EMPLOYEE");
        setEmployees(response.employees);
      } catch (error) {
        console.error("Error fetching employees:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load employees for task assignment."
        });
      }
    };

    fetchEmployees();
  }, [toast]);

  // Filter tasks based on search term and current tab
  useEffect(() => {
    let result = tasks;
    
    // Filter by search term
    if (searchTerm) {
      result = result.filter(task => 
        task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.taskType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.assignedTo.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by tab
    if (currentTab !== "all") {
      result = result.filter(task => task.status.toLowerCase() === currentTab.toLowerCase());
    }
    
    setFilteredTasks(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, currentTab, tasks]);

  // Get tasks for current page
  const getCurrentPageTasks = () => {
    const startIndex = (currentPage - 1) * tasksPerPage;
    return filteredTasks.slice(startIndex, startIndex + tasksPerPage);
  };

  // Calculate total pages
  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

  // Handle task creation
  const handleAddTask = () => {
    // In a real application, this would make an API call
    const newTaskObj = {
      id: Math.max(...tasks.map(t => t.id)) + 1,
      taskType: newTask.taskType,
      description: newTask.description,
      status: "PENDING",
      createdBy: "Admin User",
      assignedTo: employees.find(e => e.id === parseInt(newTask.assignedToId))?.name || "Unassigned",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      detailsJson: JSON.stringify(newTask.details),
      imagesJson: JSON.stringify([]),
      implementationJson: null
    };
    
    // Add to tasks list
    setTasks([newTaskObj, ...tasks]);
    
    // Show success toast
    toast({
      title: "Task created",
      description: "The task has been created and assigned successfully."
    });
    
    // Close dialog and reset form
    setIsAddTaskDialogOpen(false);
    setNewTask({
      taskType: "FIELD_INSPECTION",
      description: "",
      assignedToId: "",
      details: {
        location: "",
        priority: "Medium",
        notes: ""
      }
    });
  };

  // Handle task status update
  const handleUpdateTaskStatus = (taskId: number, newStatus: string) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          status: newStatus,
          updatedAt: new Date().toISOString()
        };
      }
      return task;
    });
    
    setTasks(updatedTasks);
    
    toast({
      title: "Task updated",
      description: `Task status updated to ${newStatus}.`
    });
  };

  return (
    <DashboardLayout>
      <div className="px-4 md:px-6 py-4 max-w-full overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h2 className="text-2xl font-bold text-green-800">Task Management</h2>
          <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search tasks..."
                className="pl-8 border-green-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button 
              onClick={() => setIsAddTaskDialogOpen(true)} 
              className="bg-green-600 hover:bg-green-700 flex-shrink-0"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Task
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-green-100">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm text-green-600">Total Tasks</span>
                <span className="text-2xl font-bold text-green-800">{tasks.length}</span>
              </div>
              <div className="bg-green-50 p-3 rounded-full">
                <List className="h-5 w-5 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-green-100">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm text-green-600">Pending</span>
                <span className="text-2xl font-bold text-green-800">
                  {tasks.filter(t => t.status === "PENDING").length}
                </span>
              </div>
              <div className="bg-amber-50 p-3 rounded-full">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-green-100">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm text-green-600">In Progress</span>
                <span className="text-2xl font-bold text-green-800">
                  {tasks.filter(t => t.status === "IN_PROGRESS").length}
                </span>
              </div>
              <div className="bg-blue-50 p-3 rounded-full">
                <AlertCircle className="h-5 w-5 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-green-100">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm text-green-600">Completed</span>
                <span className="text-2xl font-bold text-green-800">
                  {tasks.filter(t => t.status === "COMPLETED").length}
                </span>
              </div>
              <div className="bg-emerald-50 p-3 rounded-full">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-green-100 mb-6">
          <CardHeader className="p-4 border-b border-green-100">
            <div className="flex justify-between items-center">
              <CardTitle className="text-green-800">Task List</CardTitle>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" className="border-green-200 text-green-700">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
                <Button variant="outline" size="sm" className="border-green-200 text-green-700">
                  <Calendar className="mr-2 h-4 w-4" />
                  Date
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs defaultValue="all" onValueChange={setCurrentTab}>
              <div className="px-4 pt-4">
                <TabsList className="bg-green-50 w-full justify-start border border-green-100">
                  <TabsTrigger 
                    value="all" 
                    className="data-[state=active]:bg-green-100 data-[state=active]:text-green-800"
                  >
                    All Tasks
                  </TabsTrigger>
                  <TabsTrigger 
                    value="pending" 
                    className="data-[state=active]:bg-green-100 data-[state=active]:text-green-800"
                  >
                    Pending
                  </TabsTrigger>
                  <TabsTrigger 
                    value="in_progress" 
                    className="data-[state=active]:bg-green-100 data-[state=active]:text-green-800"
                  >
                    In Progress
                  </TabsTrigger>
                  <TabsTrigger 
                    value="completed" 
                    className="data-[state=active]:bg-green-100 data-[state=active]:text-green-800"
                  >
                    Completed
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="all" className="p-0">
                <div className="p-4 space-y-4">
                  {getCurrentPageTasks().length > 0 ? (
                    getCurrentPageTasks().map(task => (
                      <TaskCard 
                        key={task.id} 
                        task={task} 
                        onUpdateStatus={handleUpdateTaskStatus}
                        isAdmin={true}
                      />
                    ))
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      <Clipboard className="mx-auto h-8 w-8 mb-2" />
                      <p>No tasks found</p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="pending" className="p-0">
                <div className="p-4 space-y-4">
                  {getCurrentPageTasks().length > 0 ? (
                    getCurrentPageTasks().map(task => (
                      <TaskCard 
                        key={task.id} 
                        task={task} 
                        onUpdateStatus={handleUpdateTaskStatus}
                        isAdmin={true}
                      />
                    ))
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      <Clipboard className="mx-auto h-8 w-8 mb-2" />
                      <p>No pending tasks found</p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="in_progress" className="p-0">
                <div className="p-4 space-y-4">
                  {getCurrentPageTasks().length > 0 ? (
                    getCurrentPageTasks().map(task => (
                      <TaskCard 
                        key={task.id} 
                        task={task} 
                        onUpdateStatus={handleUpdateTaskStatus}
                        isAdmin={true}
                      />
                    ))
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      <Clipboard className="mx-auto h-8 w-8 mb-2" />
                      <p>No in-progress tasks found</p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="completed" className="p-0">
                <div className="p-4 space-y-4">
                  {getCurrentPageTasks().length > 0 ? (
                    getCurrentPageTasks().map(task => (
                      <TaskCard 
                        key={task.id} 
                        task={task} 
                        onUpdateStatus={handleUpdateTaskStatus}
                        isAdmin={true}
                      />
                    ))
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      <Clipboard className="mx-auto h-8 w-8 mb-2" />
                      <p>No completed tasks found</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
            
            {totalPages > 1 && (
              <div className="p-4 border-t border-green-100">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink
                          onClick={() => setCurrentPage(i + 1)}
                          isActive={currentPage === i + 1}
                          className={currentPage === i + 1 ? "bg-green-100 text-green-800" : ""}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add Task Dialog */}
      <Dialog open={isAddTaskDialogOpen} onOpenChange={setIsAddTaskDialogOpen}>
        <DialogContent className="sm:max-w-[500px] border-green-200">
          <DialogHeader>
            <DialogTitle className="text-green-800">Create New Task</DialogTitle>
            <DialogDescription className="text-green-600">
              Fill out the details to create a new task and assign it to an employee.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="taskType" className="text-green-700">Task Type</Label>
              <Select 
                value={newTask.taskType} 
                onValueChange={(value) => setNewTask({...newTask, taskType: value})}
              >
                <SelectTrigger className="border-green-200">
                  <SelectValue placeholder="Select task type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FIELD_INSPECTION">Field Inspection</SelectItem>
                  <SelectItem value="EQUIPMENT_MAINTENANCE">Equipment Maintenance</SelectItem>
                  <SelectItem value="CROP_PLANTING">Crop Planting</SelectItem>
                  <SelectItem value="IRRIGATION_CHECK">Irrigation Check</SelectItem>
                  <SelectItem value="HARVESTING">Harvesting</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description" className="text-green-700">Task Description</Label>
              <Textarea
                id="description"
                placeholder="Enter a detailed description of the task"
                className="border-green-200"
                value={newTask.description}
                onChange={(e) => setNewTask({...newTask, description: e.target.value})}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="assignedTo" className="text-green-700">Assign To</Label>
              <Select 
                value={newTask.assignedToId} 
                onValueChange={(value) => setNewTask({...newTask, assignedToId: value})}
              >
                <SelectTrigger className="border-green-200">
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id.toString()}>
                      {employee.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="location" className="text-green-700">Location/Area</Label>
              <Input
                id="location"
                placeholder="Enter task location"
                className="border-green-200"
                value={newTask.details.location}
                onChange={(e) => setNewTask({
                  ...newTask, 
                  details: {...newTask.details, location: e.target.value}
                })}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="priority" className="text-green-700">Priority</Label>
              <Select 
                value={newTask.details.priority} 
                onValueChange={(value) => setNewTask({
                  ...newTask, 
                  details: {...newTask.details, priority: value}
                })}
              >
                <SelectTrigger className="border-green-200">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="notes" className="text-green-700">Additional Notes</Label>
              <Textarea
                id="notes"
                placeholder="Enter any additional notes"
                className="border-green-200"
                value={newTask.details.notes}
                onChange={(e) => setNewTask({
                  ...newTask, 
                  details: {...newTask.details, notes: e.target.value}
                })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsAddTaskDialogOpen(false)} 
              className="border-green-200 text-green-700"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddTask} 
              className="bg-green-600 hover:bg-green-700" 
              disabled={!newTask.description || !newTask.taskType}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default TasksPage;