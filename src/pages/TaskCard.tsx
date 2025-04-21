import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CalendarClock, 
  User, 
  Tag, 
  ChevronDown, 
  ChevronUp, 
  Check,
  CheckCircle,
  Clock,
  AlertCircle,
  Play
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface TaskCardProps {
  task: {
    id: number;
    taskType: string;
    description: string;
    status: string;
    createdBy: string;
    assignedTo: string;
    createdAt: string;
    updatedAt: string;
    detailsJson: string;
    imagesJson: string;
    implementationJson: string | null;
  };
  onUpdateStatus: (taskId: number, newStatus: string) => void;
  isAdmin: boolean;
}

const TaskCard = ({ task, onUpdateStatus, isAdmin }: TaskCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState(task.status);
  const [implementationNotes, setImplementationNotes] = useState("");

  // Parse JSON details
  const details = JSON.parse(task.detailsJson || "{}");
  const implementation = task.implementationJson ? JSON.parse(task.implementationJson) : null;
  
  // Format date to more readable format
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format task type for display
  const formatTaskType = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };

  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        );
      case "IN_PROGRESS":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            <Play className="mr-1 h-3 w-3" />
            In Progress
          </Badge>
        );
      case "COMPLETED":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="mr-1 h-3 w-3" />
            Completed
          </Badge>
        );
      case "SCHEDULED":
        return (
          <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
            <CalendarClock className="mr-1 h-3 w-3" />
            Scheduled
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            <AlertCircle className="mr-1 h-3 w-3" />
            {status}
          </Badge>
        );
    }
  };

  // Handle update task submission
  const handleUpdateTask = () => {
    onUpdateStatus(task.id, newStatus);
    setIsUpdateDialogOpen(false);
  };

  return (
    <Card className="border-green-100 hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-green-800">{task.description}</h3>
            <div className="flex items-center mt-1 text-sm text-green-600">
              <Tag className="h-4 w-4 mr-1" />
              <span>{formatTaskType(task.taskType)}</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            {getStatusBadge(task.status)}
            <Button 
              variant="ghost" 
              size="sm" 
              className="mt-1 h-6 text-xs text-green-700"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? (
                <>
                  <ChevronUp className="h-3.5 w-3.5 mr-1" />
                  Hide Details
                </>
              ) : (
                <>
                  <ChevronDown className="h-3.5 w-3.5 mr-1" />
                  View Details
                </>
              )}
            </Button>
          </div>
        </div>

        {expanded && (
          <div className="mt-4 pt-4 border-t border-green-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-green-700 mb-2">Task Details</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="font-medium text-green-800 mr-2 w-20">Assigned to:</span>
                    <span className="text-green-600 flex items-center">
                      <User className="h-3.5 w-3.5 mr-1 text-green-500" />
                      {task.assignedTo}
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-medium text-green-800 mr-2 w-20">Created:</span>
                    <span className="text-green-600 flex items-center">
                      <CalendarClock className="h-3.5 w-3.5 mr-1 text-green-500" />
                      {formatDate(task.createdAt)}
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-medium text-green-800 mr-2 w-20">Updated:</span>
                    <span className="text-green-600 flex items-center">
                      <CalendarClock className="h-3.5 w-3.5 mr-1 text-green-500" />
                      {formatDate(task.updatedAt)}
                    </span>
                  </li>
                  {details.priority && (
                    <li className="flex items-start">
                      <span className="font-medium text-green-800 mr-2 w-20">Priority:</span>
                      <span className="text-green-600">{details.priority}</span>
                    </li>
                  )}
                  {details.location && (
                    <li className="flex items-start">
                      <span className="font-medium text-green-800 mr-2 w-20">Location:</span>
                      <span className="text-green-600">{details.location}</span>
                    </li>
                  )}
                  {details.equipment && (
                    <li className="flex items-start">
                      <span className="font-medium text-green-800 mr-2 w-20">Equipment:</span>
                      <span className="text-green-600">{details.equipment}</span>
                    </li>
                  )}
                  {details.fieldLocation && (
                    <li className="flex items-start">
                      <span className="font-medium text-green-800 mr-2 w-20">Field:</span>
                      <span className="text-green-600">{details.fieldLocation}</span>
                    </li>
                  )}
                  {details.cropType && (
                    <li className="flex items-start">
                      <span className="font-medium text-green-800 mr-2 w-20">Crop:</span>
                      <span className="text-green-600">{details.cropType}</span>
                    </li>
                  )}
                  {details.scheduledDate && (
                    <li className="flex items-start">
                      <span className="font-medium text-green-800 mr-2 w-20">Scheduled:</span>
                      <span className="text-green-600">{details.scheduledDate}</span>
                    </li>
                  )}
                  {details.estimatedTime && (
                    <li className="flex items-start">
                      <span className="font-medium text-green-800 mr-2 w-20">Est. Time:</span>
                      <span className="text-green-600">{details.estimatedTime}</span>
                    </li>
                  )}
                  {details.notes && (
                    <li className="flex items-start">
                      <span className="font-medium text-green-800 mr-2 w-20">Notes:</span>
                      <span className="text-green-600">{details.notes}</span>
                    </li>
                  )}
                </ul>
              </div>
              
              {implementation && (
                <div>
                  <h4 className="text-sm font-medium text-green-700 mb-2">Implementation Details</h4>
                  <ul className="space-y-2 text-sm">
                    {implementation.completionTime && (
                      <li className="flex items-start">
                        <span className="font-medium text-green-800 mr-2 w-24">Completed at:</span>
                        <span className="text-green-600">{formatDate(implementation.completionTime)}</span>
                      </li>
                    )}
                    {implementation.startTime && (
                      <li className="flex items-start">
                        <span className="font-medium text-green-800 mr-2 w-24">Started at:</span>
                        <span className="text-green-600">{formatDate(implementation.startTime)}</span>
                      </li>
                    )}
                    {implementation.notes && (
                      <li className="flex items-start">
                        <span className="font-medium text-green-800 mr-2 w-24">Notes:</span>
                        <span className="text-green-600">{implementation.notes}</span>
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="px-4 py-3 bg-gray-50 border-t border-green-100 flex justify-end gap-2">
        {isAdmin && task.status !== "COMPLETED" && (
          <Button 
            variant="outline" 
            size="sm" 
            className="border-green-200 text-green-700 hover:bg-green-50"
            onClick={() => setIsUpdateDialogOpen(true)}
          >
            Update Status
          </Button>
        )}
      </CardFooter>

      {/* Update Task Status Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent className="sm:max-w-[425px] border-green-200">
          <DialogHeader>
            <DialogTitle className="text-green-800">Update Task Status</DialogTitle>
            <DialogDescription className="text-green-600">
              Change the status of this task and add implementation notes if needed.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="status" className="text-green-700">Status</Label>
              <Select 
                value={newStatus} 
                onValueChange={setNewStatus}
              >
                <SelectTrigger className="border-green-200">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {newStatus === "COMPLETED" && (
              <div className="grid gap-2">
                <Label htmlFor="notes" className="text-green-700">Implementation Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Enter implementation details"
                  className="border-green-200"
                  value={implementationNotes}
                  onChange={(e) => setImplementationNotes(e.target.value)}
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsUpdateDialogOpen(false)} 
              className="border-green-200 text-green-700"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateTask} 
              className="bg-green-600 hover:bg-green-700"
            >
              <Check className="mr-2 h-4 w-4" />
              Update Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default TaskCard;