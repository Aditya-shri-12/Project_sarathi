import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, ShieldCheck, Vote, X, ArrowRight, CheckCircle2 } from "lucide-react";

const HowItWorks = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  // Staggered Container
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { 
        duration: 0.4, 
        ease: [0.22, 1, 0.36, 1], // Custom Bezier for "Apple-like" smoothness
        staggerChildren: 0.2 
      }
    },
    exit: { opacity: 0, scale: 0.95, y: 20 }
  };

  // Items sliding in
  const itemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 50 } }
  };

  // The Vertical Line drawing itself
  const lineVariants = {
    hidden: { height: 0 },
    visible: { height: "100%", transition: { duration: 0.8, delay: 0.4 } }
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(e) => e.stopPropagation()} 
          className="bg-white rounded-2xl shadow-[0_20px_50px_rgba(8,_112,_184,_0.1)] w-full max-w-lg overflow-hidden relative border border-slate-100"
        >
          
          {/* Decorative Top Gradient */}
          <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500" />

          {/* Header */}
          <div className="px-8 pt-8 pb-4 flex justify-between items-start">
            <div>
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Platform Workflow</h3>
                <p className="text-slate-500 text-sm font-medium mt-1">Secure End-to-End Election Process</p>
              </motion.div>
            </div>
            <button 
              onClick={onClose} 
              className="text-slate-400 hover:text-slate-900 transition-colors p-2 hover:bg-slate-100 rounded-full"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="p-8 relative">
            
            {/* Animated Connector Line */}
            <div className="absolute left-[54px] top-12 bottom-16 w-0.5 bg-slate-100 overflow-hidden">
               <motion.div variants={lineVariants} className="w-full bg-slate-300" />
            </div>

            {/* Step 1: Registration */}
            <motion.div 
              variants={itemVariants} 
              className="flex gap-6 relative mb-10 group"
            >
              <div className="relative z-10 flex-shrink-0 w-14 h-14 bg-white border-2 border-slate-100 group-hover:border-blue-200 rounded-2xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-300">
                <UserPlus size={24} className="text-blue-600 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-lg group-hover:text-blue-700 transition-colors">Resident Registration</h4>
                <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                  Submit flat details securely. Your account is created in a 
                  <span className="mx-1.5 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-100">
                    RESTRICTED
                  </span> 
                  state until verified.
                </p>
              </div>
            </motion.div>

            {/* Step 2: Verification */}
            <motion.div 
              variants={itemVariants} 
              className="flex gap-6 relative mb-10 group"
            >
              <div className="relative z-10 flex-shrink-0 w-14 h-14 bg-white border-2 border-slate-100 group-hover:border-indigo-200 rounded-2xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-300">
                <ShieldCheck size={24} className="text-indigo-600 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-lg group-hover:text-indigo-700 transition-colors">Identity Verification</h4>
                <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                  Committee verifies documents offline. ID is cryptographically
                  <span className="mx-1.5 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100 animate-pulse">
                    VERIFIED
                  </span>
                  on the blockchain.
                </p>
              </div>
            </motion.div>

            {/* Step 3: Access */}
            <motion.div 
              variants={itemVariants} 
              className="flex gap-6 relative group"
            >
              <div className="relative z-10 flex-shrink-0 w-14 h-14 bg-white border-2 border-slate-100 group-hover:border-emerald-200 rounded-2xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-300">
                <Vote size={24} className="text-emerald-600 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-lg group-hover:text-emerald-700 transition-colors">Secure Access Granted</h4>
                <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                  Log in to the Dashboard. You can now file nominations or cast an 
                  <span className="font-semibold text-slate-700"> encrypted vote</span>.
                </p>
              </div>
            </motion.div>

          </div>

          {/* Footer */}
          <div className="bg-slate-50 p-5 flex justify-end">
            <motion.button 
              whileHover={{ scale: 1.02, x: 5 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition shadow-lg shadow-slate-900/20 text-sm font-semibold tracking-wide"
            >
              Understood <ArrowRight size={16} />
            </motion.button>
          </div>

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default HowItWorks;