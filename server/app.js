
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const pool = require("./config/db");
const electionRoutes = require("./routes/electionRoutes");
const authRoutes = require("./routes/authRoutes");
const resultSheetRoutes = require("./routes/resultSheetRoutes");
const publicResultsRoutes = require("./routes/publicResultsRoutes");

const app = express();

// Security and request middleware
app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  })
);

app.use(express.json());

// Basic API health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "BallotLens API is running.",
  });
});

// Database connection check
app.get("/api/db-check", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT NOW() AS current_time"
    );

    res.status(200).json({
      success: true,
      message: "BallotLens database connected successfully.",
      databaseTime: result.rows[0].current_time,
    });
  } catch (error) {
     console.error("Database connection check failed:", {
  message: error.message,
  code: error.code,
  detail: error.detail,
});
   

    res.status(500).json({
      success: false,
      message: "Could not connect to the BallotLens database.",
    });
  }
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/elections", electionRoutes);
app.use("/api/result-sheets", resultSheetRoutes);
app.use("/api/public-results", publicResultsRoutes);

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found.",
  });
});

module.exports = app;
