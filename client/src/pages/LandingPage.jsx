import { useNavigate } from "react-router-dom";
import { FiShield, FiUserCheck, FiLock, FiArrowRight } from "react-icons/fi";
import HowItWorks from "../components/HowItWorks";
import { useState } from "react";

const LandingPage = () => {
  const navigate = useNavigate();
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  return (
    <div className="font-sans">
      
      {/* 1. NAVBAR */}
      <nav className="bg-slate-900 text-white p-6 flex justify-between items-center">
        <div className="text-xl font-bold tracking-wide">
          Saarthi <span className="text-xs font-normal text-slate-400 ml-1">by ASB CREATIONS</span>
        </div>
        <div className="flex gap-6 text-sm font-medium">
          {/* The clickable text/button */}
        <button 
          onClick={() => setShowHowItWorks(true)} 
          className="text-white hover:text-blue-400 font-medium transition cursor-pointer"
        >
         How It Works
        </button>
          <button 
            onClick={() => navigate('/portal/voter')} // Quick Login
            className="text-amber-400 hover:text-amber-300"
          >
            Login
          </button>
        </div>
      </nav>

      {/* 2. HERO SECTION (Dark Area) */}
      <div className="bg-slate-900 text-white py-24 px-6 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
          Democracy Starts <span className="text-amber-400">Here.</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-10">
          The most secure, transparent, and decentralized voting platform for modern Housing Societies.
        </p>
        
        <button 
          onClick={() => navigate('/portal')} 
          className="bg-amber-400 text-slate-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-amber-300 transition-all flex items-center gap-2 mx-auto"
        >
          Get Started <FiArrowRight />
        </button>
      </div>

      {/* 3. FEATURES SECTION (White Area) */}
      <div className="bg-slate-50 py-20 px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900">Why Choose Saarthi?</h2>
          <p className="text-slate-500 mt-2">Built for trust, speed, and security.</p>
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          
          {/* Card 1: Secure Voting */}
          <div className="bg-amber-50 p-8 rounded-xl border border-amber-100">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center text-2xl mb-4">
              <FiLock />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">Secure Voting</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Complete anonymity ensures you can use your democratic power safely without fear.
            </p>
          </div>

          {/* Card 2: Verification */}
          <div className="bg-blue-50 p-8 rounded-xl border border-blue-100">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl mb-4">
              <FiUserCheck />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">Voter Verification</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Advanced identity checks prevent fraud while maintaining privacy.
            </p>
          </div>

          {/* Card 3: Tamper Proof */}
          <div className="bg-emerald-50 p-8 rounded-xl border border-emerald-100">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-2xl mb-4">
              <FiShield />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">Tamper-Proof</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Once a vote is cast, it is encrypted and cannot be changed by anyone (even Admin).
            </p>
          </div>

        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-500 py-8 text-center text-xs">
        &copy; 2025 ASB CREATIONS. Powered by MERN Stack & Google Gemini.
      </footer>

      {/* The Popup itself */}
      <HowItWorks isOpen={showHowItWorks} onClose={() => setShowHowItWorks(false)} />
    </div>
  );
};

export default LandingPage;