import User from '../models/User.js';

export const checkToolAccess = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.role !== 'USER') {
            return res.status(403).json({ message: 'Only USER role can access tool' });
        }

        if (!user.isActive) {
            return res.status(403).json({ message: 'Account is inactive' });
        }

        const now = new Date();

        if (user.startDate && now < new Date(user.startDate)) {
            return res.status(403).json({ message: 'Service has not started yet' });
        }

        if (user.expireDate && now > new Date(user.expireDate)) {
            return res.status(403).json({ message: 'Service has expired' });
        }

        if (user.keywordUsed >= user.keywordLimit) {
            return res.status(403).json({ message: 'Keyword limit exceeded' });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

