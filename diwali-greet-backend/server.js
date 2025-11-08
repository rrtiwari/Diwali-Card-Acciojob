var express = require("express");
var app = express();
var cors = require("cors");
var dotenv = require("dotenv");
dotenv.config();

const { dbConfig } = require("./configuration/db.config");
const { userRouter } = require("./routers/user.router");
const { geminiRouter } = require("./routers/gemini.router");
var cookieParser = require("cookie-parser");

const corsOptions = {
  origin: [
    "https://diwali-card-acciojob.vercel.app",
    "https://diwali-card-acciojob-eyn3dsr4v-rahul-tiwaris-projects-7c661166.vercel.app",
  ],
  credentials: true,
};

app.use(cors(corsOptions));

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
