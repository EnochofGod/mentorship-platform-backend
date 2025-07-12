const { Sequelize } = require('sequelize');

console.log('--- src/models/db.js - Database Environment Variables ---');
console.log('DB_NAME (from env):', process.env.DB_NAME);
console.log('DB_USER (from env):', process.env.DB_USER);
console.log('DB_PASS (from env, first 5 chars):', process.env.DB_PASS ? process.env.DB_PASS.substring(0, 5) + '...' : 'undefined');
console.log('DB_HOST (from env):', process.env.DB_HOST);
console.log('DB_PORT (from env):', process.env.DB_PORT);
console.log('---------------------------------------------------------');


const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false, 
    dialectOptions: {
    }
  }
);

module.exports = sequelize;
