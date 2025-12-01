import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./pages/Home";
import LoginPage from "./pages/login";
import VoterDashboard from "./pages/VoterDashboard";
import AdminDashboard from "./pages/AdminDashboard"; // <--- 1. IMPORT THIS
import VoterRegister from "./pages/VoterRegister";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <div className="min-h-screen bg-slate-50">
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route path="/login" element={<LoginPage />} /> 
          
          {/* Voter Registration Route */}
          <Route path="/register" element={<VoterRegister />} />
          
          {/* Voter Route */}
          <Route path="/nominee/dashboard" element={<VoterDashboard />} />

          {/* Admin Route */}
          <Route path="/committee/dashboard" element={<AdminDashboard />} /> {/* <--- 2. ADD THIS */}
          
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;