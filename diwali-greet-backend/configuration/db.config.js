var mongoose = require("mongoose");

function dbConfig() {
  const url =
    "mongodb+srv://Rahul:Rahul123@cluster0.xcgbplp.mongodb.net/DiwalCard?retryWrites=true&w=majority&appName=Cluster0";

  mongoose
    .connect(url)
    .then(() => {
      console.log("✅ Database connected successfully");
    })
    .catch((err) => {
      console.log("❌ Database connection error:", err);
    });
}

module.exports = { dbConfig };
