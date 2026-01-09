import express from 'express';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/role.js';

const router = express.Router();

router.post('/', protect, authorize('SUPER_ADMIN', 'RESELLER'), async (req, res) => {
    try {
        const { name, email, password, role, keywordLimit, startDate, expireDate } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: 'Name, email, password, and role are required' });
        }

        if (req.user.role === 'RESELLER' && role !== 'USER') {
            return res.status(403).json({ message: 'Resellers can only create USER accounts' });
        }

        if (await User.findOne({ email })) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
            role,
            keywordLimit: keywordLimit || 0,
            startDate,
            expireDate,
            keywordUsed: 0,
            isActive: true
        });

        res.status(201).json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                keywordLimit: user.keywordLimit,
                keywordUsed: user.keywordUsed,
                startDate: user.startDate,
                expireDate: user.expireDate,
                isActive: user.isActive
            }
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/', protect, authorize('SUPER_ADMIN', 'RESELLER'), async (req, res) => {
    try {
        let query = {};

        if (req.user.role === 'RESELLER') {
            query = { role: 'USER' };
        }

        const users = await User.find(query).select('-password').sort({ createdAt: -1 });

        res.json({
            users: users.map(user => ({
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                keywordLimit: user.keywordLimit,
                keywordUsed: user.keywordUsed,
                keywordsLeft: Math.max(0, user.keywordLimit - user.keywordUsed),
                startDate: user.startDate,
                expireDate: user.expireDate,
                isActive: user.isActive,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }))
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/:id', protect, authorize('SUPER_ADMIN', 'RESELLER'), async (req, res) => {
    try {
        const { name, email, password, role, keywordLimit, keywordUsed, startDate, expireDate, isActive } = req.body;
        const userId = req.params.id;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (req.user.role === 'RESELLER') {
            if (user.role !== 'USER') {
                return res.status(403).json({ message: 'Resellers can only update USER accounts' });
            }
            if (role && role !== 'USER') {
                return res.status(403).json({ message: 'Resellers cannot change user role' });
            }
        }

        if (email && email !== user.email) {
            const emailExists = await User.findOne({ email });
            if (emailExists) {
                return res.status(400).json({ message: 'Email already exists' });
            }
        }

        if (name) user.name = name;
        if (email) user.email = email;
        if (password) user.password = password;
        if (role && req.user.role === 'SUPER_ADMIN') user.role = role;
        if (keywordLimit !== undefined) user.keywordLimit = keywordLimit;
        if (keywordUsed !== undefined) user.keywordUsed = keywordUsed;
        if (startDate !== undefined) user.startDate = startDate;
        if (expireDate !== undefined) user.expireDate = expireDate;
        if (isActive !== undefined && req.user.role === 'SUPER_ADMIN') user.isActive = isActive;

        await user.save();

        res.json({
            user: {
                id: user._id,
                name: user.name,
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
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/:id', protect, authorize('SUPER_ADMIN'), async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await User.findByIdAndDelete(req.params.id);

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;

