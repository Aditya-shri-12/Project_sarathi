import { motion, AnimatePresence } from "framer-motion";
import { Building2, MapPin, Phone, Mail, User, Send, X, CheckCircle } from "lucide-react";
import { useState } from "react";
import axios from "../lib/axios"; 

// ✅ FIX: InputField moved OUTSIDE the main component
const InputField = ({ name, value, onChange, icon: Icon, type = "text", placeholder, disabled }) => (
  <div className="relative group">
    <div className="absolute left-4 top-3.5 text-gray-400">
      <Icon size={20} />
    </div>
    <input
      name={name}
      value={value}      // Controlled input needs value
      onChange={onChange} // Controlled input needs handler
      type={type}
      placeholder={placeholder}
      disabled={disabled}
      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
    />
  </div>
);

const EnquiryForm = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    org: "", head: "", city: "", state: "", phone: "", email: ""
  });
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen) return null;

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    // Client-side validation
    if (!formData.org || !formData.head || !formData.email || !formData.phone) {
      setStatus("error");
      setErrorMessage("Please fill in all required fields (Organization, Head, Email, Phone)");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setStatus("error");
      setErrorMessage("Please enter a valid email address");
      return;
    }

    setStatus("loading");
    setErrorMessage("");
    try {
      const res = await axios.post("/api/enquiry", formData);
      
      if (res.data.success) {
        setStatus("success");
        setTimeout(() => {
          setFormData({ org: "", head: "", city: "", state: "", phone: "", email: "" });
          setStatus("idle");
          onClose();
        }, 3000);
      } else {
        setStatus("error");
        setErrorMessage(res.data.error || res.data.message || "Failed to submit enquiry");
      }
    } catch (err) {
      console.error("Enquiry submission error:", err);
      setStatus("error");
      
      // Extract error message from response
      let errorMsg = "Failed to submit enquiry. Please try again.";
      if (err.response?.data) {
        if (err.response.data.error) {
          errorMsg = err.response.data.error;
        } else if (err.response.data.message) {
          errorMsg = err.response.data.message;
        } else if (typeof err.response.data === 'string') {
          errorMsg = err.response.data;
        }
      } else if (err.message) {
        errorMsg = err.message;
      }
      
      setErrorMessage(errorMsg);
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.95 }
  };

  return (
    <AnimatePresence>
      {isOpen && (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
        <motion.div 
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(e) => e.stopPropagation()} 
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden relative"
        >
          {/* Header */}
          <div className="px-8 pt-8 pb-4 flex justify-between items-start border-b border-gray-100">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Organization Enquiry</h3>
              <p className="text-gray-500 text-sm mt-1">Register your society with Saarthi.</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500"><X size={20}/></button>
          </div>

          {/* Body */}
          {status === "success" ? (
             <div className="p-12 text-center flex flex-col items-center">
               <CheckCircle size={50} className="text-green-500 mb-4"/>
               <h3 className="text-xl font-bold">Enquiry Sent!</h3>
               <p className="text-gray-500">We will contact you shortly.</p>
             </div>
          ) : (
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              {status === "error" && <div className="md:col-span-2 text-red-500 bg-red-50 p-3 rounded">{errorMessage}</div>}
              
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Organization Details</label>
                {/* ✅ Passing props explicitly now */}
                <InputField 
                    name="org" 
                    value={formData.org} 
                    onChange={handleChange} 
                    icon={Building2} 
                    placeholder="Organization Name" 
                    disabled={status === "loading"}
                />
              </div>

              <div className="md:col-span-2">
                  <InputField name="head" value={formData.head} onChange={handleChange} icon={User} placeholder="Committee Head Name" disabled={status === "loading"} />
              </div>

              <div><InputField name="city" value={formData.city} onChange={handleChange} icon={MapPin} placeholder="City" disabled={status === "loading"} /></div>
              <div><InputField name="state" value={formData.state} onChange={handleChange} icon={MapPin} placeholder="State" disabled={status === "loading"} /></div>
              <div><InputField name="phone" value={formData.phone} onChange={handleChange} icon={Phone} type="tel" placeholder="Phone Number" disabled={status === "loading"} /></div>
              <div><InputField name="email" value={formData.email} onChange={handleChange} icon={Mail} type="email" placeholder="Email Address" disabled={status === "loading"} /></div>
            </div>
          )}

          {/* Footer */}
          {status !== "success" && (
            <div className="bg-gray-50 px-8 py-4 flex justify-end gap-3 border-t border-gray-100">
              <button onClick={onClose} className="px-4 py-2 text-gray-600 font-medium">Cancel</button>
              <button onClick={handleSubmit} className="px-6 py-2 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 transition">
                {status === "loading" ? "Sending..." : "Submit Enquiry"}
              </button>
            </div>
          )}
        </motion.div>
      </div>
      )}
    </AnimatePresence>
  );
};

export default EnquiryForm;