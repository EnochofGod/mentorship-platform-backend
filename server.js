require('dotenv').config(); 

const express = require('express');
const { Sequelize, DataTypes } = require('sequelize'); 
const cors = require('cors');

const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const requestRoutes = require('./src/routes/requestRoutes');
const sessionRoutes = require('./src/routes/sessionRoutes');
const availabilityRoutes = require('./src/routes/availabilityRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const errorHandler = require('./src/utils/errorHandler');
const db = require('./src/models');


const app = express();
const PORT = process.env.PORT || 8080; // 
console.log('--- Database Environment Variables (from process.env) ---');
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASS (first 5 chars):', process.env.DB_PASS ? process.env.DB_PASS.substring(0, 5) + '...' : 'undefined');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('-------------------------------------------------------');

const allowedOrigins = [
    'http://localhost:3000', 
    'https://enochofgod.github.io',
    'https://mentorship-platform-backend-production.up.railway.app' 
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions)); 
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

db.sequelize.sync({ force: false })
    .then(() => {
        console.log('Database synced successfully. Tables created/updated.');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`Access the API at http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('Unable to connect to the database or sync models:', err);
        process.exit(1);
    });
