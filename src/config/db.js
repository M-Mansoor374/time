import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error('MONGO_URI is not defined in environment variables');
    process.exit(1);
}

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            dbName: 'ahrf'
        });
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        process.exit(1);
    }
};

export default connectDB;

