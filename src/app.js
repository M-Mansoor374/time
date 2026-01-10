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

app.get('/health', (req, res) => {
    res.json({ status: 'OK' });
});

// Catch-all for undefined routes
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found', path: req.path });
});

export default app;

