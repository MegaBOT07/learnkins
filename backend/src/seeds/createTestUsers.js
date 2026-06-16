import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
import User from '../models/User.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/learnkins';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Mongo connect error', err.message);
    process.exit(1);
  }
};

const createOrUpdateUser = async ({ email, name, password, role, parentId = null }) => {
  try {
    const normalizedEmail = (email || '').toLowerCase();
    let user = await User.findOne({ email: normalizedEmail }).select('+password');

    if (user) {
      user.name = name || user.name;
      user.role = role || user.role;
      if (password) user.password = password; // will be hashed by pre-save hook
      // set default grade for student if not present
      if (role === 'student' && !user.grade) user.grade = '6th';
      if (parentId) user.parentId = parentId;
      await user.save();
      console.log(`Updated user: ${normalizedEmail} (role: ${user.role})`);
    } else {
      const createData = {
        name: name || 'User',
        email: normalizedEmail,
        password: password || 'changeme',
        role: role || 'student',
        isActive: true,
      };
      if (createData.role === 'student') createData.grade = '6th';
      if (parentId) createData.parentId = parentId;
      user = await User.create(createData);
      console.log(`Created user: ${normalizedEmail} (role: ${user.role})`);
    }

    return user;
  } catch (err) {
    console.error('Create/update user error', err.message || err);
    throw err;
  }
};

const run = async () => {
  await connectDB();

  try {
    // Read credentials from env if present, else use values provided by the developer
    const email = process.env.TEST_USER_EMAIL || 'mohitlalwani1931@gmail.com';
    const password = process.env.TEST_USER_PASSWORD || 'mohit@123';

    // Create or update parent first
    const parentEmail = process.env.TEST_PARENT_EMAIL || (() => {
      const parts = email.split('@');
      if (parts.length === 2) return `${parts[0]}.parent@${parts[1]}`;
      return `${email}-parent`;
    })();

    const parent = await createOrUpdateUser({
      email: parentEmail,
      name: 'Test Parent',
      password: password,
      role: 'parent',
    });

    // Create student and link to parent
    await createOrUpdateUser({
      email: email,
      name: 'Test Student',
      password: password,
      role: 'student',
      parentId: parent._id,
    });

    console.log('✅ Test users created/updated.');
  } catch (err) {
    console.error('Error creating test users', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

run();
