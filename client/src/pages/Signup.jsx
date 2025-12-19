import { useState } from "react";
import axios from "../lib/axios";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    flatNumber: ""
  });
  const [status, setStatus] = useState("idle"); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      await axios.post("/api/auth/signup", formData);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err.response?.data || "Signup failed");
    }
  };

  if (status === "success") {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md text-center">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">✓</div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Request Sent!</h2>
          <p className="text-slate-600 mb-6">
            Your registration is currently <b>Pending Approval</b>. 
            Please wait for the Committee to verify your details.
          </p>
          <Link to="/login" className="text-blue-600 font-bold hover:underline">Return to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-slate-800 mb-1">New Resident Registration</h2>
        <p className="text-slate-500 text-sm mb-6">Apply for voting access.</p>

        {status === "error" && (
          <div className="p-3 bg-red-50 text-red-600 text-sm rounded mb-4 border border-red-200">{errorMessage}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Flat Number</label>
            <input name="flatNumber" placeholder="e.g. B-505" required onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email</label>
            <input name="email" type="email" placeholder="you@example.com" required onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Username</label>
            <input name="username" placeholder="Choose a username" required onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Password</label>
            <input name="password" type="password" placeholder="••••••••" required onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>

          <button type="submit" disabled={status === "loading"} className="w-full py-3 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-all">
            {status === "loading" ? "Submitting..." : "Submit Application"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <Link to="/login" className="text-blue-600 hover:underline">Back to Login</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;