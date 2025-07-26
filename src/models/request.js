module.exports = (sequelize, DataTypes) => {
  const Request = sequelize.define('Request', {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    menteeId: { type: DataTypes.UUID, allowNull: false },
    mentorId: { type: DataTypes.UUID, allowNull: false },
    status: { type: DataTypes.ENUM('PENDING', 'ACCEPTED', 'REJECTED'), defaultValue: 'PENDING' },
    message: { type: DataTypes.TEXT },
  }, { timestamps: true });

  Request.associate = (models) => {
    Request.belongsTo(models.User, { as: 'mentee', foreignKey: 'menteeId' });
    Request.belongsTo(models.User, { as: 'mentor', foreignKey: 'mentorId' });
  };

  return Request;
};
