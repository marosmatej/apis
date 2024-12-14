const jwt = require('jsonwebtoken')
require('dotenv').config()

const TokenBlacklist = require('../models/tokenBlackList');

const authenticate = (requiredRole) => {
    return async (req, res, next) => {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(403).json({ error: 'Access denied, token missing!' });
        }

        // Check if the token is in the blacklist
        const blacklistedToken = await TokenBlacklist.findOne({ where: { token } });

        if (blacklistedToken) {
            return res.status(403).json({ error: 'Token has been invalidated' });
        }

        try {
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            req.user = decoded;

            if (requiredRole && req.user.role !== requiredRole) {
                return res.status(403).json({ error: "You don't have permission to make this request!" });
            }

            next();
        } catch (err) {
            return res.status(403).json({ error: 'Invalid token!' });
        }
    };
};




module.exports = { authenticate };