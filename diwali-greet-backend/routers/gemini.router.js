var express = require("express");
const { buildPrompt } = require("../utils/build.prompt");
const { text } = require("body-parser");
// const { isLoggedIn } = require("../middlewares/user.middleware"); <--- REMOVED
var geminiRouter = express.Router();

// Middleware removed from the route
geminiRouter.post("/generate", async (req, res) => {
  try {
    const { receiptName, language, tone } = req.body;
    
    // Check for the name field immediately, as the next step depends on it
    if (!receiptName?.trim()) {
        return res.status(400).json({ message: "Name required" });
    }

    console.log("✅ OFFLINE TEST SUCCESS - DATA RECEIVED:", req.body);

    // --- FAKE RESPONSE (Guaranteed 200 OK) ---
    const testMessage = 
      `Dear ${receiptName},\n\nThis is the stable, working response for your ${tone} message in ${language}.\n\nWarm regards,\nRahul Tiwari`;
    
    // Send the correct JSON structure
    res.status(200).json({
      message: testMessage
    });

  } catch (error) {
    console.error("Internal Server Error during Generation:", error);
    // This should now never be reached
    res.status(500).json({ message: "Internal Server Error during generation." });
  }
});

module.exports = { geminiRouter };