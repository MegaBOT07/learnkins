import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";
import Subject from "../models/Subject.js";
import Material from "../models/Material.js";
import Quiz from "../models/Quiz.js";
import Game from "../models/Game.js";
import Progress from "../models/Progress.js";
import Community from "../models/Community.js";
import StudyGroup from "../models/StudyGroup.js";
import Achievement from "../models/Achievement.js";
import ParentalControl from "../models/ParentalControl.js";
import Flashcard from "../models/Flashcard.js";

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://mohitlalwani1907:aoLuqoa2jczEBnoj@cluster0.tzkp3vg.mongodb.net/learnkins";

// Sample subjects for 6th-8th grade
const gradeSubjects = [
  {
    name: "Mathematics - 6th Grade",
    slug: "mathematics-6th",
    description:
      "Master mathematical concepts from basic arithmetic to algebra and geometry.",
    icon: "🧮",
    color: "#3B82F6",
    grade: "6th",
    materials: [
      {
        title: "Basic Arithmetic",
        content:
          "Learn addition, subtraction, multiplication, and division with whole numbers and decimals.",
        type: "video",
        duration: 30,
      },
      {
        title: "Fractions and Decimals",
        content: "Understanding fractions, decimals, and their relationships.",
        type: "notes",
        duration: 25,
      },
      {
        title: "Introduction to Algebra",
        content: "Basic algebraic concepts and solving simple equations.",
        type: "worksheet",
        duration: 40,
      },
    ],
  },
  {
    name: "Mathematics - 7th Grade",
    slug: "mathematics-7th",
    description: "Explore algebra, geometry, and data analysis concepts.",
    icon: "🧮",
    color: "#3B82F6",
    grade: "7th",
    materials: [
      {
        title: "Algebra Fundamentals",
        content: "Solving linear equations and understanding variables.",
        type: "video",
        duration: 35,
      },
      {
        title: "Basic Geometry",
        content: "Understanding angles, triangles, and basic geometric shapes.",
        type: "notes",
        duration: 30,
      },
      {
        title: "Data Analysis",
        content: "Working with graphs, charts, and basic statistics.",
        type: "worksheet",
        duration: 45,
      },
    ],
  },
  {
    name: "Mathematics - 8th Grade",
    slug: "mathematics-8th",
    description: "Advanced algebra, geometry, and problem-solving techniques.",
    icon: "🧮",
    color: "#3B82F6",
    grade: "8th",
    materials: [
      {
        title: "Linear Equations",
        content: "Solving systems of linear equations and inequalities.",
        type: "video",
        duration: 40,
      },
      {
        title: "Pythagorean Theorem",
        content: "Understanding and applying the Pythagorean theorem.",
        type: "notes",
        duration: 35,
      },
      {
        title: "Probability and Statistics",
        content: "Basic probability concepts and statistical analysis.",
        type: "worksheet",
        duration: 50,
      },
    ],
  },
  {
    name: "Science",
    slug: "science",
    description:
      "Explore the natural world through experiments and observations.",
    icon: "🔬",
    color: "#10B981",
    grade: "6th",
    materials: [
      {
        title: "Earth Science",
        content: "Understanding Earth's structure, weather, and climate.",
        type: "video",
        duration: 30,
      },
      {
        title: "Basic Chemistry",
        content: "Introduction to atoms, molecules, and chemical reactions.",
        type: "notes",
        duration: 25,
      },
      {
        title: "Simple Machines",
        content: "Learning about levers, pulleys, and mechanical advantage.",
        type: "worksheet",
        duration: 35,
      },
    ],
  },
  {
    name: "Science",
    slug: "science",
    description: "Life science, physical science, and scientific method.",
    icon: "🔬",
    color: "#10B981",
    grade: "7th",
    materials: [
      {
        title: "Cell Biology",
        content: "Understanding cell structure and function.",
        type: "video",
        duration: 35,
      },
      {
        title: "Energy and Motion",
        content: "Basic physics concepts including energy and motion.",
        type: "notes",
        duration: 30,
      },
      {
        title: "Ecosystems",
        content: "Understanding food chains, food webs, and ecosystems.",
        type: "worksheet",
        duration: 40,
      },
    ],
  },
  {
    name: "Science",
    slug: "science",
    description: "Advanced concepts in physics, chemistry, and biology.",
    icon: "🔬",
    color: "#10B981",
    grade: "8th",
    materials: [
      {
        title: "Forces and Motion",
        content: "Newton's laws of motion and their applications.",
        type: "video",
        duration: 40,
      },
      {
        title: "Chemical Reactions",
        content: "Understanding chemical equations and reaction types.",
        type: "notes",
        duration: 35,
      },
      {
        title: "Genetics Basics",
        content: "Introduction to heredity and genetic traits.",
        type: "worksheet",
        duration: 45,
      },
    ],
  },
  {
    name: "English",
    slug: "english",
    description: "Develop reading, writing, and communication skills.",
    icon: "📚",
    color: "#F59E0B",
    grade: "6th",
    materials: [
      {
        title: "Reading Comprehension",
        content: "Strategies for understanding and analyzing texts.",
        type: "video",
        duration: 25,
      },
      {
        title: "Grammar Basics",
        content: "Parts of speech, sentence structure, and punctuation.",
        type: "notes",
        duration: 30,
      },
      {
        title: "Creative Writing",
        content: "Writing stories, poems, and personal narratives.",
        type: "worksheet",
        duration: 35,
      },
    ],
  },
  {
    name: "English",
    slug: "english",
    description: "Literature analysis and advanced writing skills.",
    icon: "📚",
    color: "#F59E0B",
    grade: "7th",
    materials: [
      {
        title: "Literature Analysis",
        content: "Analyzing themes, characters, and plot development.",
        type: "video",
        duration: 30,
      },
      {
        title: "Essay Writing",
        content: "Writing informative and argumentative essays.",
        type: "notes",
        duration: 35,
      },
      {
        title: "Vocabulary Building",
        content: "Expanding vocabulary through context and word roots.",
        type: "worksheet",
        duration: 25,
      },
    ],
  },
  {
    name: "English",
    slug: "english",
    description: "Advanced literature, writing, and critical thinking.",
    icon: "📚",
    color: "#F59E0B",
    grade: "8th",
    materials: [
      {
        title: "Literary Devices",
        content:
          "Understanding metaphors, similes, and other literary techniques.",
        type: "video",
        duration: 35,
      },
      {
        title: "Research Writing",
        content: "Conducting research and writing research papers.",
        type: "notes",
        duration: 40,
      },
      {
        title: "Debate and Persuasion",
        content: "Developing persuasive arguments and debate skills.",
        type: "worksheet",
        duration: 45,
      },
    ],
  },
  {
    name: "Social Science",
    slug: "social-science",
    description: "Understanding history, geography, and civics.",
    icon: "🌍",
    color: "#8B5CF6",
    grade: "6th",
    materials: [
      {
        title: "Ancient Civilizations",
        content: "Exploring ancient Egypt, Greece, and Rome.",
        type: "video",
        duration: 30,
      },
      {
        title: "World Geography",
        content: "Learning about continents, countries, and cultures.",
        type: "notes",
        duration: 25,
      },
      {
        title: "Government Basics",
        content: "Understanding different types of government systems.",
        type: "worksheet",
        duration: 30,
      },
    ],
  },
  {
    name: "Social Science",
    slug: "social-science",
    description: "World history and cultural studies.",
    icon: "🌍",
    color: "#8B5CF6",
    grade: "7th",
    materials: [
      {
        title: "Medieval History",
        content: "Exploring the Middle Ages and feudal systems.",
        type: "video",
        duration: 35,
      },
      {
        title: "Economic Systems",
        content: "Understanding basic economic concepts and systems.",
        type: "notes",
        duration: 30,
      },
      {
        title: "Cultural Studies",
        content: "Learning about different cultures and traditions.",
        type: "worksheet",
        duration: 35,
      },
    ],
  },
  {
    name: "Social Science",
    slug: "social-science",
    description: "Modern history and contemporary issues.",
    icon: "🌍",
    color: "#8B5CF6",
    grade: "8th",
    materials: [
      {
        title: "American History",
        content: "Key events in American history and their impact.",
        type: "video",
        duration: 40,
      },
      {
        title: "World War II",
        content: "Understanding the causes and effects of World War II.",
        type: "notes",
        duration: 35,
      },
      {
        title: "Civil Rights Movement",
        content: "The struggle for civil rights and social justice.",
        type: "worksheet",
        duration: 40,
      },
    ],
  },
];

// Sample quizzes for 6th-8th grade
const gradeQuizzes = [
  // 6th Grade Quizzes
  {
    title: "6th Grade Math Basics",
    subjectId: "mathematics",
    grade: "6th",
    questions: [
      {
        question: "What is 15 + 27?",
        options: ["40", "42", "43", "41"],
        correctAnswer: 1,
        explanation: "15 + 27 = 42",
      },
      {
        question: "What is 3/4 as a decimal?",
        options: ["0.25", "0.5", "0.75", "0.8"],
        correctAnswer: 2,
        explanation: "3/4 = 0.75",
      },
      {
        question: "What is the value of x in 2x = 10?",
        options: ["3", "4", "5", "6"],
        correctAnswer: 2,
        explanation: "2x = 10, divide both sides by 2: x = 5",
      },
    ],
    timeLimit: 8,
  },
  {
    title: "6th Grade Science Quiz",
    subjectId: "science",
    grade: "6th",
    questions: [
      {
        question: "What is the hardest natural substance on Earth?",
        options: ["Iron", "Diamond", "Gold", "Platinum"],
        correctAnswer: 1,
        explanation: "Diamond is the hardest natural substance on Earth",
      },
      {
        question: "What is the main gas that plants need for photosynthesis?",
        options: ["Oxygen", "Carbon dioxide", "Nitrogen", "Hydrogen"],
        correctAnswer: 1,
        explanation: "Plants use carbon dioxide for photosynthesis",
      },
      {
        question: "What is the largest planet in our solar system?",
        options: ["Earth", "Mars", "Jupiter", "Saturn"],
        correctAnswer: 2,
        explanation: "Jupiter is the largest planet in our solar system",
      },
    ],
    timeLimit: 6,
  },
  // 7th Grade Quizzes
  {
    title: "7th Grade Algebra Quiz",
    subjectId: "mathematics",
    grade: "7th",
    questions: [
      {
        question: "Solve for x: 3x + 5 = 20",
        options: ["3", "4", "5", "6"],
        correctAnswer: 2,
        explanation: "3x + 5 = 20, subtract 5: 3x = 15, divide by 3: x = 5",
      },
      {
        question: "What is the area of a rectangle with length 8 and width 6?",
        options: ["14", "28", "48", "56"],
        correctAnswer: 2,
        explanation: "Area = length × width = 8 × 6 = 48",
      },
      {
        question: "What is 25% of 80?",
        options: ["15", "20", "25", "30"],
        correctAnswer: 1,
        explanation: "25% = 0.25, so 0.25 × 80 = 20",
      },
    ],
    timeLimit: 10,
  },
  {
    title: "7th Grade Biology Quiz",
    subjectId: "science",
    grade: "7th",
    questions: [
      {
        question: "What is the powerhouse of the cell?",
        options: ["Nucleus", "Mitochondria", "Cell membrane", "Cytoplasm"],
        correctAnswer: 1,
        explanation: "Mitochondria is called the powerhouse of the cell",
      },
      {
        question: "What process do plants use to make their own food?",
        options: ["Respiration", "Photosynthesis", "Digestion", "Circulation"],
        correctAnswer: 1,
        explanation: "Plants use photosynthesis to make their own food",
      },
      {
        question: "What is the basic unit of life?",
        options: ["Atom", "Cell", "Tissue", "Organ"],
        correctAnswer: 1,
        explanation: "The cell is the basic unit of life",
      },
    ],
    timeLimit: 7,
  },
  // 8th Grade Quizzes
  {
    title: "8th Grade Algebra Quiz",
    subjectId: "mathematics",
    grade: "8th",
    questions: [
      {
        question: "Solve the system: x + y = 5, x - y = 1",
        options: ["x=3, y=2", "x=2, y=3", "x=4, y=1", "x=1, y=4"],
        correctAnswer: 0,
        explanation: "Adding the equations: 2x = 6, so x = 3. Then y = 2",
      },
      {
        question: "What is the slope of the line y = 2x + 3?",
        options: ["2", "3", "5", "1"],
        correctAnswer: 0,
        explanation: "In y = mx + b, m is the slope, so slope = 2",
      },
      {
        question: "What is the Pythagorean theorem?",
        options: ["a² + b² = c²", "a + b = c", "a² - b² = c²", "a × b = c"],
        correctAnswer: 0,
        explanation: "The Pythagorean theorem is a² + b² = c²",
      },
    ],
    timeLimit: 12,
  },
  {
    title: "8th Grade Physics Quiz",
    subjectId: "science",
    grade: "8th",
    questions: [
      {
        question: "What is Newton's First Law also known as?",
        options: [
          "Law of Motion",
          "Law of Inertia",
          "Law of Action-Reaction",
          "Law of Acceleration",
        ],
        correctAnswer: 1,
        explanation: "Newton's First Law is also called the Law of Inertia",
      },
      {
        question: "What is the SI unit of force?",
        options: ["Joule", "Newton", "Watt", "Pascal"],
        correctAnswer: 1,
        explanation: "The SI unit of force is the Newton (N)",
      },
      {
        question: "What is the formula for kinetic energy?",
        options: ["KE = mgh", "KE = ½mv²", "KE = mv", "KE = ½mv"],
        correctAnswer: 1,
        explanation: "Kinetic energy is calculated using KE = ½mv²",
      },
    ],
    timeLimit: 10,
  },
];

// Sample games for 6th-8th grade
const gradeGames = [
  {
    name: "Math Adventure Quest",
    description:
      "Solve mathematical puzzles to advance through levels and unlock new challenges.",
    type: "puzzle",
    difficulty: "medium",
    subject: "mathematics",
    grade: "6th",
  },
  {
    name: "Science Lab Explorer",
    description:
      "Conduct virtual experiments and learn scientific principles through interactive simulations.",
    type: "simulation",
    difficulty: "easy",
    subject: "science",
    grade: "6th",
  },
  {
    name: "Word Wizard Challenge",
    description:
      "Build vocabulary and improve language skills through word games and challenges.",
    type: "word",
    difficulty: "medium",
    subject: "english",
    grade: "7th",
  },
  {
    name: "History Time Traveler",
    description:
      "Travel through time and learn about historical events through interactive storytelling.",
    type: "adventure",
    difficulty: "easy",
    subject: "social-science",
    grade: "7th",
  },
  {
    name: "Algebra Puzzle Master",
    description: "Solve complex algebraic equations and mathematical problems.",
    type: "puzzle",
    difficulty: "hard",
    subject: "mathematics",
    grade: "8th",
  },
  {
    name: "Physics Simulator",
    description:
      "Explore physics concepts through interactive simulations and experiments.",
    type: "simulation",
    difficulty: "medium",
    subject: "science",
    grade: "8th",
  },
];

// Sample flashcards for 6th-8th grade
const gradeFlashcards = [
  // 6th Grade
  {
    question: "What is the formula for the area of a rectangle?",
    answer: "A = length × width",
    subjectId: "mathematics",
    grade: "6th",
    difficulty: "easy",
  },
  {
    question: "What is the capital of France?",
    answer: "Paris",
    subjectId: "social-science",
    grade: "6th",
    difficulty: "easy",
  },
  {
    question: "What is the chemical symbol for oxygen?",
    answer: "O",
    subjectId: "science",
    grade: "6th",
    difficulty: "easy",
  },
  {
    question: 'What is a synonym for "happy"?',
    answer: "Joyful, cheerful, delighted, pleased",
    subjectId: "english",
    grade: "6th",
    difficulty: "easy",
  },
  // 7th Grade
  {
    question: "What is the formula for the area of a circle?",
    answer: "A = πr²",
    subjectId: "mathematics",
    grade: "7th",
    difficulty: "medium",
  },
  {
    question: "What is the largest planet in our solar system?",
    answer: "Jupiter",
    subjectId: "science",
    grade: "7th",
    difficulty: "easy",
  },
  {
    question: 'Who wrote "Romeo and Juliet"?',
    answer: "William Shakespeare",
    subjectId: "english",
    grade: "7th",
    difficulty: "medium",
  },
  {
    question: "What year did World War II end?",
    answer: "1945",
    subjectId: "social-science",
    grade: "7th",
    difficulty: "medium",
  },
  // 8th Grade
  {
    question: "What is the square root of 144?",
    answer: "12",
    subjectId: "mathematics",
    grade: "8th",
    difficulty: "medium",
  },
  {
    question: "What is Newton's First Law?",
    answer:
      "An object at rest stays at rest unless acted upon by an external force",
    subjectId: "science",
    grade: "8th",
    difficulty: "medium",
  },
  {
    question: "What is a metaphor?",
    answer:
      'A figure of speech that compares two things without using "like" or "as"',
    subjectId: "english",
    grade: "8th",
    difficulty: "medium",
  },
  {
    question: "Who was the first President of the United States?",
    answer: "George Washington",
    subjectId: "social-science",
    grade: "8th",
    difficulty: "easy",
  },
];

// Sample achievements for 6th-8th grade
const gradeAchievements = [
  {
    name: "First Steps",
    description: "Complete your first lesson",
    icon: "🎯",
    rarity: "Common",
    points: 10,
    criteria: "Complete any lesson",
    category: "study",
  },
  {
    name: "Quiz Master",
    description: "Score 100% on 5 quizzes",
    icon: "🏆",
    rarity: "Uncommon",
    points: 50,
    criteria: "Get perfect scores on 5 quizzes",
    category: "quiz",
  },
  {
    name: "Study Streak",
    description: "Study for 7 consecutive days",
    icon: "🔥",
    rarity: "Rare",
    points: 100,
    criteria: "Study every day for a week",
    category: "streak",
  },
  {
    name: "Math Genius",
    description: "Complete 50 math problems",
    icon: "🧮",
    rarity: "Uncommon",
    points: 75,
    criteria: "Solve 50 math problems correctly",
    category: "study",
  },
  {
    name: "Science Explorer",
    description: "Complete 20 science experiments",
    icon: "🔬",
    rarity: "Rare",
    points: 150,
    criteria: "Complete 20 virtual science experiments",
    category: "study",
  },
  {
    name: "Bookworm",
    description: "Read 25 articles or chapters",
    icon: "📚",
    rarity: "Common",
    points: 30,
    criteria: "Read 25 educational articles or book chapters",
    category: "study",
  },
  {
    name: "Perfect Score",
    description: "Get 100% on a difficult quiz",
    icon: "💯",
    rarity: "Epic",
    points: 250,
    criteria: "Score 100% on a quiz with 10+ questions",
    category: "quiz",
  },
  {
    name: "Flashcard Master",
    description: "Review 100 flashcards",
    icon: "🗂️",
    rarity: "Common",
    points: 25,
    criteria: "Review 100 flashcards across all subjects",
    category: "study",
  },
  {
    name: "Time Management",
    description: "Study for 5 hours in a week",
    icon: "⏰",
    rarity: "Uncommon",
    points: 60,
    criteria: "Accumulate 5 hours of study time in one week",
    category: "study",
  },
  {
    name: "Community Helper",
    description: "Help 10 other students",
    icon: "🤝",
    rarity: "Epic",
    points: 200,
    criteria: "Receive 10 likes on your posts",
    category: "community",
  },
  {
    name: "Game Champion",
    description: "Win 10 educational games",
    icon: "🎮",
    rarity: "Legendary",
    points: 500,
    criteria: "Win 10 different educational games",
    category: "game",
  },
  {
    name: "Study Group Leader",
    description: "Create and manage a study group",
    icon: "👥",
    rarity: "Rare",
    points: 125,
    criteria: "Create a study group with 5+ members",
    category: "community",
  },
];

// Sample community discussions for 6th-8th grade
const gradeDiscussions = [
  {
    title: "Best study techniques for math?",
    content:
      "I'm struggling with algebra. What are some effective study techniques that have worked for you? I've tried flashcards but looking for more interactive methods.",
    category: "mathematics",
    tags: ["study-tips", "algebra", "help"],
  },
  {
    title: "Science project ideas for 6th grade",
    content:
      "Looking for creative science project ideas that are both educational and fun. Any suggestions for experiments that can be done at home?",
    category: "science",
    tags: ["projects", "experiments", "6th-grade"],
  },
  {
    title: "How to improve reading comprehension",
    content:
      "I love reading but sometimes struggle with understanding complex texts. What strategies do you use to improve comprehension?",
    category: "english",
    tags: ["reading", "comprehension", "tips"],
  },
  {
    title: "Study group for history",
    content:
      "Anyone interested in forming a study group for social studies? We can discuss historical events and help each other prepare for tests.",
    category: "social-science",
    tags: ["study-group", "history", "collaboration"],
  },
  {
    title: "Tips for memorizing math formulas",
    content:
      "I find it really hard to remember all the math formulas. Does anyone have any memory techniques that work well?",
    category: "mathematics",
    tags: ["memory", "math", "study-tips"],
  },
  {
    title: "Science fair project ideas",
    content:
      "I need ideas for my science fair project. What are some interesting experiments that are appropriate for middle school?",
    category: "science",
    tags: ["science-fair", "projects", "experiments"],
  },
  {
    title: "Creative writing prompts",
    content:
      "I need some inspiration for my creative writing assignment. What are some interesting prompts that have worked well for you?",
    category: "english",
    tags: ["creative-writing", "prompts", "inspiration"],
  },
  {
    title: "Study schedule for finals",
    content:
      "Finals are coming up and I need to organize my study schedule. How do you balance studying for multiple subjects?",
    category: "general",
    tags: ["finals", "study-schedule", "organization"],
  },
];

// Sample study groups for 6th-8th grade
const gradeStudyGroups = [
  {
    name: "Math Wizards",
    description:
      "A group for students who love mathematics and want to help each other solve problems.",
    subject: "mathematics",
    maxMembers: 15,
    rules: [
      "Be respectful to all members",
      "Share your problem-solving approaches",
      "Help others when you can",
    ],
    tags: ["algebra", "geometry", "problem-solving"],
  },
  {
    name: "Science Explorers",
    description:
      "Join us to explore the wonders of science through experiments and discussions.",
    subject: "science",
    maxMembers: 20,
    rules: [
      "Follow safety guidelines",
      "Share interesting discoveries",
      "Ask questions freely",
    ],
    tags: ["chemistry", "physics", "biology", "experiments"],
  },
  {
    name: "English Literature Club",
    description:
      "Discuss books, improve writing skills, and share creative stories.",
    subject: "english",
    maxMembers: 12,
    rules: [
      "Respect different opinions",
      "Share your favorite books",
      "Practice creative writing",
    ],
    tags: ["literature", "writing", "poetry"],
  },
  {
    name: "History Buffs",
    description:
      "Learn about historical events and their impact on the modern world.",
    subject: "social-science",
    maxMembers: 18,
    rules: [
      "Respect different cultures",
      "Share historical insights",
      "Fact-check information",
    ],
    tags: ["ancient-civ", "world-war", "modern-history"],
  },
];

// Sample users for 6th-8th grade
const gradeUsers = [
  {
    name: "John Parent",
    email: "parent@example.com",
    password: "password123",
    role: "parent",
    grade: null,
    parentId: null,
  },
  {
    name: "Alex Johnson",
    email: "alex@example.com",
    password: "password123",
    role: "student",
    grade: "6th",
    parentId: null,
  },
  {
    name: "Emma Student",
    email: "emma@example.com",
    password: "password123",
    role: "student",
    grade: "7th",
    parentId: null,
  },
  {
    name: "Mike Wilson",
    email: "mike@example.com",
    password: "password123",
    role: "student",
    grade: "8th",
    parentId: null,
  },
  {
    name: "Sarah Teacher",
    email: "teacher@example.com",
    password: "password123",
    role: "teacher",
    grade: null,
    parentId: null,
  },
];

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB connected for seeding");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    console.log("Starting data seeding for 6th-8th grade...");

    // Clear existing data
    await User.deleteMany({});
    await Subject.deleteMany({});
    await Material.deleteMany({});
    await Quiz.deleteMany({});
    await Game.deleteMany({});
    await Progress.deleteMany({});
    await Community.deleteMany({});
    await StudyGroup.deleteMany({});
    await Achievement.deleteMany({});
    await ParentalControl.deleteMany({});
    await Flashcard.deleteMany({});

    console.log("Cleared existing data");

    // Create achievements
    const createdAchievements = await Achievement.insertMany(gradeAchievements);
    console.log(`Created ${createdAchievements.length} achievements`);

    // Create parent first
    const parentData = gradeUsers.find((user) => user.role === "parent");
    const parent = await User.create(parentData);
    console.log("Created parent user");

    // Create students with parent reference
    const studentData = gradeUsers.filter((user) => user.role === "student");
    const students = [];
    for (const student of studentData) {
      const createdStudent = await User.create({
        ...student,
        parentId: parent._id,
      });
      students.push(createdStudent);
    }
    console.log(`Created ${students.length} students`);

    // Create teacher
    const teacherData = gradeUsers.find((user) => user.role === "teacher");
    const teacher = await User.create(teacherData);
    console.log("Created teacher user");

    const createdUsers = [parent, ...students, teacher];

    console.log("Set up parent-child relationships");

    // Create subjects and materials for each grade
    const createdSubjects = [];
    for (const subjectData of gradeSubjects) {
      const subject = await Subject.create({
        name: subjectData.name,
        slug: subjectData.slug,
        description: subjectData.description,
        icon: subjectData.icon,
        color: subjectData.color,
        grade: subjectData.grade,
      });
      createdSubjects.push(subject);

      // Create materials for each subject
      for (const materialData of subjectData.materials) {
        await Material.create({
          title: materialData.title,
          description: materialData.content,
          subject: subjectData.slug,
          chapter: "Introduction",
          grade: subjectData.grade,
          fileUrl:
            "https://example.com/materials/" +
            materialData.title.toLowerCase().replace(/\s+/g, "-"),
          type: materialData.type,
          duration: materialData.duration.toString(),
          uploadedBy: teacher._id,
        });
      }
    }
    console.log(`Created ${createdSubjects.length} subjects with materials`);

    // Create quizzes
    const createdQuizzes = [];
    for (const quizData of gradeQuizzes) {
      const quiz = await Quiz.create({
        title: quizData.title,
        subjectId: quizData.subjectId,
        questions: quizData.questions,
        timeLimit: quizData.timeLimit,
      });
      createdQuizzes.push(quiz);
    }
    console.log(`Created ${createdQuizzes.length} quizzes`);

    // Create games
    const createdGames = [];
    for (const gameData of gradeGames) {
      const game = await Game.create({
        name: gameData.name,
        description: gameData.description,
        type: gameData.type,
        difficulty: gameData.difficulty,
        subject: gameData.subject,
      });
      createdGames.push(game);
    }
    console.log(`Created ${createdGames.length} games`);

    // Create flashcards
    const createdFlashcards = [];
    for (const flashcardData of gradeFlashcards) {
      const flashcard = await Flashcard.create({
        question: flashcardData.question,
        answer: flashcardData.answer,
        subjectId: flashcardData.subjectId,
        difficulty: flashcardData.difficulty,
      });
      createdFlashcards.push(flashcard);
    }
    console.log(`Created ${createdFlashcards.length} flashcards`);

    // Create community discussions
    const discussionPromises = gradeDiscussions.map(
      async (discussion, index) => {
        const author = students[index % students.length];
        return Community.create({
          ...discussion,
          author: author._id,
          likes: Math.floor(Math.random() * 10),
          replies: Math.floor(Math.random() * 5),
          views: Math.floor(Math.random() * 50),
        });
      }
    );

    const createdDiscussions = await Promise.all(discussionPromises);
    console.log(`Created ${createdDiscussions.length} discussions`);

    // Create study groups
    const groupPromises = gradeStudyGroups.map(async (group, index) => {
      const creator = students[index % students.length];
      return StudyGroup.create({
        ...group,
        creator: creator._id,
        members: [creator._id],
        memberCount: 1,
      });
    });

    const createdGroups = await Promise.all(groupPromises);
    console.log(`Created ${createdGroups.length} study groups`);

    // Create sample progress data
    const progressData = [];
    const subjectList = ["mathematics", "science", "english", "social-science"];
    const chapters = {
      mathematics: [
        "Algebra Basics",
        "Geometry",
        "Statistics",
        "Number Theory",
      ],
      science: ["Physics", "Chemistry", "Biology", "Environmental Science"],
      english: ["Grammar", "Literature", "Creative Writing", "Comprehension"],
      "social-science": [
        "Ancient History",
        "Modern History",
        "Geography",
        "Civics",
      ],
    };

    for (const student of students) {
      for (const subject of subjectList) {
        const subjectChapters = chapters[subject];
        for (const chapter of subjectChapters) {
          progressData.push({
            userId: student._id,
            subject: subject,
            chapter: chapter,
            progress: Math.floor(Math.random() * 100),
            timeSpent: Math.floor(Math.random() * 120) + 30,
            completedActivities: [
              {
                type: "video",
                activityId: new mongoose.Types.ObjectId(),
                score: Math.floor(Math.random() * 20) + 80,
              },
              {
                type: "quiz",
                activityId: new mongoose.Types.ObjectId(),
                score: Math.floor(Math.random() * 20) + 80,
              },
            ],
            streak: {
              current: Math.floor(Math.random() * 10) + 1,
              longest: Math.floor(Math.random() * 15) + 5,
              lastStudyDate: new Date(
                Date.now() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000
              ),
            },
          });
        }
      }
    }

    await Progress.insertMany(progressData);
    console.log(`Created ${progressData.length} progress records`);

    // Award some achievements to students
    for (const student of students) {
      const randomAchievements = createdAchievements.slice(
        0,
        Math.floor(Math.random() * 3) + 1
      );
      student.achievements = randomAchievements.map(
        (achievement) => achievement._id
      );
      student.points = randomAchievements.reduce(
        (sum, achievement) => sum + achievement.points,
        0
      );
      student.currentStreak = Math.floor(Math.random() * 10) + 1;
      student.totalStudyHours = Math.floor(Math.random() * 50) + 10;
      student.totalQuizzesTaken = Math.floor(Math.random() * 20) + 5;
      await student.save();
    }

    console.log("Awarded achievements to students");

    // Create parental controls for each student
    for (const student of students) {
      await ParentalControl.create({
        childId: student._id,
        parentId: parent._id,
        timeControls: {
          dailyLimit: 3,
          breakReminder: 30,
          bedtimeRestriction: "21:00",
          weekendBonus: 1,
        },
        contentFilters: {
          allowedSubjects: [
            "science",
            "mathematics",
            "social-science",
            "english",
          ],
          communityAccess: true,
          gamingTime: 1,
        },
        sessionLogs: [
          {
            date: new Date(Date.now() - 24 * 60 * 60 * 1000),
            duration: 120,
            subjects: ["mathematics", "science"],
            activities: ["quiz", "video-lesson"],
            score: 85,
          },
          {
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            duration: 90,
            subjects: ["english", "social-science"],
            activities: ["reading", "flashcards"],
            score: 92,
          },
        ],
      });
    }

    console.log("Created parental controls");

    console.log("✅ Data seeding completed successfully!");
    console.log("\n📋 Sample Login Credentials:");
    console.log("👨‍👩‍👧‍👦 Parent: parent@example.com / password123");
    console.log("👨‍🎓 6th Grade: alex@example.com / password123");
    console.log("👩‍🎓 7th Grade: emma@example.com / password123");
    console.log("👨‍🎓 8th Grade: mike@example.com / password123");
    console.log("👩‍🏫 Teacher: teacher@example.com / password123");
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB disconnected");
  }
};

// Run the seeding
connectDB().then(seedData);
