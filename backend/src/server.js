import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

// Import routes
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import subjectRoutes from "./routes/subjects.js";
import materialRoutes from "./routes/materials.js";
import quizRoutes from "./routes/quizzes.js";
import gameRoutes from "./routes/games.js";
import communityRoutes from "./routes/community.js";
import parentalRoutes from "./routes/parental.js";
import contactRoutes from "./routes/contact.js";
import progressRoutes from "./routes/progress.js";
import flashcardRoutes from "./routes/flashcards.js";
import tokenRoutes from "./routes/tokens.js";
import professionalQuizRoutes from "./routes/professionalQuizzes.js";

// Import middleware
import { errorHandler } from "./middleware/errorHandler.js";
import { notFound } from "./middleware/notFound.js";

dotenv.config();

// Set default environment variables if not provided
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = "learnkins-super-secret-jwt-key-development-only";
  console.log("⚠️  JWT_SECRET not found, using default development key");
}

if (!process.env.JWT_EXPIRE) {
  process.env.JWT_EXPIRE = "30d";
}

if (!process.env.MONGODB_URI) {
  process.env.MONGODB_URI =
    "mongodb://localhost:27017/learnkins";
}

// Set default email configuration for Gmail
if (!process.env.EMAIL_HOST) {
  process.env.EMAIL_HOST = "smtp.gmail.com";
  process.env.EMAIL_PORT = "587";
  // Note: Use Gmail App Password, not regular password
  // For testing, you can set EMAIL_USER and EMAIL_PASS or use .env file
  console.log("ℹ️  Email config: Gmail SMTP enabled. Set EMAIL_USER and EMAIL_PASS in .env");
}

const app = express();

// Security middleware
app.use(helmet());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
app.use("/api/", limiter);

// CORS configuration - MUST be before routes
app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:5177",
        "http://localhost:3000",
      ];
      
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Database connection (supports in-memory DB for quick local testing)
const connectDb = async () => {
  try {
    if (process.env.USE_INMEMORY_DB === 'true') {
      // Use mongodb-memory-server for ephemeral local testing
      try {
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        const mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        await mongoose.connect(uri);
        console.log('Connected to in-memory MongoDB');
        return;
      } catch (e) {
        console.warn('mongodb-memory-server not available or failed to start, falling back to MONGODB_URI', e);
      }
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    // do not exit here — allow server to run but many features will fail
  }
};

connectDb();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/materials", materialRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/games", gameRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/parental", parentalRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/flashcards", flashcardRoutes);
app.use("/api/tokens", tokenRoutes);
app.use("/api/professional-quizzes", professionalQuizRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "LearnKins API is running",
    timestamp: new Date().toISOString(),
  });
});

// API root endpoint
app.get("/", (req, res) => {
  res.send("API is running");
});

// Serve a lightweight response for favicon requests to avoid noisy 404s
app.get('/favicon.ico', (req, res) => {
  res.status(204).end();
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(
    `Server running on port ${PORT} in ${
      process.env.NODE_ENV || "development"
    } mode`
  );
  console.log(
    `JWT Secret: ${process.env.JWT_SECRET ? "Configured" : "Using default"}`
  );
  console.log(`MongoDB URI: ${process.env.MONGODB_URI}`);
});

// Handle server errors
server.on('error', (err) => {
  console.error('Server error:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});
