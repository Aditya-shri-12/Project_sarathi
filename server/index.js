// server/index.js

const voteRoute = require('./routes/vote'); 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');

// IMPORT ROUTES
const authRoute = require('./routes/auth');
const electionRoute = require('./routes/election'); // <--- This was likely missing or broken

dotenv.config();

const app = express();

// 🛡️ SECURITY: Brute Force Protection
// If someone tries to login 5 times and fails, block them for 15 mins.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per window
  message: { error: "⛔ Too many login attempts. Access blocked for 15 minutes." },
  standardHeaders: true, 
  legacyHeaders: false,
});

// Apply ONLY to the login route
app.use("/api/auth/login", loginLimiter);


// MIDDLEWARE
app.use(express.json());
app.use(cors());

// CONNECT TO DATABASE
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected Successfully!");
  } catch (error) {
    console.error("❌ Database Connection Failed:", error);
    process.exit(1);
  }
};
connectDB();

// ROUTE MIDDLEWARE (The Wiring)
app.use('/api/vote', voteRoute);
app.use('/api/auth', authRoute);
app.use('/api/election', electionRoute); // <--- This activates the election routes
app.use("/api/ai", require("./routes/ai")); // AI Route

// TEST ROUTE
app.get('/', (req, res) => {
  res.send('Welcome to SARTHI Voting App - Backend is Running!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on Port ${PORT}`);
});