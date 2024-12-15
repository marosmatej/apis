const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = require('../models/userModel');
const TokenBlacklist = require('../models/tokenBlackList');

const register = async (req, res) =>{
    const { username, password, role } = req.body;
    console.log('username', username)

    try {
        console.log('try')
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword)
        const user = await User.create({ username, password: hashedPassword, role});
        console.log('user', user)
        res.status(201).json({message: 'User registered successfully', user: {username:user.username, role:user.role}});
    } catch (err) {
        res.status(400).json({error: 'User registration failed', details: err});
    }
}

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({where: { username }});

        if(!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid credentials'});
        }

        const token = jwt.sign({id: user.id, role: user.role}, process.env.SECRET_KEY, { expiresIn: '1h'});
        res.json({ message: 'Login successful', token, user: {"id": user.id, "username":user.username}})
    } catch (err) {
        res.status(500).json({ error: 'Login failed', details: err.message});
    }
};


const logout = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(400).json({ error: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const expiryDate = new Date(decoded.exp * 1000);
        console.log('decoded', decoded)
        console.log('expriation date', expiryDate)

        // Store the token and its expiry in the database
        await TokenBlacklist.create({
            token,
            expiry: expiryDate
        });

        res.status(200).json({ message: 'Logout successful' });
    } catch (err) {
        res.status(403).json({ error: 'Invalid token or logout failed', details: err.message });
    }
};


module.exports = { register, login, logout };