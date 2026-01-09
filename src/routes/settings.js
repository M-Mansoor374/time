import express from 'express';
import Cookie from '../models/Cookie.js';
import Branding from '../models/Branding.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/role.js';

const router = express.Router();

router.post('/cookies', protect, authorize('SUPER_ADMIN'), async (req, res) => {
    try {
        const { cookies } = req.body;

        if (!cookies) {
            return res.status(400).json({ message: 'Cookies data is required' });
        }

        await Cookie.findOneAndUpdate(
            {},
            { cookies },
            { upsert: true, new: true }
        );

        res.json({ message: 'Cookies saved successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/cookies', protect, authorize('SUPER_ADMIN'), async (req, res) => {
    try {
        const cookieDoc = await Cookie.findOne();
        res.json({ cookies: cookieDoc?.cookies || '' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/cookies/user', protect, authorize('USER'), async (req, res) => {
    try {
        const cookieDoc = await Cookie.findOne();
        if (!cookieDoc || !cookieDoc.cookies) {
            return res.status(404).json({ message: 'No cookies available' });
        }
        res.json({ cookies: cookieDoc.cookies });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/branding', protect, authorize('SUPER_ADMIN'), async (req, res) => {
    try {
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({ message: 'Branding text is required' });
        }

        await Branding.findOneAndUpdate(
            {},
            { text },
            { upsert: true, new: true }
        );

        res.json({ message: 'Branding saved successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/branding', protect, async (req, res) => {
    try {
        const brandingDoc = await Branding.findOne();
        res.json({ text: brandingDoc?.text || 'This service is used by XYZ' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;

