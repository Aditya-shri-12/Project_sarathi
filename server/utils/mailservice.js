// server/utils/emailService.js
const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // Prevent crash if credentials are missing
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log("⚠️ Email credentials missing in .env. Skipping email.");
      return;
  }

  try {
      // 1. Create Transporter (The Login Step)
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER, 
          pass: process.env.EMAIL_PASS, 
        },
      });

      // 2. Define Email Options
      const mailOptions = {
        from: `"Saarthi Team" <${process.env.EMAIL_USER}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
      };

      // 3. Send Email
      await transporter.sendMail(mailOptions);
      console.log(`✅ Email sent to: ${options.to}`);
      
  } catch (error) {
      console.error("❌ Email Service Error:", error.message);
      // We log the error but don't stop the server
  }
};

module.exports = sendEmail;