import app from '../src/app.js';
import connectDB from '../src/config/db.js';
import mongoose from 'mongoose';

// Connect to database on module load (shared across function invocations)
let dbPromise = null;

const ensureDBConnection = async () => {
    // Check if already connected
    if (mongoose.connection.readyState === 1) {
        return;
    }
    
    if (!dbPromise) {
        dbPromise = connectDB().catch(err => {
            console.error('Database connection error:', err);
            dbPromise = null; // Reset on error to allow retry
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
export default async (req, res) => {
    try {
        // Ensure database is connected
        await ensureDBConnection();
    } catch (error) {
        // Log but continue - mongoose connection might be cached
        console.error('DB connection check failed:', error);
        // Return error response if DB connection fails
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({ 
                error: 'Database connection failed', 
                message: 'Service temporarily unavailable' 
            });
        }
    }
    
    // Handle Express app - Vercel will handle the response
    return app(req, res);
};

