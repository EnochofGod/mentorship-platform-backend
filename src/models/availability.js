module.exports = (sequelize, DataTypes) => {
  const Availability = sequelize.define('Availability', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    mentorId: { type: DataTypes.UUID, allowNull: false },
    dayOfWeek: { type: DataTypes.STRING, allowNull: false },
    startTime: { type: DataTypes.TIME, allowNull: false },
    endTime: { type: DataTypes.TIME, allowNull: false },
  }, { timestamps: true });

  Availability.associate = (models) => {
    Availability.belongsTo(models.User, { as: 'mentor', foreignKey: 'mentorId' });
  };

  return Availability;
};
