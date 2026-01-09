import IpSettings from '../models/IpSettings.js';

export const checkIP = async (req, res, next) => {
    try {
        if (!req.user) {
            return next();
        }

        if (req.user.role === 'RESELLER' || req.user.role === 'USER') {
            return next();
        }

        if (req.user.role !== 'SUPER_ADMIN') {
            return next();
        }

        const isSuperAdminRoute = req.path.startsWith('/superadmin') || req.originalUrl.includes('/superadmin');
        
        if (!isSuperAdminRoute) {
            return next();
        }

        const ipSettings = await IpSettings.findOne();
        
        if (!ipSettings || !ipSettings.isIpRestrictionEnabled) {
            return next();
        }

        const clientIP = getClientIP(req);
        const whitelist = ipSettings.ipWhitelist || [];
        const staticIP = ipSettings.staticIP;

        console.log('IP Check (SUPER_ADMIN /api/superadmin/* routes only):', {
            clientIP,
            whitelist,
            staticIP,
            isRestrictionEnabled: ipSettings.isIpRestrictionEnabled,
            route: req.originalUrl
        });

        const allowedIPs = [...whitelist];
        if (staticIP) {
            allowedIPs.push(staticIP);
        }

        const isAllowed = allowedIPs.some(ip => {
            if (ip === clientIP) return true;
            if (ip.includes('*')) {
                const pattern = ip.replace(/\*/g, '.*');
                const regex = new RegExp(`^${pattern}$`);
                return regex.test(clientIP);
            }
            return false;
        });

        if (!isAllowed) {
            console.log('IP Blocked (SUPER_ADMIN on /api/superadmin/*):', clientIP);
            return res.status(403).json({ 
                message: 'Access denied. Your IP address is not whitelisted.' 
            });
        }

        console.log('IP Allowed (SUPER_ADMIN on /api/superadmin/*):', clientIP);
        next();
    } catch (error) {
        console.error('IP Check Error:', error);
        next();
    }
};

function getClientIP(req) {
    const forwarded = req.headers['x-forwarded-for'];
    if (forwarded) {
        const ips = forwarded.split(',');
        return ips[0].trim();
    }
    const ip = req.ip || req.connection?.remoteAddress || req.socket?.remoteAddress || req.headers['x-real-ip'] || 'unknown';
    return ip.replace('::ffff:', '');
}

