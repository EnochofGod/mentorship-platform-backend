const { Sequelize } = require('sequelize');
const dbConfig = require('../config/database');
const env = process.env.NODE_ENV || 'development';
const config = dbConfig[env];
const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect,
  logging: false
});
module.exports = sequelize;
