import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import toolRoutes from './routes/tool.js';
import settingsRoutes from './routes/settings.js';
import ipSettingsRoutes from './routes/ipSettings.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set('trust proxy', true);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (HTML, CSS, JS, images)
app.use(express.static(path.join(__dirname, '../')));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tool', toolRoutes);
app.use('/api/admin', settingsRoutes);
app.use('/api', settingsRoutes);
app.use('/api/superadmin', ipSettingsRoutes);

app.get('/health', (req, res) => {
    res.json({ status: 'OK' });
});

// Serve index/login page for root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../login.html'));
});

export default app;

