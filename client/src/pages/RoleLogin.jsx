import { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import axios from "axios";

const RoleLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null); 
  
  const navigate = useNavigate(); 

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null); 

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email: email,
        password: password
      });

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.role || "voter");
        // Store user data for dashboard
        if (res.data.user) {
          localStorage.setItem("user", JSON.stringify({
            id: res.data.user.id,
            username: res.data.user.name,
            email: res.data.user.email,
            isVerified: res.data.user.isVerified,
            votedElections: []
          }));
        }
        navigate("/voter-dashboard"); 
      }

    } catch (err) {
      console.error("Login Error Details:", err);
      let errorMessage = "Login Failed";

      if (err.response && err.response.data) {
        errorMessage = err.response.data.message || 
                       err.response.data.error || 
                       JSON.stringify(err.response.data);
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage); 
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        
        {/* Header Section with Emoji */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-3xl mb-4">
            🛡️
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Voter Login</h2>
          <p className="text-gray-500 text-sm mt-2">Enter your credentials to access the voting booth</p>
        </div>

        {/* Error Message Box */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm flex items-center gap-2">
            <span className="font-bold">Error:</span> {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">👤</span>
              <input
                type="email"
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="voter@society.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">🔒</span>
              <input
                type="password"
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md"
          >
            Access Dashboard
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500">
          Not registered? <a href="/register" className="text-blue-600 hover:underline font-medium">Contact Committee</a>
        </p>
      </div>
    </div>
  );
};

export default RoleLogin;