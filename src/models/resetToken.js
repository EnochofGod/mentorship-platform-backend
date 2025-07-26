module.exports = (sequelize, DataTypes) => {
    const ResetToken = sequelize.define('ResetToken', {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        token: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        expiresAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    });

    return ResetToken;
};