import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";

const Header = () => {
  const navigate = useNavigate();
  // Check if a user is saved in memory
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user"); // Clear memory
    alert("Logged out successfully");
    navigate("/"); // Go to Home
    window.location.reload(); // Refresh to update the header
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="sticky top-0 bg-slate-900 shadow-lg z-50 border-b border-slate-700"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* LOGO */}
          <Link to="/">
            <div className="flex items-baseline cursor-pointer">
              <h1 className="text-3xl font-bold text-white tracking-tight font-serif">
                Saarthi
              </h1>
              <span className="ml-2 text-xs font-light text-slate-400">
                by ASB CREATIONS
              </span>
            </div>
          </Link>

          {/* NAVIGATION */}
          <div className="flex items-center space-x-8">
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
  );
};

export default Header;