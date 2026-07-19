/**
 * Automatic Achievement Checker
 * Checks and awards achievements based on user stats
 */

import Achievement from '../models/Achievement.js';
import User from '../models/User.js';

/**
 * Check all achievements for a user and award any newly unlocked ones
 * @param {string} userId - The user ID to check
 * @returns {Promise<Array>} - Array of newly awarded achievements
 */
export const checkAndAwardAchievements = async userId => {
  try {
    const user = await User.findById(userId);
    if (!user) return [];
    const stats = {
      quizzesTaken: user.totalQuizzesTaken || 0,
      gamesPlayed: user.totalGamesPlayed || 0,
      streakDays: user.currentStreak || 0,
      studyHours: user.totalStudyHours || 0,
      totalFlashcardsRead: user.totalFlashcardsRead || 0,
      communityPosts: user.communityPosts || 0,
      level: user.level || 1
    };
    const allAchievements = await Achievement.find({
      isActive: true
    });
    const userAchievements = user.achievements || [];
    const newAchievements = [];

    // Hoist perfect scores query — compute once, not inside the loop
    let perfectScoresCache = null;
    const getPerfectScores = async () => {
      if (perfectScoresCache === null) {
        perfectScoresCache = await getUserPerfectScores(userId);
      }
      return perfectScoresCache;
    };
    for (const achievement of allAchievements) {
      if (userAchievements.includes(achievement._id)) continue;
      let unlocked = false;
      switch (achievement.category) {
        case 'study':
          if (achievement.requirements?.studyHours > 0) {
            unlocked = stats.studyHours >= achievement.requirements.studyHours;
          }
          if (achievement.requirements?.totalFlashcardsRead > 0) {
            unlocked = unlocked || stats.totalFlashcardsRead >= achievement.requirements.totalFlashcardsRead;
          }
          break;
        case 'quiz':
          if (achievement.requirements?.quizzesTaken > 0) {
            unlocked = stats.quizzesTaken >= achievement.requirements.quizzesTaken;
          }
          if (achievement.requirements?.perfectScores > 0) {
            const perfectScores = await getPerfectScores();
            unlocked = unlocked || perfectScores >= achievement.requirements.perfectScores;
          }
          break;
        case 'game':
          if (achievement.requirements?.gamesPlayed > 0) {
            unlocked = stats.gamesPlayed >= achievement.requirements.gamesPlayed;
          }
          break;
        case 'streak':
          if (achievement.requirements?.streakDays > 0) {
            unlocked = stats.streakDays >= achievement.requirements.streakDays;
          }
          break;
        case 'special':
          if (achievement.requirements?.studyHours > 0) {
            unlocked = stats.studyHours >= achievement.requirements.studyHours;
          }
          if (achievement.name.includes('Level')) {
            const levelMatch = achievement.name.match(/Level (\d+)/);
            if (levelMatch) {
              const targetLevel = parseInt(levelMatch[1]);
              unlocked = unlocked || stats.level >= targetLevel;
            }
          }
          break;
        case 'community':
          if (achievement.requirements?.communityPosts > 0) {
            unlocked = stats.communityPosts >= achievement.requirements.communityPosts;
          }
          break;
      }
      if (unlocked) {
        user.achievements.push(achievement._id);
        user.points = (user.points || 0) + (achievement.points || 0);
        newAchievements.push(achievement);
      }
    }
    if (newAchievements.length > 0) {
      await user.save();
    }
    return newAchievements;
  } catch (error) {
    console.error('Achievement check error:', error);
    return [];
  }
};

/**
 * Check flashcard-specific achievements
 * @param {string} userId - The user ID
 * @param {number} cardsRead - Number of cards read in this session
 * @returns {Promise<Array>} - Newly awarded achievements
 */
export const checkFlashcardAchievements = async (userId, cardsRead = 1) => {
  try {
    const user = await User.findById(userId);
    if (!user) return [];
    const totalCardsRead = (user.totalFlashcardsRead || 0) + cardsRead;
    user.totalFlashcardsRead = totalCardsRead;
    const allAchievements = await Achievement.find({
      category: 'study',
      isActive: true
    });
    const userAchievements = user.achievements || [];
    const newAchievements = [];
    for (const achievement of allAchievements) {
      if (userAchievements.includes(achievement._id)) continue;
      let unlocked = false;
      const name = achievement.name.toLowerCase();
      if (name.includes('card reader i') && totalCardsRead >= 10) unlocked = true;
      if (name.includes('card reader ii') && totalCardsRead >= 50) unlocked = true;
      if (name.includes('card reader iii') && totalCardsRead >= 100) unlocked = true;
      if (name.includes('card master') && totalCardsRead >= 500) unlocked = true;
      if (unlocked) {
        user.achievements.push(achievement._id);
        user.points = (user.points || 0) + (achievement.points || 0);
        newAchievements.push(achievement);
      }
    }

    // Single save after all mutations
    if (newAchievements.length > 0) {
      await user.save();
    }
    return newAchievements;
  } catch (error) {
    console.error('Flashcard achievement check error:', error);
    return [];
  }
};

/**
 * Helper: Get user's perfect quiz scores count
 */
const getUserPerfectScores = async userId => {
  try {
    // Import models dynamically to avoid circular deps
    const Quiz = (await import('../models/Quiz.js')).default;
    const ProfessionalQuiz = (await import('../models/ProfessionalQuiz.js')).default;
    let perfectCount = 0;

    // Check regular quizzes
    const quizAttempts = await Quiz.find({
      'attempts.userId': userId
    });
    for (const quiz of quizAttempts) {
      for (const attempt of quiz.attempts) {
        if (attempt.userId?.toString() === userId.toString() && attempt.passed && attempt.percentage === 100) perfectCount++;
      }
    }

    // Check professional quizzes
    const profQuizzes = await ProfessionalQuiz.find({
      'attempts.userId': userId
    });
    for (const quiz of profQuizzes) {
      for (const attempt of quiz.attempts) {
        if (attempt.userId?.toString() === userId.toString() && attempt.passed && attempt.percentage === 100) perfectCount++;
      }
    }
    return perfectCount;
  } catch (error) {
    console.error('Error getting perfect scores:', error);
    return 0;
  }
};

/**
 * Format achievements for frontend display
 */
export const formatAchievementResponse = achievements => {
  return achievements.map(a => ({
    id: a._id,
    name: a.name,
    description: a.description,
    icon: a.icon,
    rarity: a.rarity,
    points: a.points,
    category: a.category
  }));
};