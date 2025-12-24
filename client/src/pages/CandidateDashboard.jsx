import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LogOut, Vote, UserCheck, Megaphone, TrendingUp } from "lucide-react";

const CandidateDashboard = () => {
  const navigate = useNavigate();
  const [candidateInfo, setCandidateInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check Login
    const token = localStorage.getItem("token");
    if (!token) navigate("/");

    // 2. Fetch Candidate Details (You'll need an endpoint for this, or use generic data for now)
    // For prototype, we simulate fetching their campaign data
    setTimeout(() => {
      setCandidateInfo({
        name: "You",
        position: "Society Secretary",
        status: "Approved",
        votes: 0, // In a real app, this comes from the DB
        manifesto: "I promise 24/7 water supply and better gym facilities."
      });
      setLoading(false);
    }, 1000);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      
      {/* NAVBAR (Purple for Candidates) */}
      <nav className="bg-purple-900 text-white px-8 py-4 flex justify-between items-center shadow-lg">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          🗳️ SARTHI <span className="bg-purple-700 text-xs px-2 py-1 rounded">Candidate Portal</span>
        </h1>
        <button onClick={handleLogout} className="flex items-center gap-2 text-purple-200 hover:text-white transition">
          <LogOut size={18} /> Logout
        </button>
      </nav>

      <main className="flex-1 max-w-6xl mx-auto w-full p-8">
        
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-purple-700 to-indigo-800 rounded-2xl p-8 text-white shadow-xl mb-10 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-2">Campaign Dashboard 📢</h2>
            <p className="text-purple-100">Manage your profile and track your election status.</p>
          </div>
          <Megaphone className="absolute right-10 top-1/2 -translate-y-1/2 text-white opacity-20" size={120} />
        </div>

        {loading ? (
          <p>Loading campaign data...</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            
            {/* LEFT: Campaign Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <UserCheck className="text-purple-600" /> Your Nomination
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-500">Running For:</span>
                  <span className="font-bold text-slate-800">{candidateInfo.position}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-500">Status:</span>
                  <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-sm font-bold">
                    {candidateInfo.status}
                  </span>
                </div>
                
                <div>
                  <span className="text-slate-500 block mb-1">Your Manifesto:</span>
                  <div className="bg-slate-50 p-4 rounded-lg text-slate-700 italic border border-slate-100">
                    "{candidateInfo.manifesto}"
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: Stats & Voting */}
            <div className="space-y-6">
              
              {/* Live Stats */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <TrendingUp className="text-green-600" /> Live Stats
                </h3>
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-green-50 rounded-full">
                    <Vote size={32} className="text-green-600" />
                  </div>
                  <div>
                    <h4 className="text-3xl font-bold text-slate-900">{candidateInfo.votes}</h4>
                    <p className="text-slate-500 text-sm">Total Votes Received</p>
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-4">
                  * Results are hidden until election ends (or shown live if allowed).
                </p>
              </div>

              {/* Action */}
              <button className="w-full py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition shadow">
                Edit Manifesto
              </button>

            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CandidateDashboard;