const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const movieRoute = require("./routes/movies");
const listRoute = require("./routes/lists");
const commentRoute = require("./routes/comment");
const castRoute = require("./routes/cast");
const cors = require("cors");
// launching backend
const app = express();
const PORT = 8080 || process.env.PORT;
dotenv.config();

// Connection to MongoDB
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("connected to mongoDB");
  } catch (err) {
    throw err;
  }
};
mongoose.connection.on("disconnected", () => {
  console.log("mongodb disconnected");
});

// Initializing routes_middlewares
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/movies", movieRoute);
app.use("/api/lists", listRoute);
app.use("/api/comments", commentRoute);
app.use("/api/casts", castRoute);

// Initializing PORT
app.listen(PORT, () => {
  connect();
  console.log(`Server connected to PORT ${PORT}`);
});
