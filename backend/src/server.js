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
// Import models for seeding
import User from "./models/User.js";
import ShopItem from "./models/ShopItem.js";
import ProfessionalQuiz from "./models/ProfessionalQuiz.js";
import Material from "./models/Material.js";

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
    "mongodb+srv://demonicrui1_db_user:SfvEmhUD0j58C16t@cluster0.8oojsj8.mongodb.net/?appName=Cluster0";
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
        "http://localhost:5176",
        "http://localhost:5177",
        "http://localhost:5178",
        "http://localhost:5179",
        "http://localhost:5180",
        "http://localhost:3000",
        "http://localhost:8080",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://127.0.0.1:5175",
        "http://127.0.0.1:5176",
        // GitHub Codespaces URLs
        "https://learnkins-1.onrender.com",
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
        await seedShopItems();
        await seedContent();
        return;
      } catch (e) {
        console.warn('❌ mongodb-memory-server failed to start, falling back to MONGODB_URI', e.message);
      }
    }

    console.log('Connecting to MONGODB_URI:', process.env.MONGODB_URI);
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected successfully');

    // Auto-seed test users if database is empty
    await seedTestUsers();
    await seedShopItems();
    await seedContent();
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    // do not exit here — allow server to run but many features will fail
  }
};

const seedTestUsers = async () => {
  try {
    console.log('Checking for existing users...');
    const userCount = await User.countDocuments();
    console.log('Current user count:', userCount);

    if (userCount === 0) {
      console.log('📇 Database is empty, seeding test users...');

      // Create Parent
      const parent = await User.create({
        name: 'Test Parent',
        email: 'mohitlalwani1931.parent@gmail.com',
        password: 'mohit@123',
        role: 'parent',
        isActive: true
      });
      console.log('✓ Parent user created');

      // Create Student
      await User.create({
        name: 'Test Student',
        email: 'mohitlalwani1931@gmail.com',
        password: 'mohit@123',
        role: 'student',
        grade: '6th',
        parentId: parent._id,
        isActive: true
      });

      // Create Admin
      await User.create({
        name: 'System Administrator',
        email: 'admin@learnkins.com',
        password: 'admin123',
        role: 'admin',
        isActive: true
      });
      console.log('✓ Admin user created');

      console.log('✅ Test users seeded successfully!');
    } else {
      console.log('ℹ️ Database already contains users, skipping auto-seed.');
    }
  } catch (error) {
    console.error('❌ Auto-seeding failed:', error.message);
  }
};

const seedContent = async () => {
  try {
    // --- Professional Quizzes ---
    const quizCount = await ProfessionalQuiz.countDocuments();
    if (quizCount === 0) {
      const admin = await User.findOne({ role: 'admin' });
      const adminId = admin?._id;
      const quizzes = [
        {
          title: 'Science Fundamentals – Grade 6',
          description: 'Test your knowledge of basic science concepts including matter, motion, and living organisms.',
          subject: 'science', grade: '6th', difficulty: 'Easy', timeLimit: 20, passingScore: 60, totalQuestions: 5, createdBy: adminId, isActive: true,
          questions: [
            { id: 'sq1', question: 'What is the basic unit of life?', options: ['Cell', 'Atom', 'Molecule', 'Tissue'], correctAnswer: 0, explanation: 'The cell is the fundamental unit of life.', points: 1 },
            { id: 'sq2', question: 'Which planet is closest to the Sun?', options: ['Venus', 'Earth', 'Mercury', 'Mars'], correctAnswer: 2, explanation: 'Mercury is the closest planet to the Sun.', points: 1 },
            { id: 'sq3', question: 'What is the chemical formula of water?', options: ['H2O2', 'H2O', 'HO', 'OH2'], correctAnswer: 1, explanation: 'Water has two hydrogen atoms and one oxygen atom.', points: 1 },
            { id: 'sq4', question: 'Which gas do plants absorb during photosynthesis?', options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Hydrogen'], correctAnswer: 2, explanation: 'Plants absorb CO2 and release oxygen during photosynthesis.', points: 1 },
            { id: 'sq5', question: 'What is the force that pulls objects toward Earth?', options: ['Magnetism', 'Friction', 'Gravity', 'Tension'], correctAnswer: 2, explanation: 'Gravity is the force of attraction between objects.', points: 1 },
          ]
        },
        {
          title: 'Mathematics Challenge – Grade 6',
          description: 'Solve arithmetic, fractions, and basic algebra problems for Grade 6 students.',
          subject: 'mathematics', grade: '6th', difficulty: 'Medium', timeLimit: 25, passingScore: 60, totalQuestions: 5, createdBy: adminId, isActive: true,
          questions: [
            { id: 'mq1', question: 'What is 15% of 200?', options: ['25', '30', '35', '20'], correctAnswer: 1, explanation: '15/100 × 200 = 30', points: 1 },
            { id: 'mq2', question: 'Simplify the fraction 12/16.', options: ['2/4', '3/4', '6/8', '1/2'], correctAnswer: 1, explanation: 'HCF of 12 and 16 is 4; 12÷4=3, 16÷4=4.', points: 1 },
            { id: 'mq3', question: 'What is the value of x if 3x + 6 = 21?', options: ['3', '4', '5', '6'], correctAnswer: 2, explanation: '3x = 15, so x = 5.', points: 1 },
            { id: 'mq4', question: 'What is the area of a rectangle with length 8 cm and width 5 cm?', options: ['13 cm²', '26 cm²', '40 cm²', '45 cm²'], correctAnswer: 2, explanation: 'Area = length × width = 8 × 5 = 40 cm².', points: 1 },
            { id: 'mq5', question: 'The LCM of 4 and 6 is:', options: ['12', '24', '6', '8'], correctAnswer: 0, explanation: 'LCM(4,6) = 12', points: 1 },
          ]
        },
        {
          title: 'English Grammar Quiz – Grade 7',
          description: 'Test your English grammar knowledge including tenses, parts of speech, and sentence structure.',
          subject: 'english', grade: '7th', difficulty: 'Medium', timeLimit: 20, passingScore: 60, totalQuestions: 5, createdBy: adminId, isActive: true,
          questions: [
            { id: 'eq1', question: 'Choose the correct form: She ___ to school every day.', options: ['go', 'goes', 'going', 'gone'], correctAnswer: 1, explanation: 'Third person singular uses "goes" in present simple.', points: 1 },
            { id: 'eq2', question: 'What is the noun in: "The brave soldier fought courageously"?', options: ['brave', 'soldier', 'fought', 'courageously'], correctAnswer: 1, explanation: '"soldier" is the noun (person).', points: 1 },
            { id: 'eq3', question: 'Which sentence is correct?', options: ['I has a dog.', 'He have two cats.', 'They are happy.', 'She were late.'], correctAnswer: 2, explanation: '"They are happy" uses the correct form of "to be".', points: 1 },
            { id: 'eq4', question: 'What is the plural of "child"?', options: ['childs', 'childes', 'children', 'childrens'], correctAnswer: 2, explanation: 'The irregular plural of child is children.', points: 1 },
            { id: 'eq5', question: 'Choose the antonym of "ancient":', options: ['old', 'modern', 'historical', 'vintage'], correctAnswer: 1, explanation: 'Ancient means very old; modern is its opposite.', points: 1 },
          ]
        },
        {
          title: 'Social Science – History & Geography Grade 7',
          description: 'Explore important historical events, geographical facts, and civics for Grade 7.',
          subject: 'social-science', grade: '7th', difficulty: 'Easy', timeLimit: 20, passingScore: 60, totalQuestions: 5, createdBy: adminId, isActive: true,
          questions: [
            { id: 'ss1', question: 'Which is the largest continent by area?', options: ['Africa', 'North America', 'Asia', 'Europe'], correctAnswer: 2, explanation: 'Asia is the largest continent, covering about 44.6 million km².', points: 1 },
            { id: 'ss2', question: 'Who was the first Prime Minister of India?', options: ['Mahatma Gandhi', 'Jawaharlal Nehru', 'Sardar Patel', 'Subhas Bose'], correctAnswer: 1, explanation: 'Jawaharlal Nehru served as India\'s first Prime Minister from 1947.', points: 1 },
            { id: 'ss3', question: 'The French Revolution began in which year?', options: ['1776', '1789', '1804', '1815'], correctAnswer: 1, explanation: 'The French Revolution began in 1789.', points: 1 },
            { id: 'ss4', question: 'Which river is the longest in the world?', options: ['Amazon', 'Nile', 'Yangtze', 'Mississippi'], correctAnswer: 1, explanation: 'The Nile River at ~6,650 km is considered the longest river.', points: 1 },
            { id: 'ss5', question: 'The Preamble to the Indian Constitution begins with:', options: ['We the People', 'We the Citizens', 'We the Students', 'We the Nation'], correctAnswer: 0, explanation: 'The Preamble starts with "We, the People of India".', points: 1 },
          ]
        },
        {
          title: 'Advanced Science – Grade 8',
          description: 'Challenge yourself with Grade 8 science: physics, chemistry, and biology topics.',
          subject: 'science', grade: '8th', difficulty: 'Hard', timeLimit: 30, passingScore: 60, totalQuestions: 5, createdBy: adminId, isActive: true,
          questions: [
            { id: 'as1', question: 'What is the SI unit of electric current?', options: ['Volt', 'Watt', 'Ampere', 'Ohm'], correctAnswer: 2, explanation: 'Ampere (A) is the SI unit of electric current.', points: 1 },
            { id: 'as2', question: 'Which type of cell division is responsible for growth and repair?', options: ['Meiosis', 'Mitosis', 'Binary Fission', 'Budding'], correctAnswer: 1, explanation: 'Mitosis produces two identical daughter cells for growth and repair.', points: 1 },
            { id: 'as3', question: 'The atomic number of Carbon is:', options: ['6', '12', '8', '14'], correctAnswer: 0, explanation: 'Carbon has 6 protons, so its atomic number is 6.', points: 1 },
            { id: 'as4', question: 'Newton\'s Second Law states that Force equals:', options: ['Mass + Acceleration', 'Mass × Acceleration', 'Mass / Acceleration', 'Mass - Acceleration'], correctAnswer: 1, explanation: 'F = ma (Force = mass × acceleration)', points: 1 },
            { id: 'as5', question: 'Which gas is produced during the electrolysis of water at the cathode?', options: ['Oxygen', 'Hydrogen', 'Nitrogen', 'Carbon Dioxide'], correctAnswer: 1, explanation: 'Hydrogen gas is produced at the cathode during electrolysis of water.', points: 1 },
          ]
        },
      ];
      await ProfessionalQuiz.insertMany(quizzes);
      console.log('✅ Professional quizzes seeded:', quizzes.length);
    } else {
      console.log('ℹ️ Quizzes already exist, skipping seed.');
    }

    // --- Learning Materials (Videos with YouTube embed URLs) ---
    const matCount = await Material.countDocuments();
    if (matCount === 0) {
      const admin = await User.findOne({ role: 'admin' });
      const adminId = admin?._id;
      const materials = [
        { title: 'Introduction to Cells', description: 'Learn about the basic unit of life – the cell, its structure and functions.', type: 'video', subject: 'science', chapter: 'Cell Biology', grade: '6th', fileUrl: 'https://www.youtube.com/embed/8IlzKri08kU', thumbnailUrl: '', tags: ['cells','biology'], difficulty: 'Beginner', uploadedBy: adminId },
        { title: 'Photosynthesis Explained', description: 'Understand how plants make food using sunlight, water and carbon dioxide.', type: 'video', subject: 'science', chapter: 'Plant Life', grade: '7th', fileUrl: 'https://www.youtube.com/embed/E7vcjMjTBoo', thumbnailUrl: '', tags: ['photosynthesis','plants'], difficulty: 'Intermediate', uploadedBy: adminId },
        { title: 'Newton\'s Laws of Motion', description: 'Explore Sir Isaac Newton\'s three laws of motion with real-world examples.', type: 'video', subject: 'science', chapter: 'Forces & Motion', grade: '8th', fileUrl: 'https://www.youtube.com/embed/mn34mnnDnKU', thumbnailUrl: '', tags: ['newton','physics','motion'], difficulty: 'Intermediate', uploadedBy: adminId },
        { title: 'Fractions & Decimals Made Easy', description: 'Visual explanation of fractions, decimals, and how to convert between them.', type: 'video', subject: 'mathematics', chapter: 'Number System', grade: '6th', fileUrl: 'https://www.youtube.com/embed/n0FZhQ_GkKw', thumbnailUrl: '', tags: ['fractions','decimals','math'], difficulty: 'Beginner', uploadedBy: adminId },
        { title: 'Introduction to Algebra', description: 'Learn the basics of algebraic expressions, variables, and equations.', type: 'video', subject: 'mathematics', chapter: 'Algebra', grade: '7th', fileUrl: 'https://www.youtube.com/embed/NybHckSEQBI', thumbnailUrl: '', tags: ['algebra','equations'], difficulty: 'Intermediate', uploadedBy: adminId },
        { title: 'Geometry – Triangles & Angles', description: 'Deep dive into types of triangles, angle properties, and the Pythagorean theorem.', type: 'video', subject: 'mathematics', chapter: 'Geometry', grade: '8th', fileUrl: 'https://www.youtube.com/embed/2YlPORqgUs8', thumbnailUrl: '', tags: ['geometry','triangles','angles'], difficulty: 'Intermediate', uploadedBy: adminId },
        { title: 'English Grammar – Tenses', description: 'Master all 12 English tenses with clear examples and usage rules.', type: 'video', subject: 'english', chapter: 'Grammar', grade: '6th', fileUrl: 'https://www.youtube.com/embed/W_xsE0HPgxo', thumbnailUrl: '', tags: ['grammar','tenses','english'], difficulty: 'Beginner', uploadedBy: adminId },
        { title: 'Creative Writing Tips', description: 'Improve your creative writing skills with structure, storytelling, and vocabulary tips.', type: 'video', subject: 'english', chapter: 'Writing Skills', grade: '7th', fileUrl: 'https://www.youtube.com/embed/JJrBgwRfPgQ', thumbnailUrl: '', tags: ['writing','creative','english'], difficulty: 'Intermediate', uploadedBy: adminId },
        { title: 'French Revolution – Causes & Effects', description: 'Understand the causes, major events, and global impact of the French Revolution.', type: 'video', subject: 'social-science', chapter: 'Modern History', grade: '7th', fileUrl: 'https://www.youtube.com/embed/5fJl_ZX91l0', thumbnailUrl: '', tags: ['french revolution','history'], difficulty: 'Intermediate', uploadedBy: adminId },
        { title: 'Maps & Globe – Geography Basics', description: 'Learn how maps and globes work, including latitude, longitude, and map symbols.', type: 'video', subject: 'social-science', chapter: 'Geography', grade: '6th', fileUrl: 'https://www.youtube.com/embed/D1MoRb0Nozs', thumbnailUrl: '', tags: ['maps','geography','globe'], difficulty: 'Beginner', uploadedBy: adminId },
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
app.use("/api/shop", shopRoutes);

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
