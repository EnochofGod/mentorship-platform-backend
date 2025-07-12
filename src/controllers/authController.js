
const asyncHandler = require('express-async-handler');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const { User, Profile, ResetToken } = require('../models'); 
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');

const { jwtSecret, jwtExpiresIn } = require('../config/jwt');
console.log('--- authController.js - Imported JWT_SECRET ---');
console.log('jwtSecret (from config/jwt):', jwtSecret ? jwtSecret.substring(0, 10) + '...' : 'undefined');
console.log('Is jwtSecret defined and non-empty?', !!jwtSecret);
console.log('Length of jwtSecret:', jwtSecret ? jwtSecret.length : 'N/A');
console.log('-----------------------------------------------');



const {
    EMAIL_HOST,
    EMAIL_PORT,
    EMAIL_USER,
    EMAIL_PASS,
    EMAIL_FROM
} = process.env;


const sendResetEmail = async (email, token) => {
    const transporter = nodemailer.createTransport({
        host: EMAIL_HOST,
        port: EMAIL_PORT,
        secure: false, 
        auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASS,
        },
    });
  
    const resetUrl = `https://enochofgod.github.io/mentorship-matching-platform/reset-password?token=${token}`;
    await transporter.sendMail({
        from: EMAIL_FROM || EMAIL_USER,
        to: email,
        subject: 'MentorMatch Password Reset',
        html: `<p>You requested a password reset for MentorMatch.</p><p>Click <a href="${resetUrl}">here</a> to reset your password, or copy and paste this link into your browser:</p><p>${resetUrl}</p>`
    });
};

const generateToken = (id) => {
    return jwt.sign({ id }, jwtSecret, { // Using the imported jwtSecret
        expiresIn: jwtExpiresIn,
    });
};

const registerUser = asyncHandler(async (req, res) => {
    const { email, password, role } = req.body;
    if (!email || !password) {
        res.status(400);
        throw new Error('Please enter all required fields (email, password).');
    }
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
        res.status(400);
        throw new Error('User with that email already exists.');
    }
    const user = await User.create({ email, password, role: role || 'Mentee' });
    if (user) {
        await Profile.create({ userId: user.id });
        res.status(201).json({
            id: user.id,
            email: user.email,
            role: user.role,
            token: generateToken(user.id),
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data provided.');
    }
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
        res.status(400); // Changed from 401 to 400 for 'Invalid credentials'
        throw new Error('Invalid email or password.');
    }
    if (!(await user.isValidPassword(password))) {
        res.status(400); // Changed from 401 to 400 for 'Invalid credentials'
        throw new Error('Invalid email or password.');
    }

    // If user and password are valid
    res.json({
        id: user.id,
        email: user.email,
        role: user.role,
        token: generateToken(user.id),
    });
});

const getMe = asyncHandler(async (req, res) => {
    if (req.user) {
        res.status(200).json(req.user);
    } else {
        res.status(404);
        throw new Error('User not found in request context.');
    }
});

const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: 'Email is required.' });
    }
    const user = await User.findOne({ where: { email } });
    if (!user) {
        // For security, do not reveal if user exists
        return res.status(200).json({ message: 'If that email is registered, a reset link will be sent.' });
    }
    // Generate token and store (for demo; use DB in production)
    const token = crypto.randomBytes(32).toString('hex');
    await ResetToken.create({
        email,
        token,
        expiresAt: new Date(Date.now() + 3600000), // Expires in 1 hour
    });
    await sendResetEmail(email, token);
    return res.status(200).json({ message: 'If that email is registered, a reset link will be sent.' });
});

const resetPassword = asyncHandler(async (req, res) => {
    const { token, password } = req.body;
    if (!token || !password) {
        return res.status(400).json({ message: 'Token and new password are required.' });
    }
    const resetToken = await ResetToken.findOne({ where: { token, expiresAt: { [Op.gt]: new Date() } } });
    if (!resetToken) {
        return res.status(400).json({ message: 'Invalid or expired token.' });
    }
    const user = await User.findOne({ where: { email: resetToken.email } });
    if (!user) {
        return res.status(404).json({ message: 'User not found.' });
    }
    user.password = password; // Password hashing is handled by User model hook
    await user.save();
    await resetToken.destroy();
    return res.status(200).json({ message: 'Password has been reset successfully.' });
});


module.exports = {
    registerUser,
    loginUser,
    getMe,
    forgotPassword,
    resetPassword,
};
