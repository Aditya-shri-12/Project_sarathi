import { motion, AnimatePresence } from "framer-motion";
import { Building2, MapPin, Phone, Mail, User, Send, X, ArrowRight } from "lucide-react";
import { useState } from "react";
import axios from "../lib/axios";

const EnquiryForm = ({ isOpen, onClose }) => {
  const [focusedField, setFocusedField] = useState(null);
  const [formData, setFormData] = useState({
    organizationName: "",
    committeeHead: "",
    city: "",
    state: "",
    contactNumber: "",
    email: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

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

  const InputField = ({ label, icon: Icon, type = "text", placeholder, value, onChange, name }) => (
    <motion.div 
      variants={itemVariants} 
      className="relative group"
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div className={`absolute left-4 top-3.5 transition-colors duration-300 ${focusedField === label ? "text-blue-600" : "text-slate-400 group-hover:text-slate-500"}`}>
        <Icon size={20} />
      </div>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        onFocus={() => setFocusedField(label)}
        onBlur={() => setFocusedField(null)}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 font-medium"
      />
      {/* Label that appears on focus (optional enhancement, kept simple here as placeholder) */}
    </motion.div>
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(""); // Clear error on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Validation
    if (!formData.organizationName || !formData.committeeHead || !formData.city || 
        !formData.state || !formData.contactNumber || !formData.email) {
      setError("Please fill in all fields");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post("/api/enquiry/submit", formData);
      
      if (response.data.success || response.status === 201) {
        setSuccess(true);
        // Reset form
        setFormData({
          organizationName: "",
          committeeHead: "",
          city: "",
          state: "",
          contactNumber: "",
          email: ""
        });
        // Close after 2 seconds
        setTimeout(() => {
          setSuccess(false);
          onClose();
        }, 2000);
      }
    } catch (err) {
      console.error("Enquiry submission error:", err);
      let errorMsg = "Failed to submit enquiry. Please try again.";
      if (err.response?.data) {
        if (typeof err.response.data === 'string') {
          errorMsg = err.response.data;
        } else if (err.response.data.error) {
          errorMsg = err.response.data.error;
        } else if (err.response.data.message) {
          errorMsg = err.response.data.message;
        }
      }
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    // Only close if clicking directly on the backdrop, not on child elements
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          key="enquiry-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
          onClick={handleBackdropClick}
        >
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
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
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }} 
              className="text-slate-400 hover:text-slate-900 transition-colors p-2 hover:bg-slate-100 rounded-full"
            >
              <X size={20} />
            </button>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="mx-8 mt-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
              {error}
            </div>
          )}
          {success && (
            <div className="mx-8 mt-4 p-3 bg-green-50 border border-green-200 text-green-600 text-sm rounded-lg">
              ✅ Enquiry submitted successfully! We'll contact you soon.
            </div>
          )}

          {/* Form Body */}
          <form 
            id="enquiry-form"
            onSubmit={handleSubmit}
            className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            
            {/* Organization Name (Full Width) */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Organization Details</label>
              <InputField 
                label="org" 
                icon={Building2} 
                placeholder="Organization Name (e.g. Green Valley Society)"
                name="organizationName"
                value={formData.organizationName}
                onChange={handleInputChange}
              />
            </div>

            {/* Committee Head */}
            <div className="md:col-span-2">
               <InputField 
                 label="head" 
                 icon={User} 
                 placeholder="Committee Head Name"
                 name="committeeHead"
                 value={formData.committeeHead}
                 onChange={handleInputChange}
               />
            </div>

            {/* City */}
            <div>
               <InputField 
                 label="city" 
                 icon={MapPin} 
                 placeholder="City"
                 name="city"
                 value={formData.city}
                 onChange={handleInputChange}
               />
            </div>

            {/* State */}
            <div>
               <InputField 
                 label="state" 
                 icon={MapPin} 
                 placeholder="State"
                 name="state"
                 value={formData.state}
                 onChange={handleInputChange}
               />
            </div>

            {/* Contact Number */}
            <div>
               <InputField 
                 label="phone" 
                 icon={Phone} 
                 type="tel" 
                 placeholder="Contact Number"
                 name="contactNumber"
                 value={formData.contactNumber}
                 onChange={handleInputChange}
               />
            </div>

            {/* Email */}
            <div>
               <InputField 
                 label="email" 
                 icon={Mail} 
                 type="email" 
                 placeholder="Official Email Address"
                 name="email"
                 value={formData.email}
                 onChange={handleInputChange}
               />
            </div>

          </form>

          {/* Footer / Action Area */}
          <div 
            className="bg-slate-50 px-8 py-6 border-t border-slate-100 flex justify-between items-center"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
             <p className="text-xs text-slate-400 max-w-[200px] leading-tight hidden md:block">
               By submitting, you agree to our processing of your organization's data.
             </p>

            <div className="flex gap-4">
              <button 
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                className="px-6 py-2.5 text-slate-600 font-semibold text-sm hover:text-slate-900 transition"
              >
                Cancel
              </button>
              
              <motion.button 
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  // Trigger form submission
                  const form = document.getElementById('enquiry-form');
                  if (form) {
                    form.requestSubmit();
                  } else {
                    handleSubmit(e);
                  }
                }}
                disabled={loading || success}
                whileHover={!loading && !success ? { scale: 1.02 } : {}}
                whileTap={!loading && !success ? { scale: 0.98 } : {}}
                className={`group flex items-center gap-2 px-8 py-2.5 rounded-xl transition shadow-lg text-sm font-bold tracking-wide ${
                  loading || success
                    ? "bg-slate-400 cursor-not-allowed text-white"
                    : "bg-slate-900 text-white hover:bg-slate-800 shadow-slate-900/20"
                }`}
              >
                {loading ? (
                  <>Submitting...</>
                ) : success ? (
                  <>Submitted ✓</>
                ) : (
                  <>Submit Enquiry <Send size={16} className="group-hover:translate-x-1 transition-transform" /></>
                )}
              </motion.button>
            </div>
          </div>

        </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EnquiryForm;