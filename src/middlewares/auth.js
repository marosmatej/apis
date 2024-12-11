const jwt = require('jsonwebtoken')
require('dotenv').config()

const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    console.log('token', token)

    if(!token) return res.status(403).json({ error: 'Access denied, token missing!'});

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({error: 'Invalid token!'});
    }

}

const authorizeAdmin = (req, res, next) => {
    if(req.user.role !== 'admin') {
        return res.status(403).json({error: 'Admin access only!'})
    }
    next();
}

module.exports = { authenticate, authorizeAdmin };