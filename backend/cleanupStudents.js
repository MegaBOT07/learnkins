import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import models (using ES modules)
import User from './src/models/User.js';
import TokenTransaction from './src/models/TokenTransaction.js';
// Note: If Progress or other models exist, we should import them too.
// Let's check for Progress and Achievement models.

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/learnkins";

async function cleanup() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB for cleanup');

        const students = await User.find({ role: 'student' });
        const studentIds = students.map(s => s._id);

        console.log(`Found ${students.length} students to remove.`);

        if (students.length === 0) {
            console.log('No students found. Nothing to delete.');
            await mongoose.connection.close();
            return;
        }

        // 1. Remove student IDs from parent children arrays
        console.log('Updating parent links...');
        await User.updateMany(
            { role: 'parent' },
            { $pull: { children: { $in: studentIds } } }
        );

        // 2. Delete TokenTransactions
        console.log('Deleting token transactions...');
        await TokenTransaction.deleteMany({ userId: { $in: studentIds } });

        // 3. Delete from User collection
        console.log('Deleting student users...');
        const result = await User.deleteMany({ role: 'student' });
        console.log(`Successfully deleted ${result.deletedCount} students.`);

        console.log('Cleanup completed successfully.');
    } catch (error) {
        console.error('Cleanup failed:', error);
    } finally {
        await mongoose.connection.close();
    }
}

cleanup();
