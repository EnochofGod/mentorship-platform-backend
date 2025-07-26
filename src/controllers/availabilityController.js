const db = require('../models');
const asyncHandler = require('express-async-handler');

// POST /api/availability
exports.setAvailability = asyncHandler(async (req, res) => {
  const { dayOfWeek, startTime, endTime } = req.body;
  const mentorId = req.user.id;
  if (!dayOfWeek || !startTime || !endTime) return res.status(400).json({ message: 'All fields required' });
  const availability = await db.Availability.create({ mentorId, dayOfWeek, startTime, endTime });
  res.status(201).json(availability);
});

// GET /api/availability/me
exports.getMyAvailability = asyncHandler(async (req, res) => {
  const mentorId = req.user.id;
  const slots = await db.Availability.findAll({ where: { mentorId } });
  res.json(slots);
});

// GET /api/availability/:mentorId
exports.getMentorAvailability = asyncHandler(async (req, res) => {
  const { mentorId } = req.params;
  const slots = await db.Availability.findAll({ where: { mentorId } });
  res.json(slots);
});
