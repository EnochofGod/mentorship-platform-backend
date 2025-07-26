require('dotenv').config();
const db = require('./src/models');
const app = require('./src/app');
// Start session reminder job
require('./src/jobs/sessionReminderJob');

const PORT = process.env.PORT || 5000;
db.sequelize.sync({ force: false }).then(() => {
        console.log('Database synced successfully.');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`Access the API at http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('Unable to connect to the database or sync models:', err);
    });