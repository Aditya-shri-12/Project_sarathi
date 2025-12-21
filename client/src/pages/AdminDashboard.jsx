import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  Vote, 
  LogOut, 
  CheckCircle, 
  XCircle, 
  Calendar,
  FileText 
} from "lucide-react"; 

const AdminDashboard = () => {
  // --- STATE MANAGEMENT ---
  const [activeTab, setActiveTab] = useState("pending"); // Controls which screen is visible
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Election Form State
  const [electionData, setElectionData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: ""
  });

  const navigate = useNavigate();

  // --- 1. FETCH PENDING RESIDENTS (On Load) ---
  useEffect(() => {
    fetchPendingResidents();
  }, []);

  const fetchPendingResidents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/pending-residents");
      setResidents(res.data);
    } catch (err) {
      console.error("Error fetching residents:", err);
    } finally {
      setLoading(false);
    }
  };

  // --- 2. APPROVE / REJECT LOGIC ---
  const handleApprove = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/approve/${id}`);
      setResidents(residents.filter((r) => r.id !== id));
      alert("Resident Verified! ✅");
    } catch (err) {
      alert("Failed to approve.");
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/reject/${id}`);
      setResidents(residents.filter((r) => r.id !== id));
      alert("Resident Rejected ❌");
    } catch (err) {
      alert("Failed to reject.");
    }
  };

  // --- 3. CREATE ELECTION LOGIC ---
  const handleElectionSubmit = async (e) => {
    e.preventDefault();
    try {
      // Sending data to backend
      const res = await axios.post("http://localhost:5000/api/elections/create", electionData);
      if(res.data.success) {
        alert("Election Created Successfully! 🗳️");
        setElectionData({ title: "", description: "", startDate: "", endDate: "" }); // Reset form
      }
    } catch (err) {
      console.error("Election Error:", err);
      alert("Failed to create election.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      
      {/* --- SIDEBAR NAVIGATION --- */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col fixed h-full">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            🛡️ Admin<span className="text-blue-500">Panel</span>
          </h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {/* Tab 1: Pending Requests */}
          <button 
            onClick={() => setActiveTab("pending")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              activeTab === "pending" ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-slate-800"
            }`}
          >
            <Users size={20} /> Pending Approvals
            {residents.length > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full ml-auto">
                {residents.length}
              </span>
            )}
          </button>

          {/* Tab 2: Create Election */}
          <button 
            onClick={() => setActiveTab("create_election")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              activeTab === "create_election" ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-slate-800"
            }`}
          >
            <Vote size={20} /> Create Election
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-900/20 rounded-lg transition"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>


      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 ml-64 p-8">
        
        {/* VIEW 1: PENDING RESIDENTS */}
        {activeTab === "pending" && (
          <div className="max-w-5xl mx-auto">
            <header className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800">Resident Requests</h2>
              <p className="text-gray-500">Verify new neighbors to allow them access.</p>
            </header>

            {loading ? (
              <p>Loading...</p>
            ) : residents.length === 0 ? (
              <div className="bg-white p-12 rounded-xl shadow text-center text-gray-400">
                No pending requests. All caught up!
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow overflow-hidden border border-gray-200">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                    <tr>
                      <th className="px-6 py-4">Name</th>
                      <th className="px-6 py-4">Flat No</th>
                      <th className="px-6 py-4">Email</th>
                      <th className="px-6 py-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {residents.map((resident) => (
                      <tr key={resident.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium">{resident.username}</td>
                        <td className="px-6 py-4 text-gray-600">{resident.flat_number}</td>
                        <td className="px-6 py-4 text-gray-500">{resident.email}</td>
                        <td className="px-6 py-4 flex justify-center gap-2">
                          <button onClick={() => handleApprove(resident.id)} className="bg-green-100 text-green-700 p-2 rounded hover:bg-green-200">
                            <CheckCircle size={18} />
                          </button>
                          <button onClick={() => handleReject(resident.id)} className="bg-red-100 text-red-700 p-2 rounded hover:bg-red-200">
                            <XCircle size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: CREATE ELECTION FORM */}
        {activeTab === "create_election" && (
          <div className="max-w-2xl mx-auto">
            <header className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800">Launch Election</h2>
              <p className="text-gray-500">Create a new voting event for the society.</p>
            </header>

            <form onSubmit={handleElectionSubmit} className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 space-y-6">
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Election Title</label>
                <div className="relative">
                  <Vote className="absolute top-3 left-3 text-gray-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="e.g. Society Secretary Election 2025" 
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={electionData.title}
                    onChange={(e) => setElectionData({...electionData, title: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <div className="relative">
                  <FileText className="absolute top-3 left-3 text-gray-400" size={18} />
                  <textarea 
                    rows="3"
                    placeholder="Details about this election..." 
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={electionData.description}
                    onChange={(e) => setElectionData({...electionData, description: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input 
                    type="datetime-local" 
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={electionData.startDate}
                    onChange={(e) => setElectionData({...electionData, startDate: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input 
                    type="datetime-local" 
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={electionData.endDate}
                    onChange={(e) => setElectionData({...electionData, endDate: e.target.value})}
                    required
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-md transition"
              >
                🚀 Publish Election
              </button>
            </form>
          </div>
        )}

      </main>
    </div>
  );
};

export default AdminDashboard;