import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import publicRoutes from "./routes/publicRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { errorHandler } from "./middlewares/errorHandler.js";

dotenv.config();

const app = express();

// Security HTTP headers
app.use(
  helmet({
    crossOriginResourcePolicy: false,
    contentSecurityPolicy: false,
  })
);

// CORS configuration
const allowedOrigins = [
  process.env.CLIENT_URL,
  "https://client-beta-nine-75.vercel.app",
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl)
      if (!origin) return callback(null, true);

      // Check if matches allowedOrigins, localhost, or any vercel.app domain
      if (
        allowedOrigins.includes(origin) ||
        origin.startsWith("http://localhost:") ||
        origin.endsWith(".vercel.app") ||
        origin.includes("vercel.app")
      ) {
        return callback(null, origin); // Reflect requesting origin to allow credentials
      }

      return callback(null, origin); // Permissive fallback
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

// Rate limiter for general API
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 600, // Limit each IP to 600 requests per window
  message: { success: false, message: "Trop de requêtes, veuillez réessayer ultérieurement." },
});
app.use("/api/", limiter);

// Logging
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// Body parsers
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));
app.use(cookieParser());

// Sanitize inputs against NoSQL Injection
app.use(mongoSanitize());

// Health Check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    app: "Dari Belle API",
    store: "Dari Belle - Tiaret, Algérie",
    slogan: "3AMRI DAREK M3ANA / La Beauté a Son Adresse",
    timestamp: new Date().toISOString(),
  });
});

// REST API Endpoints (/api/v1)
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1", publicRoutes);

// 404 Route handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Point de terminaison introuvable : ${req.originalUrl}`,
  });
});

// Global Error Handler
app.use(errorHandler);

export default app;
