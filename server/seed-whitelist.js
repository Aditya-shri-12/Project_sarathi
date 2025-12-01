// server/seed-whitelist.js
const mongoose = require('mongoose');
const Whitelist = require('./models/whitelist');
const dotenv = require('dotenv');

dotenv.config();

// 1. Connect to DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to DB for Seeding..."))
  .catch(err => console.log(err));

// 2. The List of "Real" Residents (We are inventing them for the test)
const societyList = [
  { flatNumber: "A-101", email: "sharma@test.com" },
  { flatNumber: "A-102", email: "verma@test.com" },
  { flatNumber: "B-201", email: "singh@test.com" },
];

const seedDB = async () => {
  try {
    // Clear old list to avoid duplicates
    await Whitelist.deleteMany({});
    
    // Insert new list
    await Whitelist.insertMany(societyList);
    
    console.log("✅ Whitelist Populated Successfully!");
    console.log("Valid Residents:", societyList);
    process.exit();
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

seedDB();