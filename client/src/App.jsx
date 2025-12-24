import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// --- PAGES IMPORT ---
import LandingPage from "./pages/LandingPage";
import Login from "./pages/login";             
import VoterRegister from "./pages/VoterRegister"; 

// --- DASHBOARDS IMPORT ---
import AdminDashboard from "./pages/AdminDashboard";
import ResidentDashboard from "./pages/ResidentDashboard";
import CandidateDashboard from "./pages/CandidateDashboard";
import NominationForm from "./pages/NominationForm"; 

function App() {
  // Simple check for login token
  const isAuthenticated = !!localStorage.getItem("token"); 

  return (
    <BrowserRouter>
      <Routes>
        
        {/* 1. PUBLIC ROUTES */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<VoterRegister />} />

        {/* --- 2. THE FIX: DIRECT ADMIN LOGIN URL --- */}
        {/* If you type localhost:5173/admin, it goes to the Red Login Screen */}
        <Route 
          path="/admin" 
          element={<Navigate to="/login" state={{ type: "admin", title: "Committee Portal" }} replace />} 
        />

        {/* --- 3. PROTECTED ROUTES --- */}
        
        {/* ADMIN: If not logged in, go to RED login screen */}
        <Route 
          path="/admin-dashboard" 
          element={
            isAuthenticated ? <AdminDashboard /> : 
            <Navigate to="/login" state={{ type: "admin", title: "Committee Portal" }} />
          } 
        />
        
        {/* RESIDENT: If not logged in, go to BLUE login screen */}
        <Route 
          path="/resident-dashboard" 
          element={
            isAuthenticated ? <ResidentDashboard /> : 
            <Navigate to="/login" state={{ type: "resident", title: "Resident Login" }} />
          } 
        />

        {/* CANDIDATE: If not logged in, go to PURPLE login screen */}
        <Route 
          path="/candidate-dashboard" 
          element={
            isAuthenticated ? <CandidateDashboard /> : 
            <Navigate to="/login" state={{ type: "resident", title: "Candidate Portal" }} />
          } 
        />

        {/* FEATURES */}
        <Route 
          path="/nomination-form" 
          element={isAuthenticated ? <NominationForm /> : <Navigate to="/login" />} 
        />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;