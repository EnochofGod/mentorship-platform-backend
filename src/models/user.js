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
      beforeCreate: async (user) => {
        // --- DEBUGGING LOGS FOR PASSWORD HASHING (BEFORE CREATE) ---
        console.log('--- User Model: beforeCreate Hook ---');
        console.log('Original password (first 5 chars):', user.password ? user.password.substring(0, 5) + '...' : 'undefined');
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        console.log('Hashed password (after bcrypt.hash, first 20 chars):', user.password ? user.password.substring(0, 20) + '...' : 'undefined');
        console.log('-------------------------------------');
        // --- END DEBUGGING LOGS ---
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          // --- DEBUGGING LOGS FOR PASSWORD HASHING (BEFORE UPDATE) ---
          console.log('--- User Model: beforeUpdate Hook ---');
          console.log('Original password (before update, first 5 chars):', user.password ? user.password.substring(0, 5) + '...' : 'undefined');
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
          console.log('Hashed password (after bcrypt.hash, first 20 chars):', user.password ? user.password.substring(0, 20) + '...' : 'undefined');
          console.log('-------------------------------------');
          // --- END DEBUGGING LOGS ---
        }
      },
    },
    timestamps: true,
  });

  // Instance method to validate password
  User.prototype.isValidPassword = async function (enteredPassword) {
    // --- DEBUGGING LOGS FOR PASSWORD VALIDATION ---
    console.log('--- User Model: isValidPassword Method ---');
    console.log('Entered password (first 5 chars):', enteredPassword ? enteredPassword.substring(0, 5) + '...' : 'undefined');
    console.log('Stored hashed password (first 20 chars):', this.password ? this.password.substring(0, 20) + '...' : 'undefined');
    const match = await bcrypt.compare(enteredPassword, this.password);
    console.log('bcrypt.compare result:', match);
    console.log('------------------------------------------');
    // --- END DEBUGGING LOGS ---
    return match;
  };

  User.associate = (models) => {
    User.hasOne(models.Profile, {
      foreignKey: 'userId',
      as: 'profile',
      onDelete: 'CASCADE',
    });

  };

  return User;
};
