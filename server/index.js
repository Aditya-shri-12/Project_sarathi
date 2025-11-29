// server/index.js

const voteRoute = require('./routes/vote'); 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// IMPORT ROUTES
const authRoute = require('./routes/auth');
const electionRoute = require('./routes/election'); // <--- This was likely missing or broken

dotenv.config();

const app = express();

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

// TEST ROUTE
app.get('/', (req, res) => {
  res.send('Welcome to SARTHI Voting App - Backend is Running!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on Port ${PORT}`);
});