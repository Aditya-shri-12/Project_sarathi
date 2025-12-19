import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../lib/axios";
import { FiShield, FiUser, FiUsers, FiUserCheck, FiArrowLeft, FiLock } from "react-icons/fi";

const RoleLogin = () => {
  const { role } = useParams(); // Grabs 'admin', 'voter', 'candidate' from URL
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 🎨 CONFIGURATION: Controls the look & feel for each portal
  const portalConfig = {
    admin: {
      title: "Super Admin Portal",
      color: "bg-red-700",
      accent: "text-red-700",
      icon: <FiShield className="text-5xl text-white" />,
      desc: "Restricted Access. Authorized Personnel Only.",
      placeholder: "Enter Admin Email"
    },
    committee: {
      title: "Election Committee",
      color: "bg-orange-600",
      accent: "text-orange-600",
      icon: <FiUsers className="text-5xl text-white" />,
      desc: "Official Election Management Console.",
      placeholder: "Committee ID"
    },
    candidate: {
      title: "Candidate Access",
      color: "bg-purple-600",
      accent: "text-purple-600",
      icon: <FiUserCheck className="text-5xl text-white" />,
      desc: "Manage your campaign and manifesto.",
      placeholder: "Username"
    },
    voter: {
      title: "Voter Booth",
      color: "bg-blue-600",
      accent: "text-blue-600",
      icon: <FiUser className="text-5xl text-white" />,
      desc: "Secure Voting Interface.",
      placeholder: "Username or Flat Number"
    }
  };

  // Fallback to 'voter' style if URL is weird
  const currentConfig = portalConfig[role] || portalConfig.voter; 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      // 1. Send Credentials to Backend
      const res = await axios.post("/api/auth/login", formData);
      
      // 2. Security Check Complete - Save Token/User
      localStorage.setItem("user", JSON.stringify(res.data));
      
      // 3. Intelligent Redirect
      // If a Super Admin logs in via the "Voter" door, we still send them to Admin Dashboard
      if (res.data.isAdmin) {
        navigate("/admin-dashboard");
      } else {
        navigate("/voter-dashboard");
      }

    } catch (err) {
      // Show error message from backend (e.g., "Account Pending" or "Wrong Password")
      setError(err.response?.data || "Authentication failed. Please check credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans">
      
      {/* LEFT SIDE: Brand Identity (Hidden on Mobile) */}
      <div className={`hidden md:flex w-1/2 ${currentConfig.color} flex-col items-center justify-center p-12 text-white relative transition-all duration-500`}>
        <button 
          onClick={() => navigate('/')} 
          className="absolute top-8 left-8 flex items-center gap-2 text-white/80 hover:text-white font-semibold transition-colors group"
        >
           <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Portal
        </button>
        
        <div className="mb-8 p-6 bg-white/20 rounded-full backdrop-blur-sm shadow-xl ring-4 ring-white/10">
          {currentConfig.icon}
        </div>
        
        <h1 className="text-4xl font-extrabold mb-4 tracking-tight">{currentConfig.title}</h1>
        <p className="text-lg text-white/90 text-center max-w-md font-medium leading-relaxed">
          {currentConfig.desc}
        </p>

        {/* Security Badge */}
        <div className="absolute bottom-8 flex items-center gap-2 opacity-60 text-sm">
          <FiLock /> 256-bit AES Encryption Active
        </div>
      </div>

      {/* RIGHT SIDE: Secure Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-slate-50">
        <div className="max-w-md w-full bg-white p-10 rounded-2xl shadow-xl border border-slate-100">
          
          {/* Mobile Header (Only for small screens) */}
          <div className="md:hidden text-center mb-8">
             <div className={`inline-flex p-4 rounded-full ${currentConfig.color} text-white mb-4 shadow-lg`}>
                {currentConfig.icon}
             </div>
             <h2 className={`text-2xl font-bold ${currentConfig.accent}`}>
               {currentConfig.title}
             </h2>
          </div>

          <h3 className="text-2xl font-bold text-slate-800 mb-2">Welcome Back</h3>
          <p className="text-slate-500 mb-8">Please authenticate to continue.</p>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm rounded-xl border border-red-100 flex items-start gap-2 animate-pulse">
              <span className="font-bold">⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Identity</label>
              <input 
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-400 focus:border-slate-400 outline-none transition-all bg-slate-50 hover:bg-white"
                placeholder={currentConfig.placeholder}
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
              <input 
                type="password"
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-400 focus:border-slate-400 outline-none transition-all bg-slate-50 hover:bg-white"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className={`w-full py-4 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl hover:opacity-95 transform active:scale-[0.99] transition-all flex items-center justify-center gap-2 ${currentConfig.color}`}
            >
              {loading ? "Verifying..." : "Authenticate Access"}
            </button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
             <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">
               Sarthi Secure Gateway • v1.0
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleLogin;