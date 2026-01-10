import app from '../src/app.js';
import connectDB from '../src/config/db.js';

// Connect to database on module load (shared across function invocations)
let dbPromise = null;

const ensureDBConnection = async () => {
    if (!dbPromise) {
        dbPromise = connectDB().catch(err => {
            console.error('Database connection error:', err);
            dbPromise = null; // Reset on error to allow retry
            throw err;
        });
    }
    return dbPromise;
};

// Vercel serverless function handler
export default async (req, res) => {
    try {
        // Ensure database is connected
        await ensureDBConnection();
    } catch (error) {
        // Log but continue - mongoose connection might be cached
        console.error('DB connection check failed:', error);
    }
    
    // Handle Express app
    return app(req, res);
};

