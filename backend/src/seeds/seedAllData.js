import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Import models
import Quiz from "../models/Quiz.js";
import Flashcard from "../models/Flashcard.js";
import Material from "../models/Material.js";
import User from "../models/User.js";

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb://localhost:27017/learnkins";

// Connect to MongoDB
const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✓ MongoDB connected successfully");
  } catch (error) {
    console.error("✗ Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

// Disconnect from MongoDB
const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log("✓ MongoDB disconnected");
  } catch (error) {
    console.error("✗ Error disconnecting:", error.message);
  }
};

// Load JSON files
const loadJSON = (filename) => {
  try {
    const filepath = path.join(
      __dirname,
      "../../public",
      filename
    );
    const data = fs.readFileSync(filepath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error(`✗ Error loading ${filename}:`, error.message);
    return [];
  }
};

// Create or get admin user. Read admin creds from environment to avoid
// committing passwords in the repo. Set ADMIN_EMAIL and ADMIN_PASSWORD in
// your `.env` or environment before running `node scripts/seedAllData.js`.
const getAdminUser = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || "admin@learnkins.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
    const adminName = process.env.ADMIN_NAME || "Admin";

    let admin = await User.findOne({ email: adminEmail.toLowerCase() }).select('+password');

    if (!admin) {
      admin = await User.create({
        name: adminName,
        email: adminEmail.toLowerCase(),
        password: adminPassword,
        role: "admin",
        grade: null,
        isActive: true,
      });
      console.log(`✓ Admin user created (${adminEmail})`);
    } else {
      // Update existing admin with new credentials
      admin.name = adminName;
      admin.role = "admin";
      admin.password = adminPassword; // Will be hashed by pre-save hook
      await admin.save();
      console.log(`✓ Admin user updated with new credentials (${adminEmail})`);
    }

    return admin._id;
  } catch (error) {
    console.error("✗ Error getting admin user:", error.message);
    throw error;
  }
};

// Seed Quizzes
const seedQuizzes = async (adminId) => {
  try {
    console.log("\n📚 Seeding Quizzes...");
    
    const assessmentsFiles = [
      "demo-assessments.json",
      "mathematics-assessments.json",
      "science-assessments.json",
      "english-assessments.json",
      "social-science-assessments.json",
    ];

    let totalQuizzes = 0;
    const grades = ["6th", "7th", "8th"];
    const difficultyMap = {
      "easy": "Easy",
      "Easy": "Easy",
      "medium": "Medium",
      "Medium": "Medium",
      "hard": "Hard",
      "Hard": "Hard"
    };

    for (const file of assessmentsFiles) {
      const assessments = loadJSON(file);
      
      for (const assessment of assessments) {
        if (!assessment.questions || assessment.questions.length === 0) continue;

        const quizData = {
          title: assessment.title,
          description: assessment.description || assessment.title,
          subject: assessment.subject,
          chapter: "Chapter 1",
          grade: grades[Math.floor(Math.random() * grades.length)],
          questions: assessment.questions.map((q, idx) => {
            const correctAnswerText = q.options[q.correctAnswer];
            return {
              question: q.question,
              type: "multiple-choice",
              options: q.options.map((opt) => ({
                text: opt,
                isCorrect: opt === correctAnswerText,
              })),
              correctAnswer: correctAnswerText,
              explanation: q.explanation || `The correct answer is: ${correctAnswerText}`,
              points: 1,
            };
          }),
          timeLimit: assessment.timeLimit || 30,
          difficulty: difficultyMap[assessment.difficulty] || "Medium",
          createdBy: adminId,
        };

        try {
          await Quiz.create(quizData);
          totalQuizzes++;
        } catch (error) {
          console.error(`Error seeding quiz "${assessment.title}":`, error.message.substring(0, 100));
        }
      }
    }

    console.log(`✓ Successfully seeded ${totalQuizzes} quizzes`);
  } catch (error) {
    console.error("✗ Error in seedQuizzes:", error.message);
  }
};

// Seed Flashcards
const seedFlashcards = async (adminId) => {
  try {
    console.log("\n📇 Seeding Flashcards...");
    
    const notesFiles = [
      "demo-notes.json",
      "mathematics-notes.json",
      "science-notes.json",
      "english-notes.json",
      "social-science-notes.json",
      "word-notes.json",
    ];

    let totalFlashcards = 0;
    const subjectMap = {
      "Science": "science",
      "science": "science",
      "Mathematics": "mathematics",
      "mathematics": "mathematics",
      "English": "english",
      "english": "english",
      "Social Science": "social-science",
      "social-science": "social-science",
      "Social Studies": "social-science",
      "Social": "social-science",
      "default": "english"
    };

    for (const file of notesFiles) {
      const notes = loadJSON(file);
      
      for (const note of notes) {
        if (!note.title || !note.content) continue;

        const mappedSubject = subjectMap[note.subject] || subjectMap["default"];
        
        const flashcardData = {
          question: note.title.substring(0, 500),
          answer: note.content.substring(0, 1000),
          subject: mappedSubject,
          chapter: note.chapter || "General",
          difficulty: "Medium",
          createdBy: adminId,
          tags: (note.tags || []).map(t => typeof t === 'string' ? t.toLowerCase() : 'general'),
        };

        try {
          await Flashcard.create(flashcardData);
          totalFlashcards++;
        } catch (error) {
          console.error(`Error seeding flashcard "${note.title}":`, error.message.substring(0, 100));
        }
      }
    }

    console.log(`✓ Successfully seeded ${totalFlashcards} flashcards`);
  } catch (error) {
    console.error("✗ Error in seedFlashcards:", error.message);
  }
};

// Seed Study Materials
const seedMaterials = async (adminId) => {
  try {
    console.log("\n📖 Seeding Study Materials...");
    
    const notesFiles = [
      "demo-notes.json",
      "mathematics-notes.json",
      "science-notes.json",
      "english-notes.json",
      "social-science-notes.json",
      "word-notes.json",
    ];

    let totalMaterials = 0;

    for (const file of notesFiles) {
      const notes = loadJSON(file);
      
      for (const note of notes) {
        const materialData = {
          title: note.title,
          description: note.content,
          content: note.fullContent || note.content,
          subject: note.subject || "General",
          category: note.subject || "General",
          type: "notes",
          chapter: "Chapter 1",
          grade: "6th",
          fileUrl: `/uploads/materials/${note.id}.txt`,
          uploadedBy: adminId,
          resourceType: "text",
        };

        try {
          await Material.create(materialData);
          totalMaterials++;
        } catch (error) {
          // Skip silently
        }
      }
    }

    console.log(`✓ Successfully seeded ${totalMaterials} study materials`);
  } catch (error) {
    console.error("✗ Error in seedMaterials:", error.message);
  }
};

// Clear existing data
const clearData = async () => {
  try {
    console.log("\n🗑️  Clearing existing data...");
    await Quiz.deleteMany({});
    await Flashcard.deleteMany({});
    await Material.deleteMany({});
    console.log("✓ Cleared existing data");
  } catch (error) {
    console.error("✗ Error clearing data:", error.message);
  }
};

// Main seed function
const seedAll = async () => {
  try {
    console.log("╔════════════════════════════════════════╗");
    console.log("║     SEEDING ALL DEMO DATA TO DB       ║");
    console.log("╚════════════════════════════════════════╝");

    await connectDB();
    await clearData();
    
    const adminId = await getAdminUser();
    
    await seedQuizzes(adminId);
    await seedFlashcards(adminId);
    await seedMaterials(adminId);

    console.log("\n╔════════════════════════════════════════╗");
    console.log("║   ✅ ALL DATA SEEDED SUCCESSFULLY!    ║");
    console.log("╚════════════════════════════════════════╝\n");
  } catch (error) {
    console.error("✗ Fatal error:", error.message);
  } finally {
    await disconnectDB();
  }
};

// Run the seed function
seedAll();

