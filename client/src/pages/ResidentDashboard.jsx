import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LogOut, Vote, User, PenTool, Calendar } from "lucide-react";

const ResidentDashboard = () => {
  const navigate = useNavigate();
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Data on Load
  useEffect(() => {
    // Check if logged in
    const token = localStorage.getItem("token");
    if (!token) navigate("/");

    // Simple role check
    const savedRole = localStorage.getItem("role");
    if(savedRole === 'admin') navigate('/admin-dashboard');

    fetchElections();
  }, []);

  const fetchElections = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/elections/all");
      setElections(res.data);
    } catch (err) {
      console.error("Failed to load elections");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      
      {/* NAVBAR */}
      <nav className="bg-slate-900 text-white px-8 py-4 flex justify-between items-center shadow-lg">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          🗳️ SARTHI <span className="text-blue-400 text-sm font-normal">Voter Portal</span>
        </h1>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 text-slate-300 hover:text-white transition"
        >
          <LogOut size={18} /> Logout
        </button>
      </nav>

      {/* MAIN CONTENT */}
      <main className="flex-1 max-w-6xl mx-auto w-full p-8">
        
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-xl mb-10 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold mb-2">Welcome, Neighbor! 👋</h2>
            <p className="text-blue-100">Your voice matters. Participate in society decisions securely.</p>
          </div>
          <div className="hidden md:block opacity-80">
            <Vote size={64} />
          </div>
        </div>

        {/* ACTION GRID */}
        <div className="grid md:grid-cols-2 gap-8">

          {/* LEFT: Active Elections List */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Calendar className="text-blue-600" /> Active Elections
            </h3>
            
            {loading ? (
              <p>Loading elections...</p>
            ) : elections.length === 0 ? (
              <div className="bg-white p-6 rounded-xl border border-slate-200 text-center text-slate-500">
                No active elections right now.
              </div>
            ) : (
              elections.map((election) => (
                <div key={election.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-lg font-bold text-slate-800">{election.title}</h4>
                      <p className="text-slate-500 text-sm mt-1">{election.description}</p>
                    </div>
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-bold uppercase">
                      Active
                    </span>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-slate-100 flex gap-3">
                    <button className="flex-1 bg-slate-900 text-white py-2 rounded-lg font-medium hover:bg-slate-800 transition">
                      Cast Vote
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* RIGHT: Candidate Zone */}
          <div>
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-6">
              <User className="text-purple-600" /> Candidate Zone
            </h3>

            <div className="bg-white p-8 rounded-xl border border-purple-100 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
                <PenTool size={100} className="text-purple-600" />
              </div>
              
              <h4 className="text-xl font-bold text-slate-800 mb-2">Want to be a Leader?</h4>
              <p className="text-slate-500 mb-6 leading-relaxed">
                Nominate yourself for an upcoming election. Use our AI-powered tool to write your manifesto.
              </p>
              
              <button 
                onClick={() => navigate('/nomination-form')}
                className="w-full py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition shadow-md flex justify-center items-center gap-2"
              >
                <PenTool size={18} /> Apply for Nomination
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default ResidentDashboard;