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
    if (!MONGO_URI) {
        const error = new Error('MONGO_URI is not defined in environment variables');
        console.error('❌', error.message);
        throw error;
    }
    
    try {
        // Check if already connected
        if (mongoose.connection.readyState === 1) {
            console.log('✅ MongoDB Already Connected');
            return;
        }

        console.log('🔄 Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI, {
            dbName: 'ahrf',
            serverSelectionTimeoutMS: 10000, // Increased timeout for serverless
            socketTimeoutMS: 45000,
            maxPoolSize: 1, // Important for serverless - use single connection
        });
        console.log('✅ MongoDB Connected successfully');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        // In serverless, we want to throw so the handler can catch it
        throw error;
    }
};

export default connectDB;

