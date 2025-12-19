import { useState } from "react";
import axios from "../lib/axios";
import { FiCpu, FiCopy } from "react-icons/fi";
import { motion } from "framer-motion";

const AIAssistant = () => {
  const [topic, setTopic] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!topic) return;
    setLoading(true);
    try {
      const res = await axios.post("/api/ai/generate-manifesto", { topic });
      setResult(res.data.manifesto);
    } catch (err) {
      alert("AI Error: " + err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-xl border border-blue-100 shadow-sm mt-8">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-blue-600 text-white rounded-lg">
          <FiCpu className="text-xl" />
        </div>
        <div>
          <h3 className="font-bold text-slate-800">AI Campaign Manager</h3>
          <p className="text-xs text-slate-500">Powered by Google Gemini</p>
        </div>
      </div>

      <div className="space-y-3">
        <textarea
          className="w-full p-3 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          rows="3"
          placeholder="e.g. I want to install CCTV cameras and fix the gym equipment..."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
        
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2"
        >
          {loading ? (
            <span className="animate-pulse">Generating Magic...</span>
          ) : (
            <>✨ Generate Manifesto</>
          )}
        </button>

        {result && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-white rounded-lg border border-slate-200 relative"
          >
            <p className="text-slate-700 text-sm italic leading-relaxed">"{result}"</p>
            <button 
              onClick={() => navigator.clipboard.writeText(result)}
              className="absolute top-2 right-2 text-slate-400 hover:text-blue-600"
              title="Copy to clipboard"
            >
              <FiCopy />
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AIAssistant;