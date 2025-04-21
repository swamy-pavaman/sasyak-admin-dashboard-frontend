import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const authUser = localStorage.getItem("authUser");
    if (authUser) {
      // Redirect to dashboard if logged in
      navigate("/dashboard");
    } else {
      // Redirect to login page if not logged in
      navigate("/login");
    }
  }, [navigate]);

  return null;
};

export default Index;