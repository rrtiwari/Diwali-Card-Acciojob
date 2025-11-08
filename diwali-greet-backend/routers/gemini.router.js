var express = require("express");
const { buildPrompt } = require("../utils/build.prompt");
const { text } = require("body-parser");
const { isLoggedIn } = require("../middlewares/user.middleware");
var geminiRouter = express.Router();

geminiRouter.post("/generate", isLoggedIn, async (req, res) => {
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

    const response = await fetch(
      // Using the highly stable gemini-2.5-flash on v1beta endpoint
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
        console.error(
          "DEBUG: API returned 200 OK but no text. Full Data:",
          data
        );
        return res
          .status(500)
          .json({
            message: "API Response was successful but returned no text.",
          });
      }

      res.json({ message: greeting });
    } else {
      // Handle non-200 errors (404, 429, 403)
      const errorData = await response.json();
      console.error("Google API Error:", response.status, errorData);
      res
        .status(response.status)
        .json({ message: `Google API failed with status ${response.status}.` });
    }
  } catch (error) {
    // This catches network issues or JSON parsing errors
    console.error("Server Error (Catch Block):", error);
    res
      .status(500)
      .json({
        message: "Something went Wrong",
        Status: `error ${error.message}`,
      });
  }
});

module.exports = { geminiRouter };
