const { Sequelize, DataTypes } = require('sequelize');
const dbConfig = require('../config/database');    
const env = process.env.NODE_ENV || 'development';
const config = dbConfig[env];  
const sequelize = require('./db');
const UserModel = require('./user');
const ProfileModel = require('./profile');
const RequestModel = require('./request');
const SessionModel = require('./session');
const AvailabilityModel = require('./availability');
const ResetTokenModel = require('./resetToken');

const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.User = UserModel(sequelize, DataTypes);
db.Profile = ProfileModel(sequelize, DataTypes);
db.Request = RequestModel(sequelize, DataTypes);
db.Session = SessionModel(sequelize, DataTypes);
db.Availability = AvailabilityModel(sequelize, DataTypes);
db.ResetToken = ResetTokenModel(sequelize, DataTypes);

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;