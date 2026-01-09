import express from 'express';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/role.js';
import { checkToolAccess } from '../middleware/tool.js';

const router = express.Router();

router.post('/use', protect, authorize('USER'), checkToolAccess, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.keywordUsed >= user.keywordLimit) {
            return res.status(403).json({ message: 'Keyword limit exceeded' });
        }

        user.keywordUsed += 1;
        await user.save();

        const remaining = Math.max(0, user.keywordLimit - user.keywordUsed);

        res.json({
            keywordUsed: user.keywordUsed,
            keywordLimit: user.keywordLimit,
            remaining
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/usage', protect, authorize('USER'), async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const remaining = Math.max(0, user.keywordLimit - user.keywordUsed);

        res.json({
            keywordUsed: user.keywordUsed,
            keywordLimit: user.keywordLimit,
            remaining
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;

