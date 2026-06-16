/**
 * Seed achievements for LearnKins platform
 * Categories: study (flashcards), quiz, game, streak, special
 */

import Achievement from '../models/Achievement.js';
import User from '../models/User.js';

const achievements = [
  // ===== STUDY (Flashcard Reading) Achievements =====
  {
    name: 'Card Reader I',
    description: 'Read your first 10 flashcards',
    icon: '📖',
    rarity: 'Common',
    points: 10,
    criteria: 'Read 10 flashcards',
    category: 'study',
    requirements: { quizzesTaken: 0, gamesPlayed: 0, streakDays: 0, perfectScores: 0, communityPosts: 0 },
    isActive: true,
  },
  {
    name: 'Card Reader II',
    description: 'Read 50 flashcards',
    icon: '📚',
    rarity: 'Uncommon',
    points: 25,
    criteria: 'Read 50 flashcards',
    category: 'study',
    requirements: { quizzesTaken: 0, gamesPlayed: 0, streakDays: 0, perfectScores: 0, communityPosts: 0 },
    isActive: true,
  },
  {
    name: 'Card Reader III',
    description: 'Read 100 flashcards',
    icon: '📕',
    rarity: 'Rare',
    points: 50,
    criteria: 'Read 100 flashcards',
    category: 'study',
    requirements: { quizzesTaken: 0, gamesPlayed: 0, streakDays: 0, perfectScores: 0, communityPosts: 0 },
    isActive: true,
  },
  {
    name: 'Card Master',
    description: 'Read 500 flashcards',
    icon: '🎓',
    rarity: 'Epic',
    points: 100,
    criteria: 'Read 500 flashcards',
    category: 'study',
    requirements: { quizzesTaken: 0, gamesPlayed: 0, streakDays: 0, perfectScores: 0, communityPosts: 0 },
    isActive: true,
  },

  // ===== QUIZ Achievements =====
  {
    name: 'Quiz Taker I',
    description: 'Complete your first 5 quizzes',
    icon: '✍️',
    rarity: 'Common',
    points: 15,
    criteria: 'Complete 5 quizzes',
    category: 'quiz',
    requirements: { quizzesTaken: 5, gamesPlayed: 0, streakDays: 0, perfectScores: 0, communityPosts: 0 },
    isActive: true,
  },
  {
    name: 'Quiz Taker II',
    description: 'Complete 20 quizzes',
    icon: '📝',
    rarity: 'Uncommon',
    points: 30,
    criteria: 'Complete 20 quizzes',
    category: 'quiz',
    requirements: { quizzesTaken: 20, gamesPlayed: 0, streakDays: 0, perfectScores: 0, communityPosts: 0 },
    isActive: true,
  },
  {
    name: 'Quiz Taker III',
    description: 'Complete 50 quizzes',
    icon: '📋',
    rarity: 'Rare',
    points: 60,
    criteria: 'Complete 50 quizzes',
    category: 'quiz',
    requirements: { quizzesTaken: 50, gamesPlayed: 0, streakDays: 0, perfectScores: 0, communityPosts: 0 },
    isActive: true,
  },
  {
    name: 'Perfect Score I',
    description: 'Get 3 perfect quiz scores',
    icon: '💯',
    rarity: 'Uncommon',
    points: 40,
    criteria: 'Achieve 3 perfect quiz scores',
    category: 'quiz',
    requirements: { quizzesTaken: 0, gamesPlayed: 0, streakDays: 0, perfectScores: 3, communityPosts: 0 },
    isActive: true,
  },
  {
    name: 'Perfect Score II',
    description: 'Get 10 perfect quiz scores',
    icon: '🏆',
    rarity: 'Rare',
    points: 80,
    criteria: 'Achieve 10 perfect quiz scores',
    category: 'quiz',
    requirements: { quizzesTaken: 0, gamesPlayed: 0, streakDays: 0, perfectScores: 10, communityPosts: 0 },
    isActive: true,
  },
  {
    name: 'Quiz Master',
    description: 'Complete 100 quizzes with 50 perfect scores',
    icon: '🎯',
    rarity: 'Legendary',
    points: 200,
    criteria: 'Complete 100 quizzes with 50 perfect scores',
    category: 'quiz',
    requirements: { quizzesTaken: 100, gamesPlayed: 0, streakDays: 0, perfectScores: 50, communityPosts: 0 },
    isActive: true,
  },

  // ===== GAME Achievements =====
  {
    name: 'Gamer I',
    description: 'Play your first 5 games',
    icon: '🎮',
    rarity: 'Common',
    points: 15,
    criteria: 'Play 5 games',
    category: 'game',
    requirements: { quizzesTaken: 0, gamesPlayed: 5, streakDays: 0, perfectScores: 0, communityPosts: 0 },
    isActive: true,
  },
  {
    name: 'Gamer II',
    description: 'Play 20 games',
    icon: '🕹️',
    rarity: 'Uncommon',
    points: 35,
    criteria: 'Play 20 games',
    category: 'game',
    requirements: { quizzesTaken: 0, gamesPlayed: 20, streakDays: 0, perfectScores: 0, communityPosts: 0 },
    isActive: true,
  },
  {
    name: 'Gamer III',
    description: 'Play 50 games',
    icon: '👾',
    rarity: 'Rare',
    points: 70,
    criteria: 'Play 50 games',
    category: 'game',
    requirements: { quizzesTaken: 0, gamesPlayed: 50, streakDays: 0, perfectScores: 0, communityPosts: 0 },
    isActive: true,
  },
  {
    name: 'Game Master',
    description: 'Play 100 games',
    icon: '🎲',
    rarity: 'Epic',
    points: 150,
    criteria: 'Play 100 games',
    category: 'game',
    requirements: { quizzesTaken: 0, gamesPlayed: 100, streakDays: 0, perfectScores: 0, communityPosts: 0 },
    isActive: true,
  },

  // ===== STREAK Achievements =====
  {
    name: 'Streak I',
    description: 'Maintain a 3-day study streak',
    icon: '🔥',
    rarity: 'Common',
    points: 20,
    criteria: '3-day study streak',
    category: 'streak',
    requirements: { quizzesTaken: 0, gamesPlayed: 0, streakDays: 3, perfectScores: 0, communityPosts: 0 },
    isActive: true,
  },
  {
    name: 'Streak II',
    description: 'Maintain a 7-day study streak',
    icon: '🌟',
    rarity: 'Uncommon',
    points: 50,
    criteria: '7-day study streak',
    category: 'streak',
    requirements: { quizzesTaken: 0, gamesPlayed: 0, streakDays: 7, perfectScores: 0, communityPosts: 0 },
    isActive: true,
  },
  {
    name: 'Streak III',
    description: 'Maintain a 14-day study streak',
    icon: '⚡',
    rarity: 'Rare',
    points: 100,
    criteria: '14-day study streak',
    category: 'streak',
    requirements: { quizzesTaken: 0, gamesPlayed: 0, streakDays: 14, perfectScores: 0, communityPosts: 0 },
    isActive: true,
  },
  {
    name: 'Streak Legend',
    description: 'Maintain a 30-day study streak',
    icon: '🌈',
    rarity: 'Legendary',
    points: 300,
    criteria: '30-day study streak',
    category: 'streak',
    requirements: { quizzesTaken: 0, gamesPlayed: 0, streakDays: 30, perfectScores: 0, communityPosts: 0 },
    isActive: true,
  },

  // ===== SPECIAL (Overall Progress) Achievements =====
  {
    name: 'Dedicated Learner',
    description: 'Study for 10 total hours',
    icon: '⏰',
    rarity: 'Uncommon',
    points: 40,
    criteria: '10 total study hours',
    category: 'special',
    requirements: { quizzesTaken: 0, gamesPlayed: 0, streakDays: 0, perfectScores: 0, communityPosts: 0 },
    isActive: true,
  },
  {
    name: 'Scholar',
    description: 'Study for 50 total hours',
    icon: '🎓',
    rarity: 'Rare',
    points: 100,
    criteria: '50 total study hours',
    category: 'special',
    requirements: { quizzesTaken: 0, gamesPlayed: 0, streakDays: 0, perfectScores: 0, communityPosts: 0 },
    isActive: true,
  },
  {
    name: 'Community Contributor',
    description: 'Make 10 community posts',
    icon: '💬',
    rarity: 'Uncommon',
    points: 30,
    criteria: '10 community posts',
    category: 'community',
    requirements: { quizzesTaken: 0, gamesPlayed: 0, streakDays: 0, perfectScores: 0, communityPosts: 10 },
    isActive: true,
  },
  {
    name: 'Level 5',
    description: 'Reach level 5',
    icon: '⭐',
    rarity: 'Uncommon',
    points: 50,
    criteria: 'Reach level 5',
    category: 'special',
    isActive: true,
  },
  {
    name: 'Level 10',
    description: 'Reach level 10',
    icon: '🌟',
    rarity: 'Rare',
    points: 100,
    criteria: 'Reach level 10',
    category: 'special',
    isActive: true,
  },
  {
    name: 'Level 20',
    description: 'Reach level 20',
    icon: '🏆',
    rarity: 'Legendary',
    points: 250,
    criteria: 'Reach level 20',
    category: 'special',
    isActive: true,
  },
];

export const seedAchievements = async () => {
  try {
    const count = await Achievement.countDocuments();
    if (count > 0) {
      console.log('ℹ️ Achievements already seeded, skipping...');
      return;
    }

    await Achievement.insertMany(achievements);
    console.log(`✅ Seeded ${achievements.length} achievements`);
  } catch (error) {
    console.error('❌ Achievement seed error:', error.message);
  }
};

// Allow running directly: node src/seeds/seedAchievements.js
if (process.argv.length > 1 && process.argv[1].endsWith('seedAchievements.js')) {
  import('mongoose').then(mongoose => {
    mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/learnkins').then(() => {
      seedAchievements().then(() => process.exit(0));
    });
  });
}

export default seedAchievements;
