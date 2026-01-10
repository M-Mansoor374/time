import app from '../src/app.js';
import connectDB from '../src/config/db.js';
import mongoose from 'mongoose';

// Connect to database on module load (shared across function invocations)
let dbPromise = null;
let isConnecting = false;
let connectionAttempted = false;

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
        connectionAttempted = true;
        dbPromise = connectDB()
            .then(() => {
                isConnecting = false;
                console.log('✅ Database connected successfully');
                return true;
            })
            .catch(err => {
                console.error('❌ Database connection error:', err.message);
                dbPromise = null;
                isConnecting = false;
                // Don't throw - let requests proceed, but they'll handle the error
                return false;
            });
    }
    return dbPromise;
};

// Vercel serverless function handler
export default async (req, res) => {
    // Log request for debugging
    console.log(`[${req.method}] ${req.url || req.path}`);
    
    // Handle OPTIONS requests for CORS preflight immediately
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        return res.status(200).end();
    }
    
    // Try to ensure database connection (non-blocking for routes that don't need DB)
    // This allows the health check to work even if DB is down
    if (connectionAttempted === false) {
        ensureDBConnection().catch(err => {
            console.error('Initial DB connection attempt failed:', err.message);
        });
    } else {
        // Check connection status without blocking
        ensureDBConnection().catch(() => {
            // Connection will be retried on next request
        });
    }
    
    // Handle the Express app
    // Wrap in try-catch to handle any unexpected errors
    try {
        return await app(req, res);
    } catch (error) {
        console.error('Express app error:', error);
        if (!res.headersSent) {
            return res.status(500).json({
                error: 'Internal server error',
                message: error.message
            });
        }
    }
};

