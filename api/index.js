import serverlessHttp from 'serverless-http';
import app from '../src/app.js';
import connectDB from '../src/config/db.js';
import mongoose from 'mongoose';

// Connect to database on module load (shared across function invocations)
let dbPromise = null;
let isConnecting = false;

const ensureDBConnection = async () => {
    // Check if already connected
    if (mongoose.connection.readyState === 1) {
        return true;
    }
    
    // Prevent multiple simultaneous connection attempts
    if (isConnecting && dbPromise) {
        return dbPromise;
    }
    
    if (!dbPromise) {
        isConnecting = true;
        dbPromise = connectDB()
            .then(() => {
                isConnecting = false;
                console.log('Database connected successfully');
                return true;
            })
            .catch(err => {
                console.error('Database connection error:', err);
                dbPromise = null;
                isConnecting = false;
                throw err;
            });
    }
    return dbPromise;
};

// Initialize database connection (non-blocking)
ensureDBConnection().catch(err => {
    console.error('Initial DB connection failed:', err);
});

// Wrap Express app with serverless-http for Vercel
// serverless-http properly handles Express routing in serverless environments
const handler = serverlessHttp(app, {
    binary: ['image/*', 'application/pdf']
});

// Vercel serverless function handler
export default async (req, res) => {
    // Ensure database is connected before handling request
    try {
        await ensureDBConnection();
    } catch (error) {
        console.error('DB connection check failed:', error);
        // Only return error if connection is definitely not established
        if (mongoose.connection.readyState === 0 && !isConnecting) {
            return res.status(503).json({ 
                error: 'Database connection failed', 
                message: 'Service temporarily unavailable'
            });
        }
    }
    
    // Use serverless-http handler which properly handles Express routing
    // This ensures paths are correctly matched with Express routes
    return handler(req, res);
};

