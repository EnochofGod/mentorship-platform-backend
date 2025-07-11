const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const { User, Profile } = require('../models');

const { jwtSecret } = require('../config/jwt');
console.log('--- authMiddleware.js - Imported JWT_SECRET ---');
console.log('jwtSecret (from config/jwt):', jwtSecret ? jwtSecret.substring(0, 10) + '...' : 'undefined');
console.log('Is jwtSecret defined and non-empty?', !!jwtSecret);
console.log('Length of jwtSecret:', jwtSecret ? jwtSecret.length : 'N/A');
console.log('-----------------------------------------------');


const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, jwtSecret);

            req.user = await User.findByPk(decoded.id, {
                attributes: { exclude: ['password'] },
                include: [{ model: Profile, as: 'profile' }] 
            });

            // --- DEBUGGING LOGS FOR FETCHED USER AND PROFILE ---
            console.log('--- authMiddleware: User Fetched ---');
            console.log('User ID from token:', decoded.id);
            console.log('req.user (found):', req.user ? 'YES' : 'NO');
            if (req.user) {
                console.log('req.user.id:', req.user.id);
                console.log('req.user.email:', req.user.email);
                console.log('req.user.role:', req.user.role);
                console.log('req.user.profile (associated):', req.user.profile ? 'YES' : 'NO');
                if (req.user.profile) {
                    console.log('req.user.profile.id:', req.user.profile.id);
                    console.log('req.user.profile.name:', req.user.profile.name);
                } else {
                    console.log('WARNING: Profile not found for user ID:', req.user.id);
                }
            }
            console.log('------------------------------------');
            // --- END DEBUGGING LOGS ---

            if (!req.user) {
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }

            return next();
        } catch (error) {
            console.error('JWT verification error:', error.message);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
});


const authorize = (roles = []) => {
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return (req, res, next) => {
        if (!req.user || (roles.length && !roles.includes(req.user.role))) {
            return res.status(403).json({ message: 'Forbidden: insufficient permissions' });
        }

        next();
    };
};

module.exports = {
    authenticate: protect,
    authorize: authorize
};
