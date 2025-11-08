var express = require("express");
const { buildPrompt } = require("../utils/build.prompt");
const { text } = require("body-parser");
const { isLoggedIn } = require("../middlewares/user.middleware");
var geminiRouter = express.Router();

geminiRouter.post("/generate", isLoggedIn, async (req, res) => {
  try {
    const { receiptName, language, tone } = req.body;
    console.log("✅ OFFLINE TEST SUCCESS - DATA RECEIVED:", req.body);

    // --- FAKE RESPONSE (Guaranteed 200 OK) ---
    const testMessage = `Dear ${receiptName},\n\nWe successfully reached the server! This is an offline test response for your ${tone} message in ${language}.\n\nWarm regards,\nRahul Tiwari`;

    // Simulate a successful API call response structure
    res.status(200).json({
      message: testMessage,
      success: true,
    });
  } catch (error) {
    console.error("Server Error:", error);
    res
      .status(500)
      .json({
        message: "Something went Wrong",
        Status: `error ${error.message}`,
      });
  }
});

module.exports = { geminiRouter };
