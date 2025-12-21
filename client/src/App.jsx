import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Portal from "./pages/Portal";
import RoleLogin from "./pages/RoleLogin";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import VoterDashboard from "./pages/VoterDashboard";

// ✅ IMPORT YOUR ADMIN LOGIN PAGE
// Ensure the file name matches exactly what is in your src/pages folder
import Login from "./pages/login"; 

function App() {
  const user = localStorage.getItem("token"); // Changed "user" to "token" (common practice)

  return (
    <BrowserRouter>
      <Routes>
        {/* 1. HOME PAGE */}
        <Route path="/" element={<LandingPage />} />

        {/* 2. THE GRAND HALL (Role Selection) */}
        <Route path="/portal" element={<Portal />} />

        {/* 3. LOGIN & SIGNUP */}
        <Route path="/signup" element={<Signup />} />
        
        {/* ✅ ADDED: The Secret Admin Login Route */}
        {/* Now if you type localhost:3000/secret-admin-access, it works! */}
        <Route path="/secret-admin-access" element={<Login />} />

        {/* Dynamic Route for Voter/Resident Login */}
        <Route path="/portal/:role" element={<RoleLogin />} />

        {/* 4. PROTECTED DASHBOARDS */}
        {/* If no user token, redirect to landing page ("/") */}
        <Route 
          path="/admin-dashboard" 
          element={user ? <AdminDashboard /> : <Navigate to="/secret-admin-access" />} 
        />
        
        <Route 
          path="/voter-dashboard" 
          element={user ? <VoterDashboard /> : <Navigate to="/portal/voter" />} 
        />

        {/* Fallback - Redirects unknown URLs to Home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;