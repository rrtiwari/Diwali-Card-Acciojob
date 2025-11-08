var express = require("express");
const { buildPrompt } = require("../utils/build.prompt");
const { isLoggedIn } = require("../middlewares/user.middleware");
var geminiRouter = express.Router();

geminiRouter.post("/generate", isLoggedIn, async (req, res) => {
  try {
    const { receiptName, language, tone } = req.body;
    console.log("✅ OFFLINE TEST SUCCESS - DATA RECEIVED:", req.body);

    // --- FAKE RESPONSE (Guaranteed 200 OK) ---
    const testMessage = 
      `Dear ${receiptName},\n\nWe successfully bypassed the external server issue! This is the fixed, stable response for your ${tone} message in ${language}.\n\nWarm regards,\nRahul Tiwari`;
    
    // Send the correct JSON structure
    res.status(200).json({
      message: testMessage
    });

  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ message: "Internal Server Error during generation." });
  }
});

module.exports = { geminiRouter };