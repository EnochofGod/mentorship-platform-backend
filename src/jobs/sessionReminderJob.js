const cron = require('node-cron');
const { Session, User } = require('../models');
const nodemailer = require('nodemailer');
const { Op } = require('sequelize');
const moment = require('moment');

// Configure nodemailer (reuse your existing config if available)
const transporter = nodemailer.createTransport({
  service: 'gmail', // or your email provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendReminderEmail = async (to, subject, text) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  });
};

// Run every 10 minutes
cron.schedule('*/10 * * * *', async () => {
  try {
    const now = moment();
    const inOneHour = moment().add(1, 'hour');
    const sessions = await Session.findAll({
      where: {
        scheduledTime: {
          [Op.between]: [now.toDate(), inOneHour.toDate()]
        },
        reminderSent: false
      },
      include: [
        { model: User, as: 'mentor', attributes: ['email'] },
        { model: User, as: 'mentee', attributes: ['email'] }
      ]
    });
    for (const session of sessions) {
      // Send to mentor
      if (session.mentor && session.mentor.email) {
        await sendReminderEmail(
          session.mentor.email,
          'Upcoming Mentorship Session Reminder',
          `You have a mentorship session scheduled at ${moment(session.scheduledTime).format('LLLL')}.`
        );
      }
      // Send to mentee
      if (session.mentee && session.mentee.email) {
        await sendReminderEmail(
          session.mentee.email,
          'Upcoming Mentorship Session Reminder',
          `You have a mentorship session scheduled at ${moment(session.scheduledTime).format('LLLL')}.`
        );
      }
      session.reminderSent = true;
      await session.save();
    }
    if (sessions.length > 0) {
      console.log(`Sent reminders for ${sessions.length} sessions.`);
    }
  } catch (err) {
    console.error('Error sending session reminders:', err);
  }
});

module.exports = {};
