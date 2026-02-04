const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// connect database
connectDB();

// middleware
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());

// routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/posts", require("./routes/posts"));

module.exports = app;
