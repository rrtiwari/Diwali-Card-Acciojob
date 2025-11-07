var express = require("express");
var app = express();
var cors = require("cors");
var dotenv = require("dotenv");
dotenv.config();

const { dbConfig } = require("./configuration/db.config");
const { userRouter } = require("./routers/user.router");
const { geminiRouter } = require("./routers/gemini.router");
var cookieParser = require("cookie-parser");

// Define your CORS options
const corsOptions = {
  origin: "https://diwali-card-acciojob.vercel.app",
  credentials: true,
};

// This one line handles all CORS and preflight requests
app.use(cors(corsOptions));

// We remove the app.options line that was causing the crash

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/user", userRouter);
app.use("/api/v1/gemini", geminiRouter);

var PORT = process.env.PORT || 5001;

app.listen(PORT, async () => {
  await dbConfig();
  console.log(`Listening to the port ${PORT}`);
});
