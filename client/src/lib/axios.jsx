import axios from "axios";

// Create a configured instance of axios
const client = axios.create({
  baseURL: "http://localhost:5000", // Points to your Node.js Backend
  headers: {
    "Content-Type": "application/json",
  },
});

export default client;