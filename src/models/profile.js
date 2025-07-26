
module.exports = (sequelize, DataTypes) => {
    
    const Profile = sequelize.define('Profile', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        userId: {
            type: DataTypes.UUID,
            unique: true,
            allowNull: false
        },
    
        name: {
            type: DataTypes.STRING,
            defaultValue: ''
        },
        bio: {
            type: DataTypes.TEXT,
            defaultValue: ''
        },
        skills: {
            type: DataTypes.JSON,
            defaultValue: []
        },
        goals: {
            type: DataTypes.TEXT,
            defaultValue: ''
        },
        industry: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: ''
        }
    });
    Profile.associate = (models) => {
        Profile.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    };

    return Profile;
};