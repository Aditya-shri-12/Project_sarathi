// 1. Load Environment Variables (Must be at the top)
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

// IMPORT ROUTES
const authRoute = require('./routes/auth');
const electionRoute = require('./routes/elections'); 
const voteRoute = require('./routes/vote');
const aiRoute = require('./routes/ai');
<<<<<<< HEAD
const adminRoute = require('./routes/admin'); // Import admin cleanly
const enquiryRoute = require('./routes/enquiry');
=======
const adminRoute = require('./routes/admin'); 

// ✅ UPDATED: Points to the new location in the 'routes' folder
const enquiryRoute = require('./routes/enquiryroute'); 
>>>>>>> 0dc6ee1d9fba307515e0b9c0a98f62505079663b

const app = express();

// 🛡️ SECURITY: Brute Force Protection
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5, 
  message: { error: "⛔ Too many login attempts. Access blocked for 15 minutes." },
  standardHeaders: true, 
  legacyHeaders: false,
});

// MIDDLEWARE
app.use(express.json());
app.use(cors());

// ROUTES
// Apply rate limiter ONLY to login
app.use("/api/auth/login", loginLimiter);

// 1. Auth Route (Register/Login)
app.use('/api/auth', authRoute); 

// 2. Election Route (Creating Elections & Info)
app.use('/api/elections', electionRoute);

// 3. Vote Route (Casting Votes)
app.use('/api/vote', voteRoute);

// 4. AI Route (Manifesto Generation)
app.use('/api/ai', aiRoute);

// 5. Admin Route (Resident Approvals)
app.use('/api/admin', adminRoute);

<<<<<<< HEAD
// 6. Enquiry Route (Organization Enquiries)
app.use('/api/enquiry', enquiryRoute);
=======
// 6. Enquiry Route (Landing Page Forms)
app.use('/api/enquiry', enquiryRoute); // <--- Uses the correct route file now

>>>>>>> 0dc6ee1d9fba307515e0b9c0a98f62505079663b

// TEST ROUTE
app.get('/', (req, res) => {
  res.send('Welcome to SARTHI Voting App - Backend Fully Online!');
});

// START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on Port ${PORT}`);
});