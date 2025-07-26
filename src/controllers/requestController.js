const db = require('../models');
const asyncHandler = require('express-async-handler');

// POST /api/requests
exports.createRequest = asyncHandler(async (req, res) => {
  const { mentorId, message } = req.body;
  const menteeId = req.user.id;
  if (!mentorId) return res.status(400).json({ message: 'mentorId required' });
  const existingRequest = await db.Request.findOne({
    where: { menteeId, mentorId, status: 'PENDING' },
  });

  if (existingRequest) {
    return res.status(409).json({ message: 'A pending request already exists with this mentor.' });
  }

  const request = await db.Request.create({ menteeId, mentorId, message });
  res.status(201).json(request);
});

// GET /api/requests/sent
exports.getSentRequests = asyncHandler(async (req, res) => {
  const requests = await db.Request.findAll({ where: { menteeId: req.user.id }, include: ['mentor'] });
  res.json(requests);
});

// GET /api/requests/received
exports.getReceivedRequests = asyncHandler(async (req, res) => {
  const requests = await db.Request.findAll({ where: { mentorId: req.user.id }, include: ['mentee'] });
  res.json(requests);
});

// PUT /api/requests/:id
exports.updateRequestStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const request = await db.Request.findByPk(req.params.id);
  if (!request || request.mentorId !== req.user.id) return res.status(404).json({ message: 'Request not found' });
  if (!['ACCEPTED', 'REJECTED'].includes(status)) return res.status(400).json({ message: 'Invalid status' });
  request.status = status;
  await request.save();
  res.json(request);
});
