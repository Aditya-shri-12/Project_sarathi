const router = require('express').Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini
if (!process.env.GEMINI_API_KEY) {
  console.warn("⚠️  WARNING: GEMINI_API_KEY is not set. AI features will not work.");
}

const genAI = process.env.GEMINI_API_KEY 
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

router.post('/generate-manifesto', async (req, res) => {
  try {
    const { topic } = req.body; // e.g., "Fix water tank"

    if (!topic) return res.status(400).json({ error: "Please provide a topic." });

    // Check if AI is configured
    if (!genAI) {
      return res.status(503).json({ error: "AI service is not configured. Please set GEMINI_API_KEY in environment variables." });
    }

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
    console.error("AI generation error:", err);
    res.status(500).json({ error: "AI generation failed. Please try again." });
  }
});

module.exports = router;