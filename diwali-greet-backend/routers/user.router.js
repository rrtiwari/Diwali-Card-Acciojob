var express = require("express");
const { UserModel } = require("../models/user.model");
var userRouter = express.Router();

userRouter.post("/createUser", (req, res) => {
  try {
    UserModel.create(req.body)
      .then((response) => {
        res.status(201).json({
          Message: "User is created successfully",
          Status: "success",
          data: response,
        });
      })
      .catch((error) => {
        res.status(500).json({
          Message: "Something went Wrong",
          Status: `error ${error}`,
        });
      });
  } catch (error) {
    res
      .status(500)
      .json({ Message: "Something went Wrong", Status: `error ${error}` });
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      // Handles missing fields gracefully
      return res
        .status(400)
        .json({ Message: "Email and password is required" });
    }
    const user = await UserModel.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      // Prevents server crash by adding 'return'
      return res
        .status(401)
        .json({ Message: "Email or password do not match" });
    }

    const token = await user.generateJWTToken();

    // CRITICAL: Sets the secure cookie for the browser
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // True only on Render/Vercel
      sameSite: "Lax",
    });

    res.status(200).json({
      Message: "User logged in successfully",
      success: true,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({
      Message: "Something went Wrong",
      Status: `error ${error.message}`,
    });
  }
});

module.exports = { userRouter };
