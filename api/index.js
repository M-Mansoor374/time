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

// Vercel serverless function handler
// Vercel's @vercel/node automatically handles Express apps
export default async (req, res) => {
    // Log request for debugging
    console.log(`[${req.method}] ${req.url}`);
    
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
    
    // Vercel's @vercel/node builder automatically wraps Express apps
    // The app handles routing internally with Express routes
    return app(req, res);
};

