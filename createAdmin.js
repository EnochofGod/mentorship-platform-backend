require('dotenv').config({ path: __dirname + '/.env' });
const { User, Profile, sequelize } = require('./src/models');

const createAdmin = async () => {
  try {
    await sequelize.sync();

    // To ensure a clean slate, destroy the user if it exists
    await User.destroy({
        where: { email: 'admin@example.com' }
    });

    const user = await User.create({
      email: 'admin@example.com',
      password: 'adminpassword',
      role: 'Admin'
    });

    await Profile.create({ userId: user.id });
    console.log('Admin user created successfully.');

  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await sequelize.close();
  }
};

createAdmin();