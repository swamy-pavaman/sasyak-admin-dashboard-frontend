import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import { Menu, Sprout, LogOut } from "lucide-react";
import { logout } from "@/services/ApiService";
import TaskNotification from "./TaskNotification";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("Admin");

  useEffect(() => {
    // Check if user is authenticated
    const authUser = localStorage.getItem("authUser");
    if (!authUser) {
      navigate("/login");
    } else {
      try {
        const user = JSON.parse(authUser);
        setUsername(user.username || "Admin");
      } catch (error) {
        console.error("Error parsing auth user:", error);
      }
    }

    // Check screen size and adjust sidebar
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, [navigate]);

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex h-screen bg-green-50/30 overflow-hidden">
      {/* Sidebar with proper z-index to ensure it appears above content on mobile */}
      <div
        className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } fixed inset-y-0 left-0 z-40 w-64 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:w-64`}
      >
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      </div>

      {/* Main content area that adjusts based on sidebar visibility */}
      <div className={`flex-1 flex flex-col overflow-hidden ${sidebarOpen ? "lg:ml-0" : "ml-0"}`}>
        <header className="bg-white border-b border-green-100 shadow-sm flex justify-between items-center py-4 px-6">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="mr-4 lg:hidden text-green-700 hover:text-green-900 hover:bg-green-50"
            >
              <Menu className="h-6 w-6" />
            </Button>
            <div className="flex items-center">
              <Sprout className="h-6 w-6 text-green-600 mr-2" />
              <h1 className="text-xl font-semibold text-green-800">AgriAdmin</h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {/* Notifications Component */}
            <TaskNotification />
            
            <span className="text-sm font-medium text-green-700">
              {username}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-green-700 hover:text-green-900 hover:bg-green-50 rounded-full h-8 w-8">
                  <span className="sr-only">User menu</span>
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-700">
                    {username.charAt(0).toUpperCase()}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="border-green-100">
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="text-red-600 cursor-pointer flex items-center"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Content area with proper scrolling */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="container mx-auto max-w-full">
            {children}
            <Toaster />
          </div>
        </main>
      </div>

      {/* Overlay to close sidebar when clicking outside on mobile */}
      {sidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;