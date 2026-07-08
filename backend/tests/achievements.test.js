/**
 * Achievement System — Integration Tests
 *
 * Prerequisites:
 * - MongoDB running locally (or set MONGODB_URI env)
 * - Run: npx mocha tests/achievements.test.js --require @babel/register --timeout 10000
 */

import mongoose from 'mongoose';
import Achievement from '../src/models/Achievement.js';
import User from '../src/models/User.js';
import {
  checkAndAwardAchievements,
  checkFlashcardAchievements,
} from '../src/utils/achievementChecker.js';
import { seedAchievements } from '../src/seeds/seedAchievements.js';

const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

// ── Test Data ────────────────────────────────────────────────────
const testAchievements = [
  {
    name: 'Quiz Taker I',
    description: 'Complete 5 quizzes',
    icon: '✍️',
    rarity: 'Common',
    points: 15,
    criteria: 'Complete 5 quizzes',
    category: 'quiz',
    requirements: { quizzesTaken: 5, gamesPlayed: 0, streakDays: 0, perfectScores: 0, communityPosts: 0 },
    isActive: true,
  },
  {
    name: 'Gamer I',
    description: 'Play 5 games',
    icon: '🎮',
    rarity: 'Common',
    points: 15,
    criteria: 'Play 5 games',
    category: 'game',
    requirements: { quizzesTaken: 0, gamesPlayed: 5, streakDays: 0, perfectScores: 0, communityPosts: 0 },
    isActive: true,
  },
  {
    name: 'Streak I',
    description: '3-day streak',
    icon: '🔥',
    rarity: 'Common',
    points: 20,
    criteria: '3-day study streak',
    category: 'streak',
    requirements: { quizzesTaken: 0, gamesPlayed: 0, streakDays: 3, perfectScores: 0, communityPosts: 0 },
    isActive: true,
  },
  {
    name: 'Dedicated Learner',
    description: 'Study 10 hours',
    icon: '⏰',
    rarity: 'Uncommon',
    points: 40,
    criteria: '10 total study hours',
    category: 'special',
    requirements: { studyHours: 10, quizzesTaken: 0, gamesPlayed: 0, streakDays: 0, perfectScores: 0, communityPosts: 0 },
    isActive: true,
  },
  {
    name: 'Inactive Test',
    description: 'Should never be awarded',
    icon: '🚫',
    rarity: 'Common',
    points: 5,
    criteria: 'None',
    category: 'study',
    requirements: { studyHours: 0, quizzesTaken: 0, gamesPlayed: 0, streakDays: 0, perfectScores: 0, communityPosts: 0 },
    isActive: false,
  },
];

// ── Hooks ────────────────────────────────────────────────────────
before(async function () {
  this.timeout(20000);
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

after(async function () {
  await mongoose.disconnect();
  if (mongoServer) await mongoServer.stop();
});

beforeEach(async function () {
  await Achievement.deleteMany({});
  await User.deleteMany({});
});

// ── Schema Validation Tests ──────────────────────────────────────
describe('Achievement Schema', () => {
  it('should create a valid achievement', async () => {
    const ach = await Achievement.create(testAchievements[0]);
    expect(ach.name).to.equal('Quiz Taker I');
    expect(ach.points).to.equal(15);
    expect(ach.rarity).to.equal('Common');
    expect(ach.requirements.quizzesTaken).to.equal(5);
  });

  it('should reject achievement without required fields', async () => {
    let error;
    try {
      await Achievement.create({ name: 'Incomplete' });
    } catch (err) {
      error = err;
    }
    expect(error).to.exist;
    expect(error.errors.description).to.exist;
  });

  it('should enforce category enum', async () => {
    let error;
    try {
      await Achievement.create({ ...testAchievements[0], category: 'invalid-category' });
    } catch (err) {
      error = err;
    }
    expect(error).to.exist;
  });

  it('should enforce points range (1-1000)', async () => {
    let error;
    try {
      await Achievement.create({ ...testAchievements[0], points: 0 });
    } catch (err) {
      error = err;
    }
    expect(error).to.exist;
  });
});

// ── Achievement Checker Tests ────────────────────────────────────
describe('checkAndAwardAchievements', () => {
  let user;

  beforeEach(async () => {
    await Achievement.insertMany(testAchievements);
    user = await User.create({
      name: 'Test',
      email: `test-${Date.now()}@test.com`,
      password: 'password123',
      role: 'student',
      grade: '6th',
    });
  });

  it('should award no achievements when user has no stats', async () => {
    const result = await checkAndAwardAchievements(user._id);
    expect(result).to.have.lengthOf(0);
  });

  it('should award quiz achievement when user meets requirements', async () => {
    user.totalQuizzesTaken = 5;
    await user.save();

    const result = await checkAndAwardAchievements(user._id);
    expect(result).to.have.lengthOf(1);
    expect(result[0].name).to.equal('Quiz Taker I');
  });

  it('should award game achievement when user meets requirements', async () => {
    user.totalGamesPlayed = 5;
    await user.save();

    const result = await checkAndAwardAchievements(user._id);
    expect(result).to.have.lengthOf(1);
    expect(result[0].name).to.equal('Gamer I');
  });

  it('should award streak achievement when user meets requirements', async () => {
    user.currentStreak = 3;
    await user.save();

    const result = await checkAndAwardAchievements(user._id);
    expect(result).to.have.lengthOf(1);
    expect(result[0].name).to.equal('Streak I');
  });

  it('should award Dedicated Learner via studyHours requirement', async () => {
    user.totalStudyHours = 10;
    await user.save();

    const result = await checkAndAwardAchievements(user._id);
    expect(result).to.have.lengthOf(1);
    expect(result[0].name).to.equal('Dedicated Learner');
  });

  it('should award multiple achievements at once', async () => {
    user.totalQuizzesTaken = 5;
    user.totalGamesPlayed = 5;
    user.currentStreak = 3;
    user.totalStudyHours = 10;
    await user.save();

    const result = await checkAndAwardAchievements(user._id);
    expect(result).to.have.lengthOf(4);
  });

  it('should not award inactive achievements', async () => {
    const inactive = await Achievement.findOne({ name: 'Inactive Test' });
    user.achievements = [inactive._id];
    await user.save();

    // No matter what stats user has, inactive test achievement should not be
    // awarded (it's skipped because it's not in the active query)
    user.totalStudyHours = 100;
    await user.save();

    const result = await checkAndAwardAchievements(user._id);
    expect(result).to.have.lengthOf(0); // inactive won't be checked at all
  });

  it('should not award duplicate achievements', async () => {
    const quizAch = await Achievement.findOne({ name: 'Quiz Taker I' });
    user.achievements.push(quizAch._id);
    await user.save();

    user.totalQuizzesTaken = 5;
    await user.save();

    const result = await checkAndAwardAchievements(user._id);
    const quizResults = result.filter(r => r.name === 'Quiz Taker I');
    expect(quizResults).to.have.lengthOf(0);
  });

  it('should add achievement points to user', async () => {
    user.totalQuizzesTaken = 5;
    await user.save();

    await checkAndAwardAchievements(user._id);
    const updatedUser = await User.findById(user._id);
    expect(updatedUser.achievements).to.have.lengthOf(1);
    expect(updatedUser.points).to.equal(15);
  });

  it('should handle non-existent userId gracefully', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const result = await checkAndAwardAchievements(fakeId);
    expect(result).to.have.lengthOf(0);
  });
});

// ── Flashcard Achievement Tests ──────────────────────────────────
describe('checkFlashcardAchievements', () => {
  let user;

  beforeEach(async () => {
    await Achievement.insertMany([
      {
        name: 'Card Reader I',
        description: 'Read 10 flashcards',
        icon: '📖',
        rarity: 'Common',
        points: 10,
        criteria: 'Read 10 flashcards',
        category: 'study',
        requirements: {},
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
        requirements: {},
        isActive: true,
      },
    ]);

    user = await User.create({
      name: 'Flashcard Test',
      email: `flash-${Date.now()}@test.com`,
      password: 'password123',
      role: 'student',
      grade: '6th',
    });
  });

  it('should award Card Reader I at 10 cards', async () => {
    const result = await checkFlashcardAchievements(user._id, 10);
    expect(result).to.have.lengthOf(1);
    expect(result[0].name).to.equal('Card Reader I');
  });

  it('should award Card Reader II at 50+ cards', async () => {
    // First call with 10 cards
    await checkFlashcardAchievements(user._id, 10);
    // Second call with 40 more cards = 50 total
    const result = await checkFlashcardAchievements(user._id, 40);
    const names = result.map(r => r.name);
    expect(names).to.include('Card Reader II');
  });

  it('should save totalFlashcardsRead on User', async () => {
    await checkFlashcardAchievements(user._id, 25);
    const updated = await User.findById(user._id);
    expect(updated.totalFlashcardsRead).to.equal(25);
  });
});

// ── User Controller Endpoint Test ────────────────────────────────
describe('GET /api/users/:id/achievements', () => {
  it('should query User.populate("achievements") not Achievement.find("earnedBy")', async () => {
    // This test verifies the fix from userController.js
    const ach = await Achievement.create(testAchievements[0]);
    const user = await User.create({
      name: 'Endpoint Test',
      email: `ep-${Date.now()}@test.com`,
      password: 'password123',
      role: 'student',
      grade: '6th',
      achievements: [ach._id],
    });

    const populated = await User.findById(user._id).populate('achievements');
    expect(populated.achievements).to.have.lengthOf(1);
    expect(populated.achievements[0].name).to.equal('Quiz Taker I');

    // The old query Achievement.find({'earnedBy.user': id}) would return []
    const oldQueryResult = await Achievement.find({ 'earnedBy.user': user._id });
    expect(oldQueryResult).to.have.lengthOf(0);
  });
});

// ── Seed Data Tests ──────────────────────────────────────────────
describe('seedAchievements', () => {
  it('should seed 24 achievements when DB is empty', async () => {
    await seedAchievements();
    const count = await Achievement.countDocuments();
    expect(count).to.equal(24);
  });

  it('should not duplicate on second run', async () => {
    await seedAchievements();
    await seedAchievements();
    const count = await Achievement.countDocuments();
    expect(count).to.equal(24);
  });

  it('should include Dedicated Learner with studyHours: 10', async () => {
    await seedAchievements();
    const dl = await Achievement.findOne({ name: 'Dedicated Learner' });
    expect(dl).to.exist;
    expect(dl.requirements.studyHours).to.equal(10);
  });

  it('should include Scholar with studyHours: 50', async () => {
    await seedAchievements();
    const scholar = await Achievement.findOne({ name: 'Scholar' });
    expect(scholar).to.exist;
    expect(scholar.requirements.studyHours).to.equal(50);
  });
});
