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
import shopRoutes from './routes/shop.js';
import paymentRoutes from './routes/payments.js';
import newsletterRoutes from './routes/newsletter.js';
import verificationRoutes from './routes/verificationRoutes.js';
import certificateRoutes from './routes/certificateRoutes.js';
// Import models for seeding
import User from "./models/User.js";
import ShopItem from "./models/ShopItem.js";
import Material from "./models/Material.js";
import Subject from "./models/Subject.js";

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




const app = express();

// Security middleware
app.use(helmet());
app.use(compression());

// Trust proxy for rate limiter behind Render/Vercel reverse proxy
app.set('trust proxy', 1);

// CORS configuration - MUST be before rate limiter so preflight OPTIONS
// requests get CORS headers even when rate-limited
app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://learnkins.com",
        "https://learnkins-bp00.onrender.com",
        // allow same-origin / deployments (fallback)
      ];

      // If no origin (mobile/curl), allow it
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) return callback(null, true);

      // If running from deployed frontend, allow it via env var(s)
      const extraOrigins = (process.env.CORS_ORIGINS || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      if (extraOrigins.includes(origin)) return callback(null, true);

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-User-Info"],
  })
);

// Rate limiting (skip OPTIONS preflight to avoid CORS issues)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
  validate: { xForwardedForHeader: false },
  keyGenerator: (req) => {
    return req.ip || req.connection.remoteAddress;
  },
});
app.use("/api/", limiter);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Auto-generation fallback middleware for certificate PDFs
import fs from 'fs';
import path from 'path';
import CertificateModel from './models/Certificate.js';
import { generateCertificatePDF } from './controllers/certificateController.js';

app.use('/uploads/pdfs', async (req, res, next) => {
  try {
    const filename = req.path.replace('/', '');
    if (!filename.endsWith('.pdf')) return next();
    
    const certId = filename.replace('.pdf', '');
    const UPLOADS_DIR = path.resolve(process.cwd(), "uploads", "pdfs");
    const filePath = path.join(UPLOADS_DIR, filename);
    
    if (!fs.existsSync(filePath)) {
      // Regenerate on the fly
      const cert = await CertificateModel.findOne({ certificateId: certId });
      if (cert) {
        if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
        await generateCertificatePDF(cert);
      }
    }
    next();
  } catch (error) {
    console.error('Fallback generation error:', error);
    next();
  }
});

// Serve uploaded files statically
app.use('/uploads', express.static('uploads'));

// Logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Database connection (supports in-memory DB for quick local testing)
const connectDb = async () => {
  try {
    console.log('Attempting to connect to database...');
    console.log('USE_INMEMORY_DB:', process.env.USE_INMEMORY_DB);

    if (process.env.USE_INMEMORY_DB === 'true') {
      // Use mongodb-memory-server for ephemeral local testing
      try {
        console.log('Starting in-memory MongoDB server...');
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        const mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        console.log('In-memory MongoDB URI:', uri);
        await mongoose.connect(uri);
        console.log('✅ Connected to in-memory MongoDB');

        // Auto-seed test users
        await seedTestUsers();
        await seedSubjects();
        await seedShopItems();
        await seedContent();
        return;
      } catch (e) {
        console.warn('❌ mongodb-memory-server failed to start, falling back to MONGODB_URI', e.message);
      }
    }

    let uri = process.env.MONGODB_URI;
    // Strip accidental "MONGODB_URI=" prefix if env var was misconfigured
    if (uri && uri.startsWith('MONGODB_URI=')) {
      uri = uri.slice('MONGODB_URI='.length);
      console.warn('⚠️  Stripped MONGODB_URI= prefix from connection string');
    }
    console.log('Connecting to MongoDB...');

    mongoose.connection.on('connecting', () => console.log('🔄 MongoDB: connecting...'));
    mongoose.connection.on('connected', () => console.log('✅ MongoDB connected successfully'));
    mongoose.connection.on('disconnected', () => console.log('⚠️ MongoDB disconnected'));
    mongoose.connection.on('reconnected', () => console.log('✅ MongoDB reconnected'));
    mongoose.connection.on('error', (err) => console.error('❌ MongoDB connection error:', err.message));

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    });

    // Drop orphaned username unique index from previous schema version
    try {
      await mongoose.connection.db.collection('users').dropIndex('username_1');
      console.log('✓ Dropped orphaned username_1 index');
    } catch (_) { /* index doesn't exist — that's fine */ }

  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
};

const seedTestUsers = async () => {
  try {
    console.log('Seeding/updating test users...');

    // Create/update Parent first (no dependencies)
    let parent = await User.findOne({ email: 'mohitlalwani1931.parent@gmail.com' });
    if (parent) {
      parent.password = 'mohit@123';
      parent.isActive = true;
      parent.name = 'Test Parent';
      parent.role = 'parent';
      await parent.save();
      console.log('✓ Parent user updated');
    } else {
      parent = await User.create({
        name: 'Test Parent', email: 'mohitlalwani1931.parent@gmail.com',
        password: 'mohit@123', role: 'parent', isActive: true
      });
      console.log('✓ Parent user created');
    }

    // Create/update Student (needs parent reference)
    let student = await User.findOne({ email: 'mohitlalwani1931@gmail.com' });
    if (student) {
      student.password = 'mohit@123';
      student.isActive = true;
      student.name = 'Test Student';
      student.role = 'student';
      student.grade = '6th';
      student.parentId = parent._id;
      await student.save();
      console.log('✓ Student user updated');
    } else {
      student = await User.create({
        name: 'Test Student', email: 'mohitlalwani1931@gmail.com',
        password: 'mohit@123', role: 'student', grade: '6th',
        parentId: parent._id, isActive: true
      });
      console.log('✓ Student user created');
    }

    // Link student to parent's children array
    if (!parent.children.includes(student._id)) {
      parent.children.push(student._id);
      await parent.save();
      console.log('✓ Student linked to parent');
    }

    // Create/update Admin
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@learnkins.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const adminName = process.env.ADMIN_NAME || 'System Administrator';

    const admin = await User.findOne({ email: adminEmail });
    if (admin) {
      admin.password = adminPassword;
      admin.isActive = true;
      admin.name = adminName;
      admin.role = 'admin';
      await admin.save();
      console.log('✓ Admin user updated');
    } else {
      await User.create({
        name: adminName, email: adminEmail,
        password: adminPassword, role: 'admin', isActive: true
      });
      console.log('✓ Admin user created');
    }

    console.log('✅ Test users seeded successfully!');
  } catch (error) {
    console.error('❌ Auto-seeding failed:', error.message);
  }
};

const seedSubjects = async () => {
  try {
    const count = await Subject.countDocuments();
    if (count > 0) {
      console.log('ℹ️ Subjects already exist, skipping seed.');
      return;
    }
    const subjects = [
      {
        name: "Science",
        slug: "science",
        description: "Explore the wonders of physics, chemistry, and biology through interactive experiments and engaging content.",
        icon: "beaker",
        color: "#a855f7",
        grade: "6th",
        isActive: true,
        chapters: [
          { title: "Crop Production and Management", description: "Learn about agricultural practices and crop management.", duration: "45 min", difficulty: "Beginner", topics: ["Introduction to Agriculture", "Types of Crops", "Modern Farming Methods", "Crop Protection"], order: 1 },
          { title: "Microorganisms: Friend and Foe", description: "Explore the world of microorganisms and their impact.", duration: "50 min", difficulty: "Intermediate", topics: ["Types of Microorganisms", "Helpful Microorganisms", "Harmful Microorganisms", "Food Preservation"], order: 2 },
          { title: "Synthetic Fibres and Plastics", description: "Understand synthetic materials and their properties.", duration: "40 min", difficulty: "Beginner", topics: ["Natural vs Synthetic", "Types of Synthetic Fibres", "Plastics", "Environmental Impact"], order: 3 },
        ],
      },
      {
        name: "Mathematics",
        slug: "mathematics",
        description: "Master mathematical concepts from basic arithmetic to advanced problem-solving techniques.",
        icon: "calculator",
        color: "#3b82f6",
        grade: "6th",
        isActive: true,
        chapters: [
          { title: "Rational Numbers", description: "Understand rational numbers and their operations.", duration: "60 min", difficulty: "Intermediate", topics: ["Introduction to Rational Numbers", "Operations", "Properties", "Word Problems"], order: 1 },
          { title: "Linear Equations in One Variable", description: "Solve linear equations and their applications.", duration: "55 min", difficulty: "Intermediate", topics: ["Solving Linear Equations", "Applications", "Word Problems", "Graphical Representation"], order: 2 },
          { title: "Understanding Quadrilaterals", description: "Learn about different types of quadrilaterals.", duration: "50 min", difficulty: "Beginner", topics: ["Types of Quadrilaterals", "Properties", "Angle Sum Property", "Special Quadrilaterals"], order: 3 },
        ],
      },
      {
        name: "Social Science",
        slug: "social-science",
        description: "Understand history, geography, civics, and economics through engaging stories and interactive maps.",
        icon: "globe2",
        color: "#22c55e",
        grade: "6th",
        isActive: true,
        chapters: [
          { title: "How, When and Where", description: "Explore historical sources and methods.", duration: "45 min", difficulty: "Beginner", topics: ["Historical Sources", "Dating in History", "Maps and History", "Colonial Records"], order: 1 },
          { title: "From Trade to Territory", description: "Study the expansion of colonial rule.", duration: "50 min", difficulty: "Intermediate", topics: ["East India Company", "Trade Expansion", "Political Control", "Company Rule"], order: 2 },
          { title: "Ruling the Countryside", description: "Understand rural society under colonial rule.", duration: "55 min", difficulty: "Intermediate", topics: ["Rural Society", "Revenue Systems", "Agricultural Changes", "Peasant Movements"], order: 3 },
        ],
      },
      {
        name: "English",
        slug: "english",
        description: "Develop reading, writing, and communication skills through literature and creative exercises.",
        icon: "booktext",
        color: "#f97316",
        grade: "6th",
        isActive: true,
        chapters: [
          { title: "The Best Christmas Present in the World", description: "Read and analyze this heartwarming story.", duration: "40 min", difficulty: "Beginner", topics: ["Reading Comprehension", "Vocabulary", "Character Analysis", "Theme Discussion"], order: 1 },
          { title: "The Tsunami", description: "Study the causes and effects of tsunamis.", duration: "45 min", difficulty: "Intermediate", topics: ["Factual Reading", "Cause and Effect", "Disaster Management", "Writing Skills"], order: 2 },
          { title: "Glimpses of the Past", description: "Explore historical events through literature.", duration: "50 min", difficulty: "Beginner", topics: ["Historical Events", "Timeline Reading", "Visual Interpretation", "Discussion"], order: 3 },
        ],
      },
    ];
    await Subject.insertMany(subjects);
    console.log('✅ Subjects seeded:', subjects.length);
  } catch (err) {
    console.warn('Subject seed error:', err.message);
  }
};

const seedContent = async () => {
  try {
    // --- Learning Materials (Videos with YouTube embed URLs) ---
    const matCount = await Material.countDocuments();
    if (matCount === 0) {
      const admin = await User.findOne({ role: 'admin' });
      const adminId = admin?._id;
      const materials = [
        { title: 'Introduction to Cells', description: 'Learn about the basic unit of life – the cell, its structure and functions.', type: 'video', subject: 'science', chapter: 'Cell Biology', grade: '6th', fileUrl: 'https://www.youtube.com/embed/M1wdIdCOk-Y', thumbnailUrl: '', tags: ['cells','biology'], difficulty: 'Beginner', uploadedBy: adminId },
        { title: 'Photosynthesis Explained', description: 'Understand how plants make food using sunlight, water and carbon dioxide.', type: 'video', subject: 'science', chapter: 'Plant Life', grade: '7th', fileUrl: 'https://www.youtube.com/embed/D1Ymc311XS8', thumbnailUrl: '', tags: ['photosynthesis','plants'], difficulty: 'Intermediate', uploadedBy: adminId },
        { title: 'Newton\'s Laws of Motion', description: 'Explore Sir Isaac Newton\'s three laws of motion with real-world examples.', type: 'video', subject: 'science', chapter: 'Forces & Motion', grade: '8th', fileUrl: 'https://www.youtube.com/embed/mn34mnnDnKU', thumbnailUrl: '', tags: ['newton','physics','motion'], difficulty: 'Intermediate', uploadedBy: adminId },
        { title: 'Fractions & Decimals Made Easy', description: 'Visual explanation of fractions, decimals, and how to convert between them.', type: 'video', subject: 'mathematics', chapter: 'Number System', grade: '6th', fileUrl: 'https://www.youtube.com/embed/n0FZhQ_GkKw', thumbnailUrl: '', tags: ['fractions','decimals','math'], difficulty: 'Beginner', uploadedBy: adminId },
        { title: 'Introduction to Algebra', description: 'Learn the basics of algebraic expressions, variables, and equations.', type: 'video', subject: 'mathematics', chapter: 'Algebra', grade: '7th', fileUrl: 'https://www.youtube.com/embed/NybHckSEQBI', thumbnailUrl: '', tags: ['algebra','equations'], difficulty: 'Intermediate', uploadedBy: adminId },
        { title: 'Geometry – Triangles & Angles', description: 'Deep dive into types of triangles, angle properties, and the Pythagorean theorem.', type: 'video', subject: 'mathematics', chapter: 'Geometry', grade: '8th', fileUrl: 'https://www.youtube.com/embed/mLeNaZcy-hE', thumbnailUrl: '', tags: ['geometry','triangles','angles'], difficulty: 'Intermediate', uploadedBy: adminId },
        { title: 'English Grammar – Tenses', description: 'Master all 12 English tenses with clear examples and usage rules.', type: 'video', subject: 'english', chapter: 'Grammar', grade: '6th', fileUrl: 'https://www.youtube.com/embed/d0wV9EC3t14', thumbnailUrl: '', tags: ['grammar','tenses','english'], difficulty: 'Beginner', uploadedBy: adminId },
        { title: 'Creative Writing Tips', description: 'Improve your creative writing skills with structure, storytelling, and vocabulary tips.', type: 'video', subject: 'english', chapter: 'Writing Skills', grade: '7th', fileUrl: 'https://www.youtube.com/embed/RSoRzTtwgP4', thumbnailUrl: '', tags: ['writing','creative','english'], difficulty: 'Intermediate', uploadedBy: adminId },
        { title: 'French Revolution – Causes & Effects', description: 'Understand the causes, major events, and global impact of the French Revolution.', type: 'video', subject: 'social-science', chapter: 'Modern History', grade: '7th', fileUrl: 'https://www.youtube.com/embed/5fJl_ZX91l0', thumbnailUrl: '', tags: ['french revolution','history'], difficulty: 'Intermediate', uploadedBy: adminId },
        { title: 'Maps & Globe – Geography Basics', description: 'Learn how maps and globes work, including latitude, longitude, and map symbols.', type: 'video', subject: 'social-science', chapter: 'Geography', grade: '6th', fileUrl: 'https://www.youtube.com/embed/_pOKoIAnybg', thumbnailUrl: '', tags: ['maps','geography','globe'], difficulty: 'Beginner', uploadedBy: adminId },
      ];
      await Material.insertMany(materials);
      console.log('✅ Learning materials seeded:', materials.length);
    } else {
      console.log('ℹ️ Materials already exist, skipping seed.');
    }
  } catch (err) {
    console.warn('Content seed error:', err.message);
  }
};

const seedShopItems = async () => {
  try {
    const count = await ShopItem.countDocuments();
    if (count > 0) return; // Already seeded
    const items = [
      { title: 'Science Flashcard Pack', description: 'Unlock 50 premium Science flashcards covering all chapters for Grade 6-8.', type: 'flashcard_pack', price: 30, icon: '🔬', subject: 'science', sortOrder: 1 },
      { title: 'Mathematics Pro Pack',   description: 'Unlock 50 premium Mathematics flashcards with solved examples and formulas.', type: 'flashcard_pack', price: 30, icon: '🧮', subject: 'mathematics', sortOrder: 2 },
      { title: 'English Excellence Pack',description: 'Unlock 40 premium English grammar & vocabulary flashcards.', type: 'flashcard_pack', price: 30, icon: '📖', subject: 'english', sortOrder: 3 },
      { title: 'Social Science Bundle',  description: 'Unlock 40 premium History, Geography & Civics flashcards.', type: 'flashcard_pack', price: 30, icon: '🌍', subject: 'social-science', sortOrder: 4 },
      { title: 'Hint Wizard (5 Hints)',  description: 'Get 5 hints usable in any quiz. Never get stuck again!', type: 'power_up', price: 15, icon: '💡', subject: 'all', sortOrder: 5 },
      { title: 'Double XP Boost',        description: 'Earn 2× experience points for your next 10 activities.', type: 'boost', price: 50, icon: '⚡', subject: 'all', sortOrder: 6 },
      { title: 'Streak Shield',          description: "Miss a day without losing your study streak. One-time use.", type: 'power_up', price: 25, icon: '🛡️', subject: 'all', sortOrder: 7 },
      { title: 'Quiz Power Pack (5 Attempts)', description: 'Get 5 extra attempts for any Premium Quiz.', type: 'quiz_unlock', price: 20, icon: '🎯', subject: 'all', sortOrder: 8 },
      { title: 'Leaderboard Spotlight', description: 'Get featured at the top of the community leaderboard for 24 hours.', type: 'cosmetic', price: 35, icon: '🌟', subject: 'all', sortOrder: 9 },
      { title: 'Custom Avatar Frame',   description: 'Unlock a unique gold frame for your profile avatar.', type: 'cosmetic', price: 40, icon: '👑', subject: 'all', sortOrder: 10 },
    ];
    await ShopItem.insertMany(items);
    console.log('✅ Shop items seeded:', items.length);
  } catch (err) {
    console.warn('Shop seed error:', err.message);
  }
};

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
app.use("/api/shop", shopRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/verify", verificationRoutes);
app.use("/api/certificates", certificateRoutes);

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

connectDb().then(() => {
  const PORT = process.env.PORT || 5000;
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(
      `Server running on port ${PORT} in ${process.env.NODE_ENV || "development"
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
});
