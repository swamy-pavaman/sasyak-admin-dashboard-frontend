import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="text-center p-8 max-w-md">
        <div className="mb-6 flex justify-center">
          <Sprout className="h-16 w-16 text-green-600" />
        </div>
        <h1 className="text-6xl font-bold text-green-800 mb-4">404</h1>
        <p className="text-xl text-green-700 mb-8">Oops! This page has yet to grow</p>
        <p className="text-green-600 mb-8">
          The page you're looking for couldn't be found. Let's get you back to cultivating success.
        </p>
        <Link to="/dashboard">
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            Return to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;