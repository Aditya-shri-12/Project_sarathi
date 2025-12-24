import { useNavigate } from "react-router-dom";
import { FiShield, FiUser, FiAward, FiLock, FiUserCheck, FiArrowRight } from "react-icons/fi";
import HowItWorks from "../components/HowItWorks";
import { useState } from "react";

const LandingPage = () => {
  const navigate = useNavigate();
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  // --- NAVIGATION HELPERS ---
  const goToAdminLogin = () => {
    navigate("/login", { state: { type: "admin", title: "Committee Portal" } });
  };

  const goToVoterLogin = () => {
    navigate("/login", { state: { type: "resident", title: "Resident Login" } });
  };

  const goToNomineeLogin = () => {
    navigate("/login", { state: { type: "resident", title: "Candidate Portal" } });
  };

  return (
    <div className="font-sans bg-slate-50 min-h-screen flex flex-col">
      
      {/* 1. NAVBAR */}
      <nav className="bg-slate-900 text-white p-6 flex justify-between items-center sticky top-0 z-50 shadow-md">
        <div className="text-xl font-bold tracking-wide flex items-center gap-2">
          Saarthi <span className="text-xs font-normal text-slate-400 ml-1">by ASB CREATIONS</span>
        </div>
        <div className="flex gap-6 text-sm font-medium items-center">
          <button 
            onClick={() => setShowHowItWorks(true)} 
            className="text-slate-300 hover:text-white transition cursor-pointer"
          >
            How It Works
          </button>
          
          {/* Quick Register Link */}
          <button 
            onClick={() => navigate('/signup')}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition shadow-lg shadow-blue-900/20"
          >
            Register
          </button>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <div className="bg-slate-900 text-white pt-20 pb-32 px-6 text-center relative overflow-hidden">
        
        {/* Background Glow Effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-500/20 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight tracking-tight">
            Democracy Starts <span className="text-blue-500">Here.</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
            The most secure, transparent, and decentralized voting platform for modern Housing Societies.
          </p>
          
          {/* --- PORTAL SELECTION (The Bifurcation) --- */}
          <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            
            {/* Resident Button */}
            <button 
              onClick={goToVoterLogin}
              className="group bg-slate-800 hover:bg-blue-600 border border-slate-700 hover:border-blue-500 p-6 rounded-xl transition-all duration-300 flex flex-col items-center gap-3 shadow-lg"
            >
              <div className="p-3 bg-slate-900 rounded-full text-blue-400 group-hover:text-white group-hover:bg-white/20 transition-colors">
                <FiUser size={24} />
              </div>
              <div className="text-center">
                <h3 className="font-bold text-lg">Resident Login</h3>
                <p className="text-xs text-slate-400 group-hover:text-blue-100 mt-1">Vote & View Events</p>
              </div>
            </button>

            {/* Candidate Button */}
            <button 
              onClick={goToNomineeLogin}
              className="group bg-slate-800 hover:bg-purple-600 border border-slate-700 hover:border-purple-500 p-6 rounded-xl transition-all duration-300 flex flex-col items-center gap-3 shadow-lg"
            >
              <div className="p-3 bg-slate-900 rounded-full text-purple-400 group-hover:text-white group-hover:bg-white/20 transition-colors">
                <FiAward size={24} />
              </div>
              <div className="text-center">
                <h3 className="font-bold text-lg">Candidate Portal</h3>
                <p className="text-xs text-slate-400 group-hover:text-purple-100 mt-1">Nominate & Campaign</p>
              </div>
            </button>

            {/* Committee Button */}
            <button 
              onClick={goToAdminLogin}
              className="group bg-slate-800 hover:bg-red-600 border border-slate-700 hover:border-red-500 p-6 rounded-xl transition-all duration-300 flex flex-col items-center gap-3 shadow-lg"
            >
              <div className="p-3 bg-slate-900 rounded-full text-red-400 group-hover:text-white group-hover:bg-white/20 transition-colors">
                <FiShield size={24} />
              </div>
              <div className="text-center">
                <h3 className="font-bold text-lg">Committee Login</h3>
                <p className="text-xs text-slate-400 group-hover:text-red-100 mt-1">Manage Society</p>
              </div>
            </button>

          </div>

          <div className="mt-8 text-sm text-slate-500">
            New to the society? <button onClick={() => navigate('/signup')} className="text-blue-400 hover:underline">Register your flat here</button>
          </div>
        </div>
      </div>

      {/* 3. FEATURES SECTION */}
      <div className="bg-white py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Why Choose Saarthi?</h2>
            <p className="text-slate-500 mt-3 text-lg">Built for trust, speed, and absolute security.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-2xl mb-6">
                <FiLock />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Encrypted Voting</h3>
              <p className="text-slate-600 leading-relaxed">
                Your vote is encrypted the moment you cast it. No one—not even the Admin—can see who you voted for.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center text-2xl mb-6">
                <FiUserCheck />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Identity Verification</h3>
              <p className="text-slate-600 leading-relaxed">
                Our strict "Offline Verification" ensures 100% of voters are real residents, eliminating fraud completely.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl mb-6">
                <FiShield />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Tamper-Proof Results</h3>
              <p className="text-slate-600 leading-relaxed">
                Results are calculated automatically by the system. No manual counting, no bias, no errors.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-500 py-12 border-t border-slate-800 mt-auto">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h4 className="text-white font-bold text-lg">Saarthi</h4>
            <p className="text-sm mt-1">Empowering Housing Societies.</p>
          </div>
          <div className="text-xs text-slate-600">
            &copy; 2025 ASB CREATIONS. Powered by MERN Stack & Google Gemini.
          </div>
        </div>
      </footer>

      {/* The Popup Component */}
      <HowItWorks isOpen={showHowItWorks} onClose={() => setShowHowItWorks(false)} />
    </div>
  );
};

export default LandingPage;