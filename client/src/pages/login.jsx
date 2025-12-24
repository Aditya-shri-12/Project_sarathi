import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"; 
import axios from "axios";
import { ShieldCheck, User, Vote, Lock } from "lucide-react"; 

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  const location = useLocation(); 

  // --- 1. DETERMINE LOGIN MODE ---
  // If user comes directly to /login, default to "Resident"
  const loginType = location.state?.type || "resident"; 
  const pageTitle = location.state?.title || "Resident Login";

  // --- 2. DYNAMIC HEADER UI ---
  const getIcon = () => {
    if (pageTitle.includes("Committee")) return <ShieldCheck size={48} className="text-red-600 mb-3" />;
    if (pageTitle.includes("Candidate")) return <Vote size={48} className="text-purple-600 mb-3" />;
    return <User size={48} className="text-blue-600 mb-3" />;
  };

  const getThemeColor = () => {
    if (pageTitle.includes("Committee")) return "bg-red-600 hover:bg-red-700";
    if (pageTitle.includes("Candidate")) return "bg-purple-600 hover:bg-purple-700";
    return "bg-blue-600 hover:bg-blue-700";
  };

  // --- 3. HANDLE LOGIN LOGIC ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    // Endpoint Selection
    let apiEndpoint = "http://localhost:5000/api/auth/login"; 
    if (loginType === "admin") {
      apiEndpoint = "http://localhost:5000/api/auth/admin-login";
    }

    try {
      const res = await axios.post(apiEndpoint, { email, password });

      if (res.data.success) {
        // Save Credentials
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.role);

        // --- SMART REDIRECT (The Brain) ---
        // This switch decides exactly where the user lands based on their database role
        switch(res.data.role) {
            case 'admin':
                window.location.href = "/admin-dashboard";
                break;
            case 'candidate':
                window.location.href = "/candidate-dashboard";
                break;
            default:
                // If role is 'resident' or anything else
                window.location.href = "/resident-dashboard";
        }
      }

    } catch (err) {
      console.error("Login Error:", err);
      let msg = "Login Failed";
      if (err.response?.data?.message) msg = err.response.data.message;
      else if (err.response?.data?.error) msg = err.response.data.error;
      setError(msg); 
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-50">
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md border border-slate-100">
        
        {/* HEADER */}
        <div className="flex flex-col items-center mb-8">
          <div className="p-3 bg-slate-50 rounded-full mb-2">
            {getIcon()}
          </div>
          <h1 className="text-3xl font-bold text-slate-800">{pageTitle}</h1>
          <p className="text-slate-400 text-sm mt-2 flex items-center gap-1">
            <Lock size={12} /> Secure Access Portal
          </p>
        </div>
        
        {/* ERROR MESSAGE */}
        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm border border-red-100 flex items-center gap-2">
            <ShieldCheck size={16} /> {error}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
            <input
              type="email"
              placeholder="e.g. resident@society.com"
              className="w-full border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-slate-800 focus:border-transparent outline-none transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-slate-800 focus:border-transparent outline-none transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            className={`text-white p-4 rounded-xl font-bold shadow-lg transition transform active:scale-95 mt-2 ${getThemeColor()}`}
          >
            {loginType === 'admin' ? "ACCESS DASHBOARD" : "SECURE LOGIN"}
          </button>
        </form>

        {/* FOOTER */}
        <div className="mt-8 text-center pt-6 border-t border-slate-100">
           <button 
             onClick={() => navigate('/')} 
             className="text-sm text-slate-400 hover:text-slate-800 font-medium transition"
           >
             ← Return to Home
           </button>
        </div>

      </div>
    </div>
  );
};

export default Login;