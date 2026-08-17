import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "Task Manager API is running",
  });
});

const server = app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});

const shutdown = async () => {
  server.close(() => {
    process.exit(0);
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
