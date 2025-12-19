// server/fix-admin.js
const mongoose = require('mongoose');
const User = require('./models/user');
const dotenv = require('dotenv');

dotenv.config();

const promoteToAdmin = async () => {
  try {
    // 1. Connect to Database
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to Database...");

    // 2. The Username you want to fix (Case Sensitive!)
    const targetUsername = "Arpit_Admin"; 

    // 3. Find and Update
    const user = await User.findOneAndUpdate(
      { username: targetUsername },
      { 
        $set: { 
          status: 'active',  // Unlock the account
          isAdmin: true      // Make them the Boss
        } 
      },
      { new: true } // Return the updated version
    );

    if (user) {
      console.log("✅ SUCCESS! User updated:");
      console.log(`Username: ${user.username}`);
      console.log(`Status:   ${user.status}`);
      console.log(`IsAdmin:  ${user.isAdmin}`);
    } else {
      console.log(`❌ ERROR: Could not find user '${targetUsername}'. Check spelling!`);
    }

    process.exit();
  } catch (err) {
    console.log("❌ Error:", err.message);
    process.exit(1);
  }
};

promoteToAdmin();