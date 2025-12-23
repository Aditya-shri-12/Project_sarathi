const router = require('express').Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini (Safe Check)
if (!process.env.GEMINI_API_KEY) {
  console.warn("⚠️  WARNING: GEMINI_API_KEY is not set. AI features will not work.");
}

const genAI = process.env.GEMINI_API_KEY 
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

router.post('/generate-manifesto', async (req, res) => {
  try {
    // We accept 'points' (from our frontend) OR 'topic' (generic usage)
    const { points, topic, position } = req.body;
    
    // Combine them to find the actual input text
    const inputContent = points || topic;
    const role = position || "Society Representative"; // Default if not sent

    if (!inputContent) {
        return res.status(400).json({ error: "Please provide rough notes or a topic." });
    }

    // Check if AI is configured
    if (!genAI) {
      return res.status(503).json({ error: "AI service is not configured. Please set GEMINI_API_KEY." });
    }

    // The AI Model - using 1.5-flash for speed/efficiency
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // The Prompt Engineering
    const prompt = `
      You are an expert election campaign manager for a Housing Society.
      The candidate is running for the position of: ${role}.
      
      Here are their rough notes or key focus areas: 
      "${inputContent}"
      
      Task: Write a short, professional, and convincing election manifesto (max 120 words).
      Tone: Polite, leadership-oriented, and trustworthy.
      Structure: A short opening sentence followed by 3-4 bullet points of promises.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Send back 'success: true' to match our Frontend logic
    res.status(200).json({ success: true, manifesto: text });

  } catch (err) {
    console.error("AI generation error:", err);
    res.status(500).json({ error: "AI generation failed. Please try again." });
  }
});

module.exports = router;