const express = require('express');
const cors = require('cors');
const errorHandler = require('./utils/errorHandler');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const requestRoutes = require('./routes/requestRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const availabilityRoutes = require('./routes/availabilityRoutes');
const adminRoutes = require('./routes/adminRoutes');
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/admin', adminRoutes);
app.get('/', (req, res) => {
    res.send('Mentorship Platform Backend API is running!');
});
app.use(errorHandler);

module.exports = app;