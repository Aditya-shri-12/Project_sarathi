import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { FiLogOut, FiHelpCircle, FiSend } from "react-icons/fi"; // Added icons
import EnquiryForm from "../pages/EnquiryForm"; // Importing the component you made
import HowItWorks from "./HowItWorks";   // Importing the component you made

const Header = () => {
  const navigate = useNavigate();
  
  // State for Modals
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);

  // Check if a user is saved in memory
  const getUser = () => {
    try {
      const userStr = localStorage.getItem("user");
      return userStr ? JSON.parse(userStr) : null;
    } catch (err) {
      console.error("Error parsing user data:", err);
      localStorage.removeItem("user");
      return null;
    }
  };
  const user = getUser();

  const handleLogout = () => {
    localStorage.removeItem("user"); // Clear memory
    alert("Logged out successfully");
    navigate("/"); // Go to Home
    window.location.reload(); // Refresh to update the header
  };

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="sticky top-0 bg-slate-900 shadow-lg z-40 border-b border-slate-800"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* LOGO */}
            <Link to="/">
              <div className="flex items-baseline cursor-pointer group">
                <h1 className="text-3xl font-bold text-white tracking-tight font-serif group-hover:text-amber-400 transition-colors duration-300">
                  Saarthi
                </h1>
                <span className="ml-2 text-xs font-light text-slate-400 group-hover:text-slate-200 transition-colors">
                  by ASB CREATIONS
                </span>
              </div>
            </Link>

            {/* NAVIGATION ACTIONS */}
            <div className="flex items-center gap-6">

              {/* === NEW BUTTONS START === */}
              <div className="hidden md:flex items-center gap-4 mr-4 border-r border-slate-700 pr-6">
                
                {/* How It Works Button */}
                <button 
                  onClick={() => setIsHowItWorksOpen(true)}
                  className="flex items-center gap-2 text-slate-300 hover:text-white text-sm font-medium transition-colors"
                >
                  <FiHelpCircle className="text-amber-400" /> 
                  How it Works
                </button>

                {/* Enquiry Button */}
                <button 
                  onClick={() => setIsEnquiryOpen(true)}
                  className="flex items-center gap-2 text-slate-300 hover:text-white text-sm font-medium transition-colors"
                >
                  <FiSend className="text-blue-400" />
                  Enquiry
                </button>

              </div>
              {/* === NEW BUTTONS END === */}


              {user ? (
                // SHOW THIS IF LOGGED IN
                <div className="flex items-center gap-4">
                  <span className="text-slate-300 text-sm hidden sm:block">
                    Hello, <span className="text-amber-400 font-bold">{user.username}</span>
                  </span>
                  
                  {/* Dashboard Link based on Role */}
                  <Link 
                    to={user.isAdmin ? "/committee/dashboard" : "/nominee/dashboard"}
                    className="text-slate-300 hover:text-white text-sm font-medium"
                  >
                    Dashboard
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-red-400 border border-red-400/30 px-4 py-2 rounded-lg hover:bg-red-400/10 transition-all text-sm"
                  >
                    <FiLogOut /> Logout
                  </button>
                </div>
              ) : (
                // SHOW THIS IF LOGGED OUT
                <Link to="/login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-amber-400 font-medium py-2 px-5 rounded-md border border-amber-400/30 hover:bg-amber-400/10 transition-all"
                  >
                    Login
                  </motion.button>
                </Link>
              )}
            </div>

          </div>
        </div>
      </motion.header>

      {/* MODAL COMPONENTS */}
      {/* These sit outside the header layout but inside the fragment so they overlay the page */}
      <HowItWorks isOpen={isHowItWorksOpen} onClose={() => setIsHowItWorksOpen(false)} />
      <EnquiryForm isOpen={isEnquiryOpen} onClose={() => setIsEnquiryOpen(false)} />
    </>
  );
};

export default Header;