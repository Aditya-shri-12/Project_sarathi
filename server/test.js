const mongoose = require('mongoose');

// We are putting the link DIRECTLY here to test.
// Replace 'YOUR_USERNAME' with your Atlas username.
// We are using the simple password 'sarthi123' we just set.
const uri = "mongodb+srv://adityashrivastava591_db_user:sarthi123@sarthiappdata.ejkuy3v.mongodb.net/?appName=SarthiAppdata";

console.log("⏳ Trying to connect...");

mongoose.connect(uri)
  .then(() => {
    console.log("✅ SUCCESS! The database is connected.");
    process.exit(0);
  })
  .catch((err) => {
    console.log("❌ FAILED.");
    console.log("Error Message:", err.message);
    process.exit(1);
  });