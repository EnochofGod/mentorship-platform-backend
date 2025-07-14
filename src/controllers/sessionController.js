const db = require('../models');
const asyncHandler = require('express-async-handler');

// POST /api/sessions
exports.bookSession = asyncHandler(async (req, res) => {
  const { mentorId, requestId, scheduledTime } = req.body;
  const menteeId = req.user.id;
  if (!mentorId || !requestId || !scheduledTime) return res.status(400).json({ message: 'All fields required' });
  const request = await db.Request.findByPk(requestId);

  if (!request || request.status !== 'ACCEPTED' || request.menteeId !== menteeId || request.mentorId !== mentorId) {
    return res.status(403).json({ message: 'Cannot book session for this request.' });
  }

  const session = await db.Session.create({ mentorId, menteeId, requestId, scheduledTime });
  res.status(201).json(session);
});

// GET /api/sessions/mentor
exports.getMentorSessions = asyncHandler(async (req, res) => {
  const sessions = await db.Session.findAll({ where: { mentorId: req.user.id } });
  const result = sessions.map(session => ({
    ...session.toJSON(),
    scheduledTime: session.scheduledTime && typeof session.scheduledTime.toISOString === 'function'
      ? session.scheduledTime.toISOString()
      : (session.scheduledTime ? new Date(session.scheduledTime).toISOString() : null)
  }));
  res.json(result);
});

// GET /api/sessions/mentee
exports.getMenteeSessions = asyncHandler(async (req, res) => {
  const sessions = await db.Session.findAll({ where: { menteeId: req.user.id } });
  const result = sessions.map(session => ({
    ...session.toJSON(),
    scheduledTime: session.scheduledTime ? new Date(session.scheduledTime).toISOString() : null
  }));
  res.json(result);
});

// PUT /api/sessions/:id/feedback
exports.submitFeedback = asyncHandler(async (req, res) => {
  const { rating, feedback, role } = req.body;
  const session = await db.Session.findByPk(req.params.id);
  if (!session) return res.status(404).json({ message: 'Session not found' });
  if (role === 'Mentee' && session.menteeId === req.user.id) {
    session.ratingMentee = rating;
    session.feedbackMentee = feedback;
  } else if (role === 'Mentor' && session.mentorId === req.user.id) {
    session.feedbackMentor = feedback;
  } else {
    return res.status(403).json({ message: 'Not authorized' });
  }
  await session.save();
  res.json(session);
});
