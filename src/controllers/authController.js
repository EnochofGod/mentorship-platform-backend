const asyncHandler = require('express-async-handler');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const { User, Profile, ResetToken } = require('../models');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const { jwtSecret, jwtExpiresIn } = require('../config/jwt');



// Use environment variables for email configuration
const EMAIL_HOST = process.env.EMAIL_HOST || 'smtp.gmail.com';
const EMAIL_PORT = process.env.EMAIL_PORT || 587;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const EMAIL_FROM = process.env.EMAIL_FROM || `MentorMatch <${EMAIL_USER}>`;


/**
 * Send a password reset email to the user
 * @param {string} email - User's email address
 * @param {string} token - Password reset token
 */
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

    // Updated to match the correct deployed frontend URL
    const resetUrl = `https://enochofgod.github.io/mentorship-hub/reset-password?token=${token}`;
    await transporter.sendMail({
        from: EMAIL_FROM,
        to: email,
        subject: 'MentorMatch Password Reset',
        html: `<p>You requested a password reset for MentorMatch.</p><p>Click <a href="${resetUrl}">here</a> to reset your password, or copy and paste this link into your browser:</p><p>${resetUrl}</p>`
    });
};

/**
 * Generate a JWT token for authentication
 * @param {number} id - User ID
 * @returns {string} - JWT token
 */
const generateToken = (id) => {
    return jwt.sign({ id }, jwtSecret, {
        expiresIn: jwtExpiresIn,
    });
};

/**
 * Register a new user and create a profile
 * @route POST /api/auth/register
 */
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
        try {
            const profile = await Profile.create({ userId: user.id });
            res.status(201).json({
                id: user.id,
                email: user.email,
                role: user.role,
                token: generateToken(user.id),
            });
        } catch (profileError) {
            res.status(500);
            throw new Error('User registered, but failed to create profile: ' + profileError.message);
        }
    } else {
        res.status(400);
        throw new Error('Invalid user data provided.');
    }
});

/**
 * Authenticate a user and return a JWT token
 * @route POST /api/auth/login
 */
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
        res.status(400);
        throw new Error('Invalid email or password.');
    }
    const isMatch = await user.isValidPassword(password);
    if (!isMatch) {
        res.status(400);
        throw new Error('Invalid email or password.');
    }
    res.json({
        id: user.id,
        email: user.email,
        role: user.role,
        token: generateToken(user.id),
    });
});

/**
 * Get the current authenticated user
 * @route GET /api/auth/me
 */
const getMe = asyncHandler(async (req, res) => {
    if (req.user) {
        res.status(200).json(req.user);
    } else {
        res.status(404);
        throw new Error('User not found in request context.');
    }
});

/**
 * Send a password reset email if the user exists
 * @route POST /api/auth/forgot-password
 */
const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: 'Email is required.' });
    }
    const user = await User.findOne({ where: { email } });
    if (!user) {
        return res.status(200).json({ message: 'If that email is registered, a reset link will be sent.' });
    }
    const token = crypto.randomBytes(32).toString('hex');
    await ResetToken.create({
        email,
        token,
        expiresAt: new Date(Date.now() + 3600000),
    });
    await sendResetEmail(email, token);
    return res.status(200).json({ message: 'If that email is registered, a reset link will be sent.' });
});

/**
 * Reset a user's password using a valid reset token
 * @route POST /api/auth/reset-password
 */
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
    user.password = password;
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
