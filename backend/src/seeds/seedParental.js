import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";
import ParentalControl from "../models/ParentalControl.js";

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/learnkins";

async function seedParentalData() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB connected successfully");

    // Clear existing data
    console.log("Clearing existing users and controls...");
    await User.deleteMany({});
    await ParentalControl.deleteMany({});
    console.log("✓ Cleared existing data");

    // Create a parent user
    const parent = new User({
      name: "John Parent",
      email: "parent@learnkins.com",
      password: "password123",
      role: "parent",
      avatar: "👨‍💼",
      grade: null, // Parents don't have a grade
    });

    await parent.save();
    console.log("✓ Parent user created:", parent._id);

    // Create child users
    const child1 = new User({
      name: "Sarah Student",
      email: "sarah@learnkins.com",
      password: "password123",
      role: "student",
      avatar: "👧",
      grade: "6th",
      parentId: parent._id,
    });

    await child1.save();
    console.log("✓ Child 1 created:", child1._id);

    const child2 = new User({
      name: "Alex Scholar",
      email: "alex@learnkins.com",
      password: "password123",
      role: "student",
      avatar: "👦",
      grade: "7th",
      parentId: parent._id,
    });

    await child2.save();
    console.log("✓ Child 2 created:", child2._id);

    // Create parental controls for children
    const control1 = new ParentalControl({
      parentId: parent._id,
      childId: child1._id,
      timeLimit: 120,
      contentFilters: ["violence", "adult"],
      allowNotifications: true,
    });

    await control1.save();
    console.log("✓ Parental control 1 created");

    const control2 = new ParentalControl({
      parentId: parent._id,
      childId: child2._id,
      timeLimit: 150,
      contentFilters: ["violence"],
      allowNotifications: true,
    });

    await control2.save();
    console.log("✓ Parental control 2 created");

    console.log("\n✅ Seed data created successfully!");
    console.log("\nTest credentials:");
    console.log("Parent - Email: parent@learnkins.com, Password: password123");
    console.log("Child 1 - Email: sarah@learnkins.com, Password: password123");
    console.log("Child 2 - Email: alex@learnkins.com, Password: password123");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding data:", error.message);
    process.exit(1);
  }
}

seedParentalData();
