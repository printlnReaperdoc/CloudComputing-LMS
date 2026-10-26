require("dotenv").config();

const express = require("express");
const path = require("path");
const { initDB, db } = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");
const chapterRoutes = require("./routes/chapterRoutes");
const quizRoutes = require("./routes/quizRoutes");
const gradebookRoutes = require("./routes/gradebookRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON and form payloads (50mb limit for slide deck uploads)
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Serve frontend static assets
const frontendPath = path.join(__dirname, "../frontend");
app.use(express.static(frontendPath));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/course", courseRoutes);
app.use("/api/chapters", chapterRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/gradebook", gradebookRoutes);

// System health and status endpoint
app.get("/api/status", (req, res) => {
  res.json({
    success: true,
    message: "Cloud Computing LMS Backend Online",
    database: "MySQL Engine",
    time: new Date().toISOString()
  });
});

// Fallback to index.html for Single Page Application routing (Express 5 safe)
app.use((req, res, next) => {
  if (req.method === "GET" && !req.path.startsWith("/api/")) {
    return res.sendFile(path.join(frontendPath, "index.html"));
  }
  next();
});

// 404 handler for API routes (prevents Express default HTML 404 error page)
app.use("/api", (req, res) => {
  res.status(404).json({
    success: false,
    error: `API route not found: ${req.method} ${req.originalUrl}`
  });
});

// Global error handling middleware (prevents Express default HTML 500 error page)
app.use((err, req, res, next) => {
  console.error("Unhandled server error:", err);
  if (req.path.startsWith("/api/")) {
    return res.status(err.status || 500).json({
      success: false,
      error: err.message || "Internal server error"
    });
  }
  res.status(500).send("Internal Server Error");
});

// Start server
async function startServer() {
  await initDB();
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(` Cloud Computing (Elective 4) LMS Server Online!   `);
    console.log(` Course: ITEP413-T | 4th Year, 1st Term (4-1)       `);
    console.log(` URL: http://localhost:${PORT}                      `);
    console.log(` Mode: MySQL Connected `);
    console.log(`====================================================`);
  });
}

startServer().catch((err) => {
  console.error("Fatal startup error:", err);
});
