import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Sparkles, Save, ArrowLeft, LogOut } from "lucide-react";

const NominationForm = () => {
  const navigate = useNavigate();
  const [elections, setElections] = useState([]);
  
  // Form State
  const [selectedElection, setSelectedElection] = useState("");
  const [roughNotes, setRoughNotes] = useState("");
  const [manifesto, setManifesto] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);

  // 1. Fetch Active Elections
  useEffect(() => {
    axios.get("http://localhost:5000/api/elections/all")
      .then(res => setElections(res.data))
      .catch(err => console.error(err));
  }, []);

  // 2. AI Generator (Keep your existing working code here)
  const handleGenerateAI = async () => {
    if (!roughNotes) return alert("Please write some rough points first!");
    setLoadingAI(true);
    try {
      const res = await axios.post("http://localhost:5000/api/ai/generate-manifesto", {
        points: roughNotes,
        position: "Society Secretary"
      });
      if (res.data.success) setManifesto(res.data.manifesto);
    } catch (err) {
      alert("AI Generation failed.");
    } finally {
      setLoadingAI(false);
    }
  };

  // ✅ 3. SUBMIT NOMINATION (THE FIX)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedElection) return alert("Please select an election!");
    if (!manifesto) return alert("Please write a manifesto!");

    // Retrieve User ID from Local Storage
    const userId = localStorage.getItem("userId");
    if (!userId) {
        alert("Session Error: Please logout and login again.");
        return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/candidates/apply", {
        userId: userId, 
        electionId: selectedElection,
        manifesto: manifesto
      });

      if (res.data.success) {
        alert("✅ Application Submitted Successfully! Please wait for Admin approval.");
        navigate("/resident-dashboard");
      }

    } catch (err) {
      console.error(err);
      alert("Submission failed. Check console for details.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId"); // Clean up ID too
    window.location.href = "/";
  };

  // ... (Return JSX stays the same as previous step) ...
  return (
    <div className="min-h-screen bg-slate-50 p-6 flex justify-center items-center">
      <div className="bg-white max-w-2xl w-full rounded-xl shadow-xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-800 rounded-full transition text-slate-400 hover:text-white">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h2 className="text-xl font-bold">Candidate Nomination</h2>
              <p className="text-slate-400 text-sm">Create your manifesto</p>
            </div>
          </div>
          <button onClick={handleLogout} className="text-slate-400 hover:text-red-400 transition flex items-center gap-2 text-sm font-medium px-3 py-1 rounded hover:bg-slate-800">
            <LogOut size={16} /> Logout
          </button>
        </div>

        {/* Form Body */}
        <div className="p-8 space-y-6">
          
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Select Election</label>
            <select 
              className="w-full p-3 border rounded-lg bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={(e) => setSelectedElection(e.target.value)}
              value={selectedElection}
            >
              <option value="">-- Choose an upcoming election --</option>
              {elections.map(e => (
                <option key={e.id} value={e.id}>{e.title}</option>
              ))}
            </select>
          </div>

          <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-bold text-indigo-900">Your Vision (Rough Points)</label>
              <span className="text-xs text-indigo-500 uppercase font-bold tracking-wider">AI Powered</span>
            </div>
            <textarea 
              placeholder="e.g. Fix the gym, clean water..."
              className="w-full p-3 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none h-24 mb-3"
              value={roughNotes}
              onChange={(e) => setRoughNotes(e.target.value)}
            />
            <button onClick={handleGenerateAI} disabled={loadingAI} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-bold text-sm transition shadow-md w-full justify-center">
              {loadingAI ? "Thinking..." : <><Sparkles size={18} /> Polish with Google Gemini AI</>}
            </button>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Final Manifesto</label>
            <textarea 
              className="w-full p-4 border rounded-lg bg-white focus:ring-2 focus:ring-green-500 outline-none h-40 font-serif leading-relaxed text-slate-700 shadow-inner"
              value={manifesto}
              onChange={(e) => setManifesto(e.target.value)}
              placeholder="Your generated speech will appear here..."
            />
          </div>

          <button onClick={handleSubmit} className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition shadow-lg flex items-center justify-center gap-2">
            <Save size={20} /> Submit Nomination
          </button>

        </div>
      </div>
    </div>
  );
};

export default NominationForm;