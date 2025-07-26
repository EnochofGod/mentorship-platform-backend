// Script to add the reminderSent column to the Session table if it doesn't exist
const { Sequelize } = require('sequelize');
require('dotenv').config({ path: '../.env' });

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  logging: false,
});

async function addReminderSentColumn() {
  try {
    const [results] = await sequelize.query("SHOW COLUMNS FROM `Sessions` LIKE 'reminderSent'");
    if (results.length === 0) {
      console.log('Adding reminderSent column to Sessions table...');
      await sequelize.query("ALTER TABLE `Sessions` ADD COLUMN `reminderSent` BOOLEAN DEFAULT FALSE");
      console.log('reminderSent column added successfully.');
    } else {
      console.log('reminderSent column already exists.');
    }
  } catch (err) {
    console.error('Error updating Sessions table:', err);
  } finally {
    await sequelize.close();
  }
}

addReminderSentColumn();
