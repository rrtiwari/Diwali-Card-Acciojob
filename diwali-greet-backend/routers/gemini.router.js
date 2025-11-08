var express = require("express");
const { buildPrompt } = require("../utils/build.prompt");
const { text } = require("body-parser");
// const { isLoggedIn } = require("../middlewares/user.middleware"); <-- THIS LINE IS NOW REMOVED
var geminiRouter = express.Router();

// The isLoggedIn check is removed from the route to prevent crashing
geminiRouter.post("/generate", async (req, res) => {
  const { receiptName, language, tone } = req.body;

  if (!receiptName?.trim()) {
    return res.status(400).json({ message: "Name required" });
  }

  let gemini_key = process.env.GEMINI_API_KEY;
  if (!gemini_key) {
    return res
      .status(500)
      .json({ message: "Server API key (GEMINI_API_KEY) not set." });
  }

  try {
    let prompt = buildPrompt(receiptName, language, tone);
    prompt += "\n\nImportant instructions:";
    prompt += "\n1. Sign the message from 'Rahul Tiwari'.";
    prompt +=
      "\n2. DO NOT include a 'Subject:' line. Start the message directly with the greeting (e.g., 'Dear Mohan,').";

    // --- Using stable gemini-2.5-flash on v1beta endpoint ---
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": gemini_key,
        },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      const greeting =
        data?.candidates?.[0]?.content?.parts?.[0]?.text || "No responses";

      if (greeting === "No responses") {
        return res
          .status(500)
          .json({
            message: "API Response was successful but returned no text.",
          });
      }

      res.json({ message: greeting });
    } else {
      const errorData = await response.json();
      console.error("Google API Error:", response.status, errorData);
      res
        .status(response.status)
        .json({ message: `Google API failed with status ${response.status}.` });
    }
  } catch (error) {
    console.error("Server Error:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error. Check Render logs." });
  }
});

module.exports = { geminiRouter };
