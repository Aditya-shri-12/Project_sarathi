import { useState } from "react";
// We don't need useNavigate anymore because we are using window.location for a hard refresh
// import { useNavigate } from "react-router-dom"; 
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Initialize error as null so it doesn't show an empty box
  const [error, setError] = useState(null); 
  
  // const navigate = useNavigate(); // Removed to use window.location instead

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors

    try {
      console.log("Sending request...");
      
      // Make sure this URL matches your backend route exactly!
      const res = await axios.post("http://localhost:5000/api/auth/admin-login", {
        email: email,
        password: password
      });

      console.log("Response:", res.data);

      if (res.data.success) {
        // 1. Save Token & Role
        if(res.data.token) {
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("role", res.data.role); // Save role just in case
        }
        
        // 2. FORCE RELOAD (The Fix)
        // This forces the App to refresh and check for the token again.
        // It solves the issue where you log in but stay on the login page.
        window.location.href = "/admin-dashboard";
      }

    } catch (err) {
      console.error("Login Error:", err);

      // --- CRASH PROOF ERROR HANDLING ---
      // We force the error to be a string, no matter what the server sends.
      let errorMessage = "Login Failed";

      if (err.response && err.response.data) {
        // If server sends { message: "..." } or { error: "..." }
        errorMessage = err.response.data.message || 
                       err.response.data.error || 
                       JSON.stringify(err.response.data);
      } else if (err.message) {
        errorMessage = err.message;
      }

      // Now we are 100% sure 'errorMessage' is a STRING, not an object.
      setError(errorMessage); 
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Admin Login</h1>
        
        {/* Only show error if it exists */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {/* This is safe now because 'error' is guaranteed to be a string */}
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Admin Email"
            className="border p-2 rounded w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="border p-2 rounded w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button 
            type="submit" 
            className="bg-red-600 text-white p-2 rounded hover:bg-red-700 w-full font-bold"
          >
            LOGIN
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;