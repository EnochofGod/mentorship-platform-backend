const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('Mentee', 'Mentor', 'Admin'),
      defaultValue: 'Mentee',
      allowNull: false,
    },
  }, {
    hooks: {
      // Hash the user's password before saving to the database (on create and update)
      beforeCreate: async (user) => {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
    timestamps: true,
  });

  /**
   * Instance method to validate a user's password
   * @param {string} enteredPassword - The password to validate
   * @returns {Promise<boolean>} - True if the password matches, false otherwise
   */
  User.prototype.isValidPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };

  // Associate User with Profile (one-to-one)
  User.associate = (models) => {
    User.hasOne(models.Profile, {
      foreignKey: 'userId',
      as: 'profile',
      onDelete: 'CASCADE',
    });
  };

  return User;
};
