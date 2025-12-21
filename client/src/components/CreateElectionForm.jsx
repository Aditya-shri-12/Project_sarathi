import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiTrash2, FiX } from "react-icons/fi";
import axios from "../lib/axios";

const CreateElectionForm = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    endTime: "",
    candidates: [{ name: "", party: "" }] // Start with 1 empty candidate
  });
  const [loading, setLoading] = useState(false);

  // Handle text inputs (Title, Description)
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Candidate Inputs (Dynamic Array)
  const handleCandidateChange = (index, field, value) => {
    const updatedCandidates = [...formData.candidates];
    updatedCandidates[index][field] = value;
    setFormData({ ...formData, candidates: updatedCandidates });
  };

  const addCandidate = () => {
    setFormData({
      ...formData,
      candidates: [...formData.candidates, { name: "", party: "" }]
    });
  };

  const removeCandidate = (index) => {
    if (formData.candidates.length > 1) {
      const updatedCandidates = formData.candidates.filter((_, i) => i !== index);
      setFormData({ ...formData, candidates: updatedCandidates });
    }
  };

  // Submit to Backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("/api/elections/create", formData);
      alert("Election Created Successfully! 🎉");
      onSuccess(); // Refresh the dashboard
      onClose();   // Close the modal
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 sticky top-0 z-10">
          <h2 className="text-xl font-bold text-slate-800">Create New Election</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-500">
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title & Description */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Election Title</label>
              <input type="text" name="title" required onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="e.g. Society Secretary 2025"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea name="description" onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="What is this election for?"
              ></textarea>
            </div>
             <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
              <input type="datetime-local" name="endTime" required onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Candidates Section */}
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <h3 className="font-bold text-slate-700 mb-3">Candidates</h3>
            <div className="space-y-3">
              <AnimatePresence>
                {formData.candidates.map((candidate, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex gap-3"
                  >
                    <input type="text" placeholder="Candidate Name" required
                      value={candidate.name}
                      onChange={(e) => handleCandidateChange(index, "name", e.target.value)}
                      className="flex-1 px-3 py-2 border rounded-md"
                    />
                    <input type="text" placeholder="Party / Slogan"
                      value={candidate.party}
                      onChange={(e) => handleCandidateChange(index, "party", e.target.value)}
                      className="flex-1 px-3 py-2 border rounded-md"
                    />
                    {formData.candidates.length > 1 && (
                      <button type="button" onClick={() => removeCandidate(index)} 
                        className="p-2 text-red-500 hover:bg-red-50 rounded-md">
                        <FiTrash2 />
                      </button>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <button type="button" onClick={addCandidate}
              className="mt-3 text-sm text-blue-600 font-medium hover:underline flex items-center gap-1">
              <FiPlus /> Add Candidate
            </button>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-5 py-2 text-slate-600 hover:bg-slate-50 rounded-lg">Cancel</button>
            <button type="submit" disabled={loading}
              className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium">
              {loading ? "Creating..." : "Launch Election"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateElectionForm;