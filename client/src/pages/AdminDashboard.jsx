import { useState, useEffect } from "react";
import axios from "../lib/axios";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiBarChart2, FiUsers, FiRefreshCw } from "react-icons/fi";
import CreateElectionForm from "../components/Createelectionform";
import PendingUsers from "../components/PendingUsers";

const AdminDashboard = () => {
  const [showModal, setShowModal] = useState(false);
  const [elections, setElections] = useState([]);
  const [results, setResults] = useState(null); // Stores the vote counts
  const [selectedElectionTitle, setSelectedElectionTitle] = useState("");

  // Load Elections on Start
  useEffect(() => {
    fetchElections();
  }, []);

  const fetchElections = async () => {
    try {
      const res = await axios.get("/api/election/all");
      setElections(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleViewResults = async (electionId, title) => {
    try {
      const res = await axios.get(`/api/vote/results/${electionId}`);
      setResults(res.data);
      setSelectedElectionTitle(title);
    } catch (err) {
      alert("Error fetching results");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 pt-24">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold text-slate-800">Committee Dashboard</h1>
          <button 
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-lg font-medium shadow-lg transition-all"
            onClick={() => setShowModal(true)}
          >
            <FiPlus /> Create Election
          </button>
        </div>
        <PendingUsers />

        {/* MAIN CONTENT */}
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* LEFT: ACTIVE ELECTIONS LIST */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-700 flex items-center gap-2">
              <FiRefreshCw className="cursor-pointer hover:rotate-180 transition-all" onClick={fetchElections}/> 
              Active Elections
            </h2>
            
            {elections.length === 0 && <p className="text-slate-400">No active elections.</p>}

            {elections.map((election) => (
              <motion.div
                key={election._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex justify-between items-center"
              >
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">{election.title}</h3>
                  <p className="text-slate-500 text-sm">{election.candidates.length} Candidates</p>
                </div>
                <button 
                  onClick={() => handleViewResults(election._id, election.title)}
                  className="px-4 py-2 bg-blue-50 text-blue-600 font-medium rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-2"
                >
                  <FiBarChart2 /> Results
                </button>
              </motion.div>
            ))}
          </div>

          {/* RIGHT: RESULTS PANEL */}
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8 min-h-[400px]">
            <h2 className="text-xl font-bold text-slate-800 mb-6 border-b pb-4">
              Live Results {selectedElectionTitle && `: ${selectedElectionTitle}`}
            </h2>

            {!results ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <FiBarChart2 className="text-5xl mb-4 opacity-20" />
                <p>Select an election to view tally.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {Object.keys(results).length === 0 ? (
                  <p className="text-center text-slate-500 mt-10">No votes cast yet.</p>
                ) : (
                  // RENDER THE BARS
                  Object.entries(results).map(([name, count], index) => (
                    <div key={index}>
                      <div className="flex justify-between text-sm font-bold text-slate-700 mb-1">
                        <span>{name}</span>
                        <span>{count} Votes</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${(count / Math.max(...Object.values(results))) * 100}%` }}
                          transition={{ duration: 1 }}
                          className="bg-blue-600 h-full rounded-full"
                        ></motion.div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

        </div>

        {/* CREATE MODAL */}
        <AnimatePresence>
          {showModal && (
            <CreateElectionForm 
              onClose={() => setShowModal(false)} 
              onSuccess={fetchElections} 
            />
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default AdminDashboard;