import { Link } from "react-router-dom";
import { FiShield, FiUsers, FiUserCheck, FiUser, FiUserPlus } from "react-icons/fi";

const PortalCard = ({ to, icon, title, desc, color, highlight = false }) => (
  <Link 
    to={to} 
    className={`group relative overflow-hidden p-8 rounded-2xl shadow-sm border transition-all duration-300 text-center flex flex-col items-center cursor-pointer
      ${highlight 
        ? 'bg-blue-600 border-blue-600 text-white shadow-lg hover:bg-blue-700 hover:shadow-blue-200/50' 
        : 'bg-white border-slate-200 hover:shadow-xl hover:border-blue-300'
      }`}
  >
    <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-4 transition-transform group-hover:scale-110 
      ${highlight ? 'bg-white/20 text-white' : `${color} bg-opacity-10`}`}>
      {icon}
    </div>
    <h3 className={`text-xl font-bold mb-2 ${highlight ? 'text-white' : 'text-slate-800'}`}>{title}</h3>
    <p className={`text-sm ${highlight ? 'text-blue-100' : 'text-slate-500'}`}>{desc}</p>
  </Link>
);

const Portal = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      
      {/* HEADER */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-3">SARTHI<span className="text-blue-600">.VOTE</span></h1>
        <p className="text-slate-600">Secure Housing Society Election Portal</p>
      </div>

      <div className="max-w-5xl w-full space-y-8">
        
        {/* ROW 1: RESIDENTS (The most common users) */}
        <div className="grid md:grid-cols-3 gap-6">
          
          {/* 1. NEW RESIDENT (Registration) */}
          <PortalCard 
            to="/signup" 
            icon={<FiUserPlus />} 
            title="New Resident?" 
            desc="Register here to get your Flat verified." 
            color="text-emerald-600"
            highlight={true} // Makes this card pop out!
          />

          {/* 2. OLD RESIDENT (Voter Login) */}
          <PortalCard 
            to="/portal/voter" 
            icon={<FiUser />} 
            title="Old Resident" 
            desc="Login to access your Voter Booth." 
            color="text-blue-600" // Icon color
          />

          {/* 3. NOMINEE / CANDIDATE */}
          <PortalCard 
            to="/portal/candidate" 
            icon={<FiUserCheck />} 
            title="Nominee Login" 
            desc="Access Campaign & Manifesto Tools." 
            color="text-purple-600"
          />
        </div>

        <div className="flex items-center gap-4 text-slate-300">
          <div className="h-px bg-slate-300 flex-1"></div>
          <span className="text-xs font-bold uppercase tracking-wider">Administration</span>
          <div className="h-px bg-slate-300 flex-1"></div>
        </div>

        {/* ROW 2: MANAGEMENT */}
        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto w-full">
          
          {/* 4. ELECTION COMMITTEE */}
          <PortalCard 
            to="/portal/committee" 
            icon={<FiUsers />} 
            title="Election Committee" 
            desc="Manage Users & Elections." 
            color="text-orange-600"
          />

          {/* 5. SUPER ADMIN */}
          <PortalCard 
            to="/portal/admin" 
            icon={<FiShield />} 
            title="Super Admin" 
            desc="System Configuration." 
            color="text-red-600"
          />
        </div>

      </div>
      
    </div>
  );
};

export default Portal;