import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Sprout, Users, UserCog, LayoutDashboard, 
  LogOut, ChevronLeft, Briefcase, MapPin,
  ClipboardList
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { logout } from "@/services/ApiService";

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function Sidebar({ open, setOpen }: SidebarProps) {
  const location = useLocation();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
  };

  const sidebarItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Tasks",
      href: "/tasks",
      icon: ClipboardList,
    },
    {
      name: "Employees",
      href: "/employees",
      icon: Users,
    },
    {
      name: "Managers",
      href: "/managers",
      icon: UserCog,
    },
    {
      name: "Supervisors",
      href: "/supervisors",
      icon: Briefcase,
    },
    {
      name: "Land & Scouting",
      href: "/scouting",
      icon: MapPin,
    },
  ];

  return (
    <div
      className={cn(
        "flex flex-col fixed inset-y-0 z-50 bg-white border-r border-green-100 transition-all duration-300 ease-in-out shadow-sm",
        open ? "w-64" : "w-0 lg:w-20"
      )}
    >
      <div className="flex items-center justify-between p-4 h-16 border-b border-green-100">
        {open && (
          <div className="flex items-center space-x-2">
            <Sprout className="h-6 w-6 text-green-600" />
            <span className="font-semibold text-lg text-green-800">AgriAdmin</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setOpen(!open)}
          className={cn("hidden lg:flex text-green-700", !open && "mx-auto")}
        >
          <ChevronLeft
            className={cn(
              "h-5 w-5 transition-transform text-green-600",
              !open && "rotate-180"
            )}
          />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-2">
          {sidebarItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                location.pathname === item.href
                  ? "bg-green-100 text-green-800"
                  : "text-gray-700 hover:bg-green-50 hover:text-green-700",
                !open && "justify-center"
              )}
            >
              <item.icon className={cn("h-5 w-5 text-green-600", !open && "mx-auto")} />
              {open && <span className="ml-3">{item.name}</span>}
            </Link>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-green-100">
        <button
          onClick={handleLogout}
          className={cn(
            "flex items-center px-3 py-2 text-sm font-medium rounded-md text-red-600 hover:bg-red-50 w-full transition-colors",
            !open && "justify-center"
          )}
        >
          <LogOut className={cn("h-5 w-5", !open && "mx-auto")} />
          {open && <span className="ml-3">Logout</span>}
        </button>
      </div>
    </div>
  );
}