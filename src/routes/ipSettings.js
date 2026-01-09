import express from 'express';
import IpSettings from '../models/IpSettings.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/role.js';
import { checkIP } from '../middleware/ipCheck.js';

const router = express.Router();

router.get('/settings', protect, authorize('SUPER_ADMIN'), checkIP, async (req, res) => {
    try {
        let settings = await IpSettings.findOne();
        
        if (!settings) {
            settings = await IpSettings.create({
                ipWhitelist: [],
                isIpRestrictionEnabled: false,
                staticIP: ''
            });
        }

        res.json({
            ipWhitelist: settings.ipWhitelist || [],
            isIpRestrictionEnabled: settings.isIpRestrictionEnabled || false,
            staticIP: settings.staticIP || ''
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/settings', protect, authorize('SUPER_ADMIN'), checkIP, async (req, res) => {
    try {
        const { ipWhitelist, isIpRestrictionEnabled, staticIP } = req.body;

        const settings = await IpSettings.findOneAndUpdate(
            {},
            {
                ipWhitelist: Array.isArray(ipWhitelist) ? ipWhitelist : [],
                isIpRestrictionEnabled: isIpRestrictionEnabled === true || isIpRestrictionEnabled === 'true',
                staticIP: staticIP || ''
            },
            { upsert: true, new: true }
        );

        res.json({
            message: 'IP settings saved successfully',
            settings: {
                ipWhitelist: settings.ipWhitelist,
                isIpRestrictionEnabled: settings.isIpRestrictionEnabled,
                staticIP: settings.staticIP
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;

