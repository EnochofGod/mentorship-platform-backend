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

// Helper to get next date for a given dayOfWeek
function getNextDateOfWeek(dayOfWeek, time) {
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const now = new Date();
  const today = now.getDay();
  const target = daysOfWeek.indexOf(dayOfWeek);
  let daysToAdd = (target - today + 7) % 7;
  if (daysToAdd === 0 && now > new Date(now.toDateString() + ' ' + time)) {
    daysToAdd = 7;
  }
  const nextDate = new Date(now);
  nextDate.setDate(now.getDate() + daysToAdd);
  const [hours, minutes, seconds] = time.split(':');
  nextDate.setHours(parseInt(hours), parseInt(minutes), seconds ? parseInt(seconds) : 0, 0);
  return nextDate.toISOString();
}

// GET /api/availability/me
exports.getMyAvailability = asyncHandler(async (req, res) => {
  const mentorId = req.user.id;
  const slots = await db.Availability.findAll({ where: { mentorId } });
  const result = slots.map(slot => ({
    id: slot.id,
    dayOfWeek: slot.dayOfWeek,
    startTime: slot.startTime,
    endTime: slot.endTime,
    start: getNextDateOfWeek(slot.dayOfWeek, slot.startTime),
    end: getNextDateOfWeek(slot.dayOfWeek, slot.endTime)
  }));
  res.json(result);
});

// GET /api/availability/:mentorId
exports.getMentorAvailability = asyncHandler(async (req, res) => {
  const { mentorId } = req.params;
  const slots = await db.Availability.findAll({ where: { mentorId } });
  const result = slots.map(slot => ({
    id: slot.id,
    dayOfWeek: slot.dayOfWeek,
    startTime: slot.startTime,
    endTime: slot.endTime,
    start: getNextDateOfWeek(slot.dayOfWeek, slot.startTime),
    end: getNextDateOfWeek(slot.dayOfWeek, slot.endTime)
  }));
  res.json(result);
});
