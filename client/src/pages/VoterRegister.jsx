import { useState } from "react";
import axios from "../lib/axios";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const VoterRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    flatNumber: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Send data to the Bouncer
      const res = await axios.post("/api/auth/register", formData);
      
      alert("Registration Successful! Please Login.");
      navigate("/login"); // Send them to login page
      
    } catch (err) {
      // Show the error from the backend (e.g., "Access Denied")
      setError(err.response?.data || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white w-full max-w-md rounded-xl shadow-xl overflow-hidden border border-slate-200"
      >
        <div className="bg-slate-900 p-6 text-center">
          <h2 className="text-2xl font-bold text-white">Claim Voter Account</h2>
          <p className="text-slate-400 text-sm mt-1">Verify your identity to join.</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200">
                {error}
              </div>
            )}

            {/* WHITELIST CHECK FIELDS */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Flat No.</label>
                <input type="text" name="flatNumber" placeholder="e.g. A-102" required onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email</label>
                <input type="email" name="email" placeholder="registered@email.com" required onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink-0 mx-4 text-slate-400 text-xs">SET YOUR CREDENTIALS</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            {/* NEW ACCOUNT FIELDS */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Create Username</label>
              <input type="text" name="username" placeholder="e.g. Rahul_Verma" required onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Create Password</label>
              <input type="password" name="password" placeholder="••••••••" required onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all shadow-lg"
            >
              {loading ? "Verifying..." : "Register & Join"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-500">
            Already registered?{" "}
            <Link to="/login" className="text-blue-600 font-bold hover:underline">
              Login here
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default VoterRegister;