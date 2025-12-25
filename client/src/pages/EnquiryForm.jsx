import { motion, AnimatePresence } from "framer-motion";
import { Building2, MapPin, Phone, Mail, User, Send, X, ArrowRight } from "lucide-react";
import { useState } from "react";

const EnquiryForm = ({ isOpen, onClose }) => {
  const [focusedField, setFocusedField] = useState(null);

  if (!isOpen) return null;

  // Animation Variants (Same "Apple-like" smoothness)
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { 
        duration: 0.4, 
        ease: [0.22, 1, 0.36, 1], 
        staggerChildren: 0.1 
      }
    },
    exit: { opacity: 0, scale: 0.95, y: 20 }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } }
  };

  const InputField = ({ label, icon: Icon, type = "text", placeholder }) => (
    <motion.div variants={itemVariants} className="relative group">
      <div className={`absolute left-4 top-3.5 transition-colors duration-300 ${focusedField === label ? "text-blue-600" : "text-slate-400 group-hover:text-slate-500"}`}>
        <Icon size={20} />
      </div>
      <input
        type={type}
        placeholder={placeholder}
        onFocus={() => setFocusedField(label)}
        onBlur={() => setFocusedField(null)}
        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 font-medium"
      />
      {/* Label that appears on focus (optional enhancement, kept simple here as placeholder) */}
    </motion.div>
  );

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
          className="bg-white rounded-2xl shadow-[0_20px_50px_rgba(15,_23,_42,_0.2)] w-full max-w-2xl overflow-hidden relative border border-slate-100"
        >
          
          {/* Decorative Top Gradient */}
          <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-800" />

          {/* Header */}
          <div className="px-8 pt-8 pb-2 flex justify-between items-start">
            <div>
              <motion.div 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Organization Enquiry</h3>
                <p className="text-slate-500 text-sm font-medium mt-1">Get your society or club registered with Saarthi.</p>
              </motion.div>
            </div>
            <button 
              onClick={onClose} 
              className="text-slate-400 hover:text-slate-900 transition-colors p-2 hover:bg-slate-100 rounded-full"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form Body */}
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Organization Name (Full Width) */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Organization Details</label>
              <InputField label="org" icon={Building2} placeholder="Organization Name (e.g. Green Valley Society)" />
            </div>

            {/* Committee Head */}
            <div className="md:col-span-2">
               <InputField label="head" icon={User} placeholder="Committee Head Name" />
            </div>

            {/* City */}
            <div>
               <InputField label="city" icon={MapPin} placeholder="City" />
            </div>

            {/* State */}
            <div>
               <InputField label="state" icon={MapPin} placeholder="State" />
            </div>

            {/* Contact Number */}
            <div>
               <InputField label="phone" icon={Phone} type="tel" placeholder="Contact Number" />
            </div>

            {/* Email */}
            <div>
               <InputField label="email" icon={Mail} type="email" placeholder="Official Email Address" />
            </div>

          </div>

          {/* Footer / Action Area */}
          <div className="bg-slate-50 px-8 py-6 border-t border-slate-100 flex justify-between items-center">
             <p className="text-xs text-slate-400 max-w-[200px] leading-tight hidden md:block">
               By submitting, you agree to our processing of your organization's data.
             </p>

            <div className="flex gap-4">
              <button 
                onClick={onClose}
                className="px-6 py-2.5 text-slate-600 font-semibold text-sm hover:text-slate-900 transition"
              >
                Cancel
              </button>
              
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group flex items-center gap-2 px-8 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition shadow-lg shadow-slate-900/20 text-sm font-bold tracking-wide"
              >
                Submit Enquiry <Send size={16} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </div>
          </div>

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EnquiryForm;