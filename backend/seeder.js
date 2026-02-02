const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const Admin = require('./models/Admin');
const connectDB = require('./config/db');

dotenv.config();

const importData = async () => {
    try {
        await connectDB();

        // Check if admin exists
        const exists = await Admin.findOne({ email: 'admin@example.com' });
        if (exists) {
            console.log('Val: Admin already exists.');
            process.exit();
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('Princekum@r7624', salt);

        await Admin.create({
            name: 'Amit Mahto',
            email: 'prince960876@gmail.com',
            password: hashedPassword,
            role: 'admin'
        });

        console.log('Val: Admin Created! Email: admin@example.com | Password: password123');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

importData();
