import { useState, useEffect } from "react";
import axios from "../lib/axios";
import { motion, AnimatePresence } from "framer-motion";
import { FiCheckCircle, FiClock, FiAlertCircle, FiX } from "react-icons/fi";
import AES from 'crypto-js/aes'; // <--- Import Encryption

const VoterDashboard = () => {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  
  // State for the Voting Modal
  const [selectedElection, setSelectedElection] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [votingStatus, setVotingStatus] = useState("idle"); // idle, encrypting, success, error

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
    fetchElections();
  }, []);

  const fetchElections = async () => {
    try {
      const res = await axios.get("/api/election/all");
      setElections(res.data);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // --- THE VOTING LOGIC ---
  const handleVoteSubmit = async () => {
    if (!selectedCandidate || !selectedElection) return;

    setVotingStatus("encrypting");

    try {
      // 1. THE SECRET: Encrypt the vote on the client side
      // In a real app, 'MY_SECRET_KEY' would be hidden or fetched securely
      const encryptedVote = AES.encrypt(
        selectedCandidate.name, 
        "MY_SECRET_KEY"
      ).toString();

      // 2. Send the locked envelope to backend
      await axios.post("/api/vote/cast", {
        userId: user._id,
        electionId: selectedElection._id,
        encryptedVote: encryptedVote
      });

      setVotingStatus("success");
      
      // Close modal after 2 seconds
      setTimeout(() => {
        setSelectedElection(null);
        setSelectedCandidate(null);
        setVotingStatus("idle");
        // Optional: Refresh elections to disable button (if backend supports it)
      }, 2000);

    } catch (err) {
      setVotingStatus("error");
      alert(err.response?.data || "Voting Failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 pt-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold text-slate-800">Welcome, {user?.username} 👋</h1>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {elections.map((election) => (
            <motion.div
              key={election._id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100">
                <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-full">ACTIVE</span>
                <h3 className="text-xl font-bold text-slate-800 mt-2">{election.title}</h3>
                <p className="text-slate-500 text-sm mt-1">{election.description}</p>
              </div>

              {/* VOTE BUTTON */}
              <div className="p-6 bg-slate-50">
                {user?.votedElections?.includes(election._id) ? (
                   <button disabled className="w-full py-3 bg-emerald-100 text-emerald-700 font-bold rounded-lg flex items-center justify-center gap-2">
                     <FiCheckCircle /> Voted
                   </button>
                ) : (
                  <button 
                    onClick={() => setSelectedElection(election)}
                    className="w-full py-3 bg-slate-900 hover:bg-blue-600 text-white font-bold rounded-lg transition-colors"
                  >
                    Vote Now
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* --- VOTING MODAL (The Ballot Paper) --- */}
        <AnimatePresence>
          {selectedElection && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden"
              >
                {/* Header */}
                <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-bold">Official Ballot</h3>
                    <p className="text-slate-400 text-sm">{selectedElection.title}</p>
                  </div>
                  <button onClick={() => setSelectedElection(null)} className="text-slate-400 hover:text-white"><FiX size={24}/></button>
                </div>

                {/* Candidate List */}
                <div className="p-6 space-y-3">
                  {selectedElection.candidates.map((cand, idx) => (
                    <div 
                      key={idx}
                      onClick={() => setSelectedCandidate(cand)}
                      className={`p-4 rounded-lg border-2 cursor-pointer flex justify-between items-center transition-all ${
                        selectedCandidate === cand 
                          ? "border-blue-500 bg-blue-50" 
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div>
                        <h4 className="font-bold text-slate-800">{cand.name}</h4>
                        <p className="text-xs text-slate-500">{cand.party || "Independent"}</p>
                      </div>
                      {selectedCandidate === cand && <FiCheckCircle className="text-blue-500 text-xl" />}
                    </div>
                  ))}
                </div>

                {/* Confirm Button */}
                <div className="p-6 border-t border-slate-100 bg-slate-50">
                  <button 
                    onClick={handleVoteSubmit}
                    disabled={!selectedCandidate || votingStatus !== "idle"}
                    className={`w-full py-4 rounded-lg font-bold text-white transition-all flex items-center justify-center gap-2 ${
                      votingStatus === "success" ? "bg-emerald-500" : "bg-slate-900 hover:bg-blue-600"
                    }`}
                  >
                    {votingStatus === "idle" && "Confirm Vote"}
                    {votingStatus === "encrypting" && "Encrypting & Submitting..."}
                    {votingStatus === "success" && "Vote Cast Successfully! 🎉"}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default VoterDashboard;