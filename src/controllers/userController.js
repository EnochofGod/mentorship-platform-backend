const { User, Profile } = require('../models');
const asyncHandler = require('express-async-handler');

const updateMyProfile = asyncHandler(async (req, res) => {
    const { name, bio, skills, goals, industry } = req.body;
    const userId = req.user.id;
    let profile = await Profile.findOne({ where: { userId } });
    if (!profile) {
        res.status(404);
        throw new Error('Profile not found for this user.');
    }
    profile.name = name !== undefined ? name : profile.name;
    profile.bio = bio !== undefined ? bio : profile.bio;
    profile.skills = skills !== undefined ? (Array.isArray(skills) ? skills : []) : profile.skills;
    profile.goals = goals !== undefined ? goals : profile.goals;
    profile.industry = industry !== undefined ? industry : profile.industry;
    await profile.save();
    res.status(200).json({
        message: 'Profile updated successfully!',
        profile: {
            id: profile.id,
            userId: profile.userId,
            name: profile.name,
            bio: profile.bio,
            skills: profile.skills,
            goals: profile.goals,
            industry: profile.industry
        }
    });
});

const getMyProfile = asyncHandler(async (req, res) => {
    if (req.user && req.user.profile) {
        res.status(200).json({
            id: req.user.id,
            email: req.user.email,
            role: req.user.role,
            profile: {
                id: req.user.profile.id,
                name: req.user.profile.name,
                bio: req.user.profile.bio,
                skills: req.user.profile.skills,
                goals: req.user.profile.goals,
                industry: req.user.profile.industry,
            }
        });
    } else {
        res.status(404);
        throw new Error('User profile not found.');
    }
});

// Get all mentors (public directory)
const getMentors = asyncHandler(async (req, res) => {
    const mentors = await User.findAll({
        where: { role: 'Mentor' },
        include: [
            {
                model: Profile,
                as: 'profile',
                attributes: ['id', 'name', 'bio', 'skills', 'goals', 'industry']
            }
        ],
        attributes: ['id', 'email', 'role']
    });
    res.status(200).json(mentors);
});
const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findByPk(req.params.id, {
        include: [
            {
                model: Profile,
                as: 'profile',
                attributes: ['id', 'name', 'bio', 'skills', 'goals', 'industry']
            }
        ],
        attributes: ['id', 'email', 'role']
    });

    if (user) {
        res.status(200).json(user);
    } else {
        res.status(404);
        throw new Error('User not found.');
    }
});

module.exports = {
    updateMyProfile,
    getMyProfile,
    getMentors,
    getUserById
};