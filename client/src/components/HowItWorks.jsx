import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, ShieldCheck, Vote, X, ArrowRight } from "lucide-react";

const HowItWorks = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  // Animation variants for staggered entrance
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut", staggerChildren: 0.15 }
    },
    exit: { opacity: 0, scale: 0.95 }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(e) => e.stopPropagation()} 
          className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden relative border border-slate-200"
        >
          
          {/* Header */}
          <div className="bg-slate-900 p-6 flex justify-between items-center border-b border-slate-800">
            <div>
              <h3 className="text-xl font-bold text-white tracking-wide">Platform Workflow</h3>
              <p className="text-slate-400 text-xs uppercase tracking-wider mt-1">Security Architecture</p>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-white transition p-1 hover:bg-slate-800 rounded-full">
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="p-8 relative">
            
            {/* Vertical Connector Line (The "Timeline" Look) */}
            <div className="absolute left-[54px] top-12 bottom-12 w-0.5 bg-slate-200" />

            {/* Step 1: Registration */}
            <motion.div variants={itemVariants} className="flex gap-5 relative mb-8">
              <div className="relative z-10 flex-shrink-0 w-14 h-14 bg-white border-2 border-slate-100 rounded-xl flex items-center justify-center shadow-sm">
                <UserPlus size={24} className="text-blue-600" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-lg">1. Resident Registration</h4>
                <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                  Submit your details including Flat Number. Your account is created but placed in a 
                  <span className="ml-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
                    RESTRICTED
                  </span> state.
                </p>
              </div>
            </motion.div>

            {/* Step 2: Verification */}
            <motion.div variants={itemVariants} className="flex gap-5 relative mb-8">
              <div className="relative z-10 flex-shrink-0 w-14 h-14 bg-white border-2 border-slate-100 rounded-xl flex items-center justify-center shadow-sm">
                <ShieldCheck size={24} className="text-indigo-600" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-lg">2. Identity Verification</h4>
                <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                  The Admin performs an offline validation of your residency documents. Upon approval, your digital ID is cryptographically 
                  <span className="ml-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                    VERIFIED
                  </span>.
                </p>
              </div>
            </motion.div>

            {/* Step 3: Access */}
            <motion.div variants={itemVariants} className="flex gap-5 relative">
              <div className="relative z-10 flex-shrink-0 w-14 h-14 bg-white border-2 border-slate-100 rounded-xl flex items-center justify-center shadow-sm">
                <Vote size={24} className="text-emerald-600" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-lg">3. Secure Access Granted</h4>
                <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                  Log in to the Resident Dashboard. You may now file nominations or cast encrypted votes in active elections.
                </p>
              </div>
            </motion.div>

          </div>

          {/* Footer */}
          <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-end">
            <button 
              onClick={onClose}
              className="group flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition shadow-lg text-sm font-semibold tracking-wide"
            >
              Proceed to Login <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default HowItWorks;