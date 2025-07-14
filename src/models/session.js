module.exports = (sequelize, DataTypes) => {
  const Session = sequelize.define('Session', {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    mentorId: { type: DataTypes.INTEGER, allowNull: false },
    menteeId: { type: DataTypes.INTEGER, allowNull: false },
    requestId: { type: DataTypes.BIGINT, allowNull: false },
    scheduledTime: { type: DataTypes.DATE, allowNull: false },
    feedbackMentee: { type: DataTypes.TEXT },
    ratingMentee: { type: DataTypes.INTEGER },
    feedbackMentor: { type: DataTypes.TEXT },
    reminderSent: { type: DataTypes.BOOLEAN, defaultValue: false },
  }, { timestamps: true });

  Session.associate = (models) => {
    Session.belongsTo(models.User, { as: 'mentor', foreignKey: 'mentorId' });
    Session.belongsTo(models.User, { as: 'mentee', foreignKey: 'menteeId' });
    Session.belongsTo(models.Request, { as: 'request', foreignKey: 'requestId' });
  };

  return Session;
};
