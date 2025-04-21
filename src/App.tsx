import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "@/pages/Dashboard";
import TasksPage from "@/pages/TasksPage";
import Employees from "@/pages/Employees";
import Managers from "@/pages/Managers";
import Supervisors from "@/pages/Supervisors";
import Scouting from "@/pages/Scouting";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import "./App.css";

function App() {
  // Check if user is authenticated
  const isAuthenticated = () => {
    const authUser = localStorage.getItem("authUser");
    return authUser !== null;
  };

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        
        {/* Protected routes */}
        <Route 
          path="/" 
          element={isAuthenticated() ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/dashboard" 
          element={isAuthenticated() ? <Dashboard /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/tasks" 
          element={isAuthenticated() ? <TasksPage /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/employees" 
          element={isAuthenticated() ? <Employees /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/managers" 
          element={isAuthenticated() ? <Managers /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/supervisors" 
          element={isAuthenticated() ? <Supervisors /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/scouting" 
          element={isAuthenticated() ? <Scouting /> : <Navigate to="/login" />} 
        />
        
        {/* 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;