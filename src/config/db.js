import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error('MONGO_URI is not defined in environment variables');
    if (!process.env.VERCEL) {
        process.exit(1);
    }
}

const connectDB = async () => {
    try {
        // Check if already connected
        if (mongoose.connection.readyState === 1) {
            console.log('MongoDB Already Connected');
            return;
        }

        await mongoose.connect(MONGO_URI, {
            dbName: 'ahrf',
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        // Don't exit process in serverless environment
        if (process.env.VERCEL) {
            throw error;
        }
        process.exit(1);
    }
};

export default connectDB;

