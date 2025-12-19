import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage"; // <--- Import New Page
import Portal from "./pages/Portal";
import RoleLogin from "./pages/RoleLogin";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import VoterDashboard from "./pages/VoterDashboard";

function App() {
  const user = localStorage.getItem("user"); 

  return (
    <BrowserRouter>
      <Routes>
        {/* 1. HOME PAGE (The Marketing Landing Page) */}
        <Route path="/" element={<LandingPage />} />

        {/* 2. THE GRAND HALL (Role Selection) */}
        <Route path="/portal" element={<Portal />} />

        {/* 3. LOGIN & SIGNUP */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/portal/:role" element={<RoleLogin />} />

        {/* 4. PROTECTED DASHBOARDS */}
        <Route path="/admin-dashboard" element={user ? <AdminDashboard /> : <Navigate to="/" />} />
        <Route path="/voter-dashboard" element={user ? <VoterDashboard /> : <Navigate to="/" />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;