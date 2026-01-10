import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import toolRoutes from './routes/tool.js';
import settingsRoutes from './routes/settings.js';
import ipSettingsRoutes from './routes/ipSettings.js';

dotenv.config();

const app = express();

app.set('trust proxy', true);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tool', toolRoutes);
app.use('/api/admin', settingsRoutes);
app.use('/api', settingsRoutes);
app.use('/api/superadmin', ipSettingsRoutes);

// Health check endpoint (accessible without /api prefix in serverless)
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Catch-all for undefined routes with detailed error
app.use((req, res) => {
    console.error(`Route not found: ${req.method} ${req.url}`);
    res.status(404).json({ 
        error: 'Route not found', 
        method: req.method,
        path: req.path,
        url: req.url,
        availableRoutes: [
            'POST /api/auth/login',
            'GET /api/auth/me',
            'GET /api/users',
            'POST /api/users',
            'PUT /api/users/:id',
            'DELETE /api/users/:id',
            'POST /api/tool/use',
            'GET /api/tool/usage',
            'GET /api/branding',
            'GET /api/superadmin/settings',
            'PUT /api/superadmin/settings'
        ]
    });
});

export default app;

