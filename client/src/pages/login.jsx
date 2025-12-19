import { useState } from "react";
import axios from "../lib/axios";
import { useNavigate, Link } from "react-router-dom"; // <--- Both imports in one line
import { motion } from "framer-motion";


const Login = () => {
  const [activeTab, setActiveTab] = useState("voter"); // 'voter' or 'admin'
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Handle typing in boxes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle the "Sign In" button click
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Send data to backend
      const res = await axios.post("/api/auth/login", formData);
      
      // If success, save the user info to browser memory
      // (res.data contains the User ID and info we sent from backend)
      localStorage.setItem("user", JSON.stringify(res.data));
      
      alert("Login Successful! Welcome " + res.data.username);
      
      // Redirect based on who they are
      if (activeTab === "admin") {
        navigate("/committee/dashboard");
      } else {
        navigate("/nominee/dashboard");
      }

    } catch (err) {
      // If backend says "Wrong Password", show it here
      setError(err.response?.data || "Login failed. Check server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white w-full max-w-md rounded-xl shadow-xl overflow-hidden border border-slate-200"
      >
        
        {/* --- TAB SWITCHER --- */}
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab("voter")}
            className={`flex-1 py-4 text-sm font-bold transition-colors ${
              activeTab === "voter" ? "bg-blue-600 text-white" : "bg-slate-50 text-slate-600 hover:bg-slate-100"
            }`}
          >
            Voter Login
          </button>
          <button
            onClick={() => setActiveTab("admin")}
            className={`flex-1 py-4 text-sm font-bold transition-colors ${
              activeTab === "admin" ? "bg-amber-500 text-white" : "bg-slate-50 text-slate-600 hover:bg-slate-100"
            }`}
          >
            Committee Login
          </button>
        </div>

        {/* --- LOGIN FORM --- */}
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-800">
              {activeTab === "voter" ? "Welcome Voter" : "Admin Portal"}
            </h2>
            <p className="text-slate-500 text-sm">Enter your credentials to access secure voting.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200 text-center">
                {error}
              </div>
            )}

            {/* Username Field */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Enter your username"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="••••••••"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg font-bold text-white transition-all ${
                activeTab === "voter" ? "bg-blue-600 hover:bg-blue-700" : "bg-amber-500 hover:bg-amber-600"
              }`}
            >
              {loading ? "Verifying..." : "Sign In"}
            </button>
          </form>
        </div>

        {/* --- ADD THIS FOOTER --- */}
        <div className="bg-slate-50 p-4 text-center text-sm text-slate-500 border-t border-slate-100">
          New Resident?{" "}
          <Link to="/signup" className="text-blue-600 font-bold hover:underline">
            Claim your account
          </Link>
        </div>

      </motion.div>
    </div>
  );
};

export default Login;