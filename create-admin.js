import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';

dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, { dbName: 'ahrf' });
        console.log('Connected to MongoDB');
        
        const existingAdmin = await User.findOne({ email: 'admin@example.com', role: 'SUPER_ADMIN' });
        
        if (existingAdmin) {
            console.log('Super Admin already exists:', existingAdmin.email);
            process.exit(0);
        }
        
        const admin = await User.create({
            name: 'Super Admin',
            email: 'admin@example.com',
            password: 'admin123',
            role: 'SUPER_ADMIN',
            keywordLimit: 0,
            keywordUsed: 0,
            isActive: true
        });
        
        console.log('✅ Super Admin created successfully!');
        console.log('Email:', admin.email);
        console.log('Password: admin123');
        console.log('Role: SUPER_ADMIN');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

createAdmin();

