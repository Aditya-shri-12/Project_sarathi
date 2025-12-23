import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Sparkles, Save, ArrowLeft } from "lucide-react";

const NominationForm = () => {
  const navigate = useNavigate();
  const [elections, setElections] = useState([]);
  
  // Form State
  const [selectedElection, setSelectedElection] = useState("");
  const [roughNotes, setRoughNotes] = useState("");
  const [manifesto, setManifesto] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);

  // 1. Fetch Active Elections so user can choose what to run for
  useEffect(() => {
    // In a real app, fetch from /api/elections/all
    // For now, let's mock one if the DB is empty, or fetch real ones
    axios.get("http://localhost:5000/api/elections/all")
      .then(res => setElections(res.data))
      .catch(err => console.error(err));
  }, []);

  // 2. The AI Magic Function
  const handleGenerateAI = async () => {
    if (!roughNotes) return alert("Please write some rough points first!");
    
    setLoadingAI(true);
    try {
      const res = await axios.post("http://localhost:5000/api/ai/generate-manifesto", {
        points: roughNotes,
        position: "Society Secretary" // You can make this dynamic later
      });
      
      if (res.data.success) {
        setManifesto(res.data.manifesto);
      }
    } catch (err) {
      alert("AI Generation failed. Try again.");
    } finally {
      setLoadingAI(false);
    }
  };

  // 3. Submit Nomination
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Logic to save to Supabase would go here
    alert("Application Submitted! Admin will review it.");
    navigate("/resident-dashboard");
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 flex justify-center items-center">
      <div className="bg-white max-w-2xl w-full rounded-xl shadow-xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Candidate Nomination</h2>
            <p className="text-slate-400 text-sm">Stand for the future of your society.</p>
          </div>
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-800 rounded-full transition">
            <ArrowLeft />
          </button>
        </div>

        <div className="p-8 space-y-6">
          
          {/* Election Select */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Select Election</label>
            <select 
              className="w-full p-3 border rounded-lg bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={(e) => setSelectedElection(e.target.value)}
            >
              <option value="">-- Choose an upcoming election --</option>
              {elections.map(e => (
                <option key={e.id} value={e.id}>{e.title}</option>
              ))}
            </select>
          </div>

          {/* AI Section */}
          <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-bold text-indigo-900">Your Vision (Rough Points)</label>
              <span className="text-xs text-indigo-500 uppercase font-bold tracking-wider">AI Powered</span>
            </div>
            
            <textarea 
              placeholder="e.g. I want to fix the gym, ensure 24/7 water, and organize monthly events..."
              className="w-full p-3 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none h-24 mb-3"
              value={roughNotes}
              onChange={(e) => setRoughNotes(e.target.value)}
            />

            <button 
              onClick={handleGenerateAI}
              disabled={loadingAI}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-bold text-sm transition shadow-md w-full justify-center"
            >
              {loadingAI ? "Thinking..." : <><Sparkles size={18} /> Polish with Google Gemini AI</>}
            </button>
          </div>

          {/* Final Manifesto (Editable) */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Final Manifesto</label>
            <textarea 
              className="w-full p-4 border rounded-lg bg-white focus:ring-2 focus:ring-green-500 outline-none h-40 font-serif leading-relaxed text-slate-700 shadow-inner"
              value={manifesto}
              onChange={(e) => setManifesto(e.target.value)}
              placeholder="Your generated speech will appear here..."
            />
          </div>

          <button 
            onClick={handleSubmit}
            className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition shadow-lg flex items-center justify-center gap-2"
          >
            <Save size={20} /> Submit Nomination
          </button>

        </div>
      </div>
    </div>
  );
};

export default NominationForm;