import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/role.js';

const router = express.Router();

router.post('/login', async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({ message: 'Email, password, and role are required' });
        }


        const user = await User.findOne({ email, role });

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        if (!user.isActive) {
            return res.status(403).json({ message: 'Account is inactive' });
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            token,
            role: user.role,
            user: {
                id: user._id,
                email: user.email,
                keywordLimit: user.keywordLimit,
                keywordUsed: user.keywordUsed,
                keywordsLeft: Math.max(0, user.keywordLimit - user.keywordUsed)
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/me', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json({
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
                keywordLimit: user.keywordLimit,
                keywordUsed: user.keywordUsed,
                keywordsLeft: Math.max(0, user.keywordLimit - user.keywordUsed),
                startDate: user.startDate,
                expireDate: user.expireDate,
                isActive: user.isActive
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;

