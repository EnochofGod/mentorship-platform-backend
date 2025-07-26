const db = require('../models');
const asyncHandler = require('express-async-handler');

// GET /api/admin/users
exports.getAllUsers = asyncHandler(async (req, res) => {
  const users = await db.User.findAll();
  res.json(users);
});

// PUT /api/admin/users/:id/role
exports.updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  const user = await db.User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  user.role = role;
  await user.save();
  res.json(user);
});

// GET /api/admin/matches
exports.getAllMatches = asyncHandler(async (req, res) => {
  const matches = await db.Request.findAll({ where: { status: 'ACCEPTED' }, include: ['mentee', 'mentor'] });
  res.json(matches);
});

// GET /api/admin/sessions
exports.getAllSessions = asyncHandler(async (req, res) => {
  const sessions = await db.Session.findAll();
  res.json(sessions);
});

// POST /api/admin/assign
exports.assignMentorToMentee = asyncHandler(async (req, res) => {
  const { mentorId, menteeId } = req.body;
  if (!mentorId || !menteeId) return res.status(400).json({ message: 'mentorId and menteeId required' });
  let request = await db.Request.findOne({
    where: { menteeId, mentorId, status: 'PENDING' },
  });

  if (request) {
    request.status = 'ACCEPTED';
    await request.save();
  } else {
    request = await db.Request.create({ mentorId, menteeId, status: 'ACCEPTED' });
  }
  res.status(201).json(request);
});
