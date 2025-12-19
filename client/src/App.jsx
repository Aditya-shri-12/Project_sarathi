import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// 1. IMPORT ALL PAGES
import Login from "./pages/Login";       // (Optional: If you still use generic login)
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import VoterDashboard from "./pages/VoterDashboard";
import Portal from "./pages/Portal";     // <--- The 5-Card Home Page
import RoleLogin from "./pages/RoleLogin"; // <--- The "Universal" Login Page we made

function App() {
  // Simple auth check (In real app, check context/state)
  const user = localStorage.getItem("user"); 

  return (
    <BrowserRouter>
      <Routes>
        {/* ==============================
            PUBLIC ROUTES
        ============================== */}
        
        {/* 1. HOME PAGE (The 5-Card Portal) */}
        <Route path="/" element={<Portal />} />

        {/* 2. REGISTRATION (New Residents) */}
        <Route path="/signup" element={<Signup />} />

        {/* 3. DYNAMIC LOGIN PORTALS */}
        {/* Catches: /portal/voter, /portal/admin, /portal/candidate, etc. */}
        <Route path="/portal/:role" element={<RoleLogin />} />


        {/* ==============================
            PROTECTED ROUTES (Dashboards)
        ============================== */}
        
        <Route 
          path="/admin-dashboard" 
          element={user ? <AdminDashboard /> : <Navigate to="/" />} 
        />
        
        <Route 
          path="/voter-dashboard" 
          element={user ? <VoterDashboard /> : <Navigate to="/" />} 
        />

        {/* ==============================
            FALLBACK (404)
        ============================== */}
        {/* If route doesn't exist, go back to Portal */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;