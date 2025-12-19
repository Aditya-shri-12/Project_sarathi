import { useState, useEffect } from "react";
import axios from "../lib/axios";
import { FiCheck, FiX, FiUser } from "react-icons/fi";

const PendingUsers = () => {
  const [users, setUsers] = useState([]);

  // Fetch list on load
  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    try {
      const res = await axios.get("/api/auth/pending-users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDecision = async (id, decision) => {
    // decision = 'active' OR 'rejected'
    if(!confirm(`Are you sure you want to mark this user as ${decision}?`)) return;

    try {
      await axios.put(`/api/auth/update-status/${id}`, { status: decision });
      fetchPending(); // Refresh the list
    } catch (err) {
      alert("Error updating status");
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mt-8">
      <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
        <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-xs">Action Required</span>
        Pending Approvals
      </h3>

      {users.length === 0 ? (
        <p className="text-slate-400 text-sm italic">No pending requests at the moment.</p>
      ) : (
        <div className="space-y-3">
          {users.map((u) => (
            <div key={u._id} className="flex justify-between items-center p-4 bg-slate-50 rounded-lg border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-full border border-slate-200 text-slate-400">
                  <FiUser />
                </div>
                <div>
                  <p className="font-bold text-slate-800">{u.username}</p>
                  <p className="text-xs text-slate-500">Flat: <span className="font-mono text-slate-700">{u.flatNumber}</span> • {u.email}</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => handleDecision(u._id, 'active')}
                  className="p-2 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 transition-colors"
                  title="Approve"
                >
                  <FiCheck />
                </button>
                <button 
                  onClick={() => handleDecision(u._id, 'rejected')}
                  className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                  title="Reject"
                >
                  <FiX />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PendingUsers;