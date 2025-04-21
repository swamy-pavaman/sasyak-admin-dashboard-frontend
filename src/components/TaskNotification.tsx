import { useState, useEffect } from "react";
import { 
  Bell, 
  CheckCircle, 
  ClipboardList, 
  AlertCircle,
  Clock,
  Play,
  Calendar
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";

// Mock notifications
const mockNotifications = [
  {
    id: 1,
    title: "Task Status Updated",
    message: "Task 'Inspect north field for pest damage' has been marked as In Progress",
    taskId: 1,
    isRead: false,
    createdAt: new Date(Date.now() - 30 * 60000).toISOString() // 30 minutes ago
  },
  {
    id: 2,
    title: "Task Completed",
    message: "Task 'Plant corn in east field' has been completed",
    taskId: 3,
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60000).toISOString() // 2 hours ago
  },
  {
    id: 3,
    title: "New Task Assigned",
    message: "A new task 'Check irrigation system in the southern fields' has been assigned",
    taskId: 4,
    isRead: true,
    createdAt: new Date(Date.now() - 5 * 60 * 60000).toISOString() // 5 hours ago
  },
  {
    id: 4,
    title: "Task Scheduled",
    message: "Task 'Harvest wheat in west field' has been scheduled",
    taskId: 5,
    isRead: true,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60000).toISOString() // 1 day ago
  }
];

// Format relative time (e.g., "2 hours ago")
const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'just now';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
};

const TaskNotifications = () => {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  // Calculate unread notifications count
  useEffect(() => {
    const count = notifications.filter(notification => !notification.isRead).length;
    setUnreadCount(count);
    
    // In a real application, you would fetch notifications here
    // Example:
    // const fetchNotifications = async () => {
    //   try {
    //     const response = await getNotifications();
    //     setNotifications(response.notifications);
    //   } catch (error) {
    //     console.error("Error fetching notifications:", error);
    //   }
    // };
    //
    // fetchNotifications();
    
    // Set up polling for notifications in a real app
    // const intervalId = setInterval(fetchNotifications, 60000); // Poll every minute
    // return () => clearInterval(intervalId);
  }, [notifications]);

  // Mark notification as read
  const markAsRead = (notificationId: number) => {
    setNotifications(notifications.map(notification => 
      notification.id === notificationId 
        ? { ...notification, isRead: true } 
        : notification
    ));
    
    // In a real app, you would make an API call here
    // Example: await markNotificationAsRead(notificationId);
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    if (unreadCount === 0) return;
    
    setNotifications(notifications.map(notification => ({ ...notification, isRead: true })));
    
    // In a real app, you would make an API call here
    // Example: await markAllNotificationsAsRead();
    
    toast({
      title: "All notifications marked as read",
      description: `${unreadCount} notifications have been marked as read.`
    });
    
    setIsOpen(false);
  };

  // Get icon based on notification title
  const getNotificationIcon = (title: string) => {
    if (title.includes("Completed")) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    } else if (title.includes("Progress")) {
      return <Play className="h-4 w-4 text-blue-500" />;
    } else if (title.includes("Assigned") || title.includes("New Task")) {
      return <ClipboardList className="h-4 w-4 text-purple-500" />;
    } else if (title.includes("Scheduled")) {
      return <Calendar className="h-4 w-4 text-amber-500" />;
    } else if (title.includes("Status")) {
      return <AlertCircle className="h-4 w-4 text-blue-500" />;
    }
    return <Clock className="h-4 w-4 text-gray-500" />;
  };

  // Navigate to task detail
  const navigateToTask = (taskId: number, notificationId: number) => {
    // Mark as read when navigating
    markAsRead(notificationId);
    
    // Close dropdown
    setIsOpen(false);
    
    // In a real application, this would navigate to the task detail page
    // navigate(`/tasks/${taskId}`);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-green-700" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 mr-4">
        <DropdownMenuLabel className="flex justify-between items-center">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 px-2 text-xs"
              onClick={markAllAsRead}
            >
              Mark all as read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {notifications.length > 0 ? (
          <>
            {notifications.map((notification) => (
              <DropdownMenuItem 
                key={notification.id} 
                className={`p-3 cursor-pointer ${!notification.isRead ? 'bg-green-50' : ''}`}
                onClick={() => navigateToTask(notification.taskId, notification.id)}
              >
                <div className="flex gap-3">
                  <div className="shrink-0 mt-1">
                    {getNotificationIcon(notification.title)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium leading-none">
                        {notification.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatRelativeTime(notification.createdAt)}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-2">{notification.message}</p>
                    {!notification.isRead && (
                      <Badge className="mt-1 bg-green-100 text-green-800 hover:bg-green-100 text-xs">
                        New
                      </Badge>
                    )}
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
            
            <DropdownMenuSeparator />
            
            <div className="p-2 text-center">
              <Link 
                to="/tasks" 
                className="text-xs text-green-600 hover:text-green-800"
                onClick={() => setIsOpen(false)}
              >
                View all tasks
              </Link>
            </div>
          </>
        ) : (
          <div className="py-6 text-center text-sm text-gray-500">
            No notifications
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TaskNotifications;