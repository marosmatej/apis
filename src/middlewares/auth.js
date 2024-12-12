const jwt = require('jsonwebtoken')
require('dotenv').config()

const authenticate = (requiredRole) => {
    return (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    console.log('token', token)

    if(!token) return res.status(403).json({ error: 'Access denied, token missing!'});

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        if (req.user.role !== requiredRole) {
            return res.status(403).json({error: "You don't have permission to make this request!"});
        }
        next();
    } catch (err) {
        return res.status(403).json({error: 'Invalid token!'});
    }

}}

const authorizeAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(403).json({error: 'You are not logged in!'});
    }
    if (req.user.role !== 'admin') {
        return res.status(403).json({error: 'Admin access only!'});
    }
    next();
}


module.exports = { authenticate, authorizeAdmin };