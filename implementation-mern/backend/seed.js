const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Module = require('./models/Module');
const FAQ = require('./models/FAQ');
require('dotenv').config();

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB for seeding...');

        // Clear existing data robustly
        const collections = await mongoose.connection.db.collections();
        for (let collection of collections) {
            await collection.deleteMany({});
            try { await collection.dropIndexes(); } catch (e) {}
        }

        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash('password123', salt);

        // Create Users
        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@edu.com',
            password,
            role: 'Admin',
            department: 'Administration'
        });

        const lecturer = await User.create({
            name: 'Dr. John Doe',
            email: 'lecturer@edu.com',
            password,
            role: 'Lecturer',
            department: 'Computer Science'
        });

        const student = await User.create({
            name: 'Jane Smith',
            email: 'student@edu.com',
            password,
            role: 'Student',
            studentId: 'ST-2024-001',
            department: 'Computer Science'
        });

        // Create Modules
        const m1 = await Module.create({
            code: 'CS301',
            name: 'Software Engineering',
            lecturer: lecturer._id,
            department: 'Computer Science',
            totalLectures: 10
        });

        const m2 = await Module.create({
            code: 'CS302',
            name: 'Database Management',
            lecturer: lecturer._id,
            department: 'Computer Science',
            totalLectures: 12
        });

        // Create FAQs
        await FAQ.create([
            {
                question: 'What is the attendance threshold?',
                answer: 'Students must maintain at least 75% attendance in each module to be eligible for final examinations.',
                category: 'Academic',
                tags: ['attendance', 'threshold', 'eligibility']
            },
            {
                question: 'How to download records?',
                answer: 'Lecturers can download module-wise attendance records in PDF format from the Analytics page.',
                category: 'Technical',
                tags: ['download', 'pdf', 'records']
            },
            {
                question: 'Where can I give feedback?',
                answer: 'You can navigate to the Feedback section from the sidebar to rate teachers and module content.',
                category: 'General',
                tags: ['feedback', 'rating']
            }
        ]);

        console.log('Seeding completed successfully!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seed();
