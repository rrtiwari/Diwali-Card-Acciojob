var express = require("express");
var app = express();
var cors = require("cors");
var dotenv = require("dotenv");
dotenv.config();

const { dbConfig } = require("./configuration/db.config");
const { userRouter } = require("./routers/user.router");
const { geminiRouter } = require("./routers/gemini.router");
var cookieParser = require("cookie-parser");

const allowedOrigins = [
  "https://diwali-card-acciojob.vercel.app",
  "https://*-diwali-card-acciojob.vercel.app",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    const isAllowed = allowedOrigins.some((pattern) => {
      if (pattern.includes("*")) {
        const regex = new RegExp(
          "^" + pattern.replace(/\./g, "\\.").replace(/\*/g, "([^\\.]+)") + "$"
        );
        return regex.test(origin);
      }
      return origin === pattern;
    });

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
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
