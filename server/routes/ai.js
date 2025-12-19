const router = require('express').Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/generate-manifesto', async (req, res) => {
  try {
    const { topic } = req.body; // e.g., "Fix water tank"

    if (!topic) return res.status(400).json("Please provide a topic.");

    // The AI Model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // The Prompt Engineering
    const prompt = `
      You are an expert election campaign manager for a Housing Society.
      Write a short, professional, and convincing election manifesto (max 100 words) 
      based on these key points: "${topic}".
      Keep the tone polite and leadership-oriented.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ manifesto: text });

  } catch (err) {
    console.error(err);
    res.status(500).json("AI generation failed. Please try again.");
  }
});

module.exports = router;