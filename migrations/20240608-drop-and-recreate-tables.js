// Migration to drop and recreate tables with INTEGER IDs
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Drop tables if they exist (order matters due to FKs)
    await queryInterface.dropTable('Sessions', { force: true }).catch(() => {});
    await queryInterface.dropTable('Requests', { force: true }).catch(() => {});
    await queryInterface.dropTable('Availabilities', { force: true }).catch(() => {});
    await queryInterface.dropTable('Profiles', { force: true }).catch(() => {});
    await queryInterface.dropTable('Users', { force: true }).catch(() => {});

    // Recreate Users table
    await queryInterface.createTable('Users', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      role: {
        type: Sequelize.ENUM('Mentee', 'Mentor', 'Admin'),
        defaultValue: 'Mentee',
        allowNull: false,
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });

    // Recreate Profiles table
    await queryInterface.createTable('Profiles', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      userId: {
        type: Sequelize.INTEGER,
        unique: true,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
        onDelete: 'CASCADE',
      },
      name: { type: Sequelize.STRING, defaultValue: '' },
      bio: { type: Sequelize.TEXT, defaultValue: '' },
      skills: { type: Sequelize.JSON, defaultValue: [] },
      goals: { type: Sequelize.TEXT, defaultValue: '' },
      industry: { type: Sequelize.STRING, allowNull: true, defaultValue: '' },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });

    // Recreate Requests table
    await queryInterface.createTable('Requests', {
      id: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true },
      menteeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
        onDelete: 'CASCADE',
      },
      mentorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
        onDelete: 'CASCADE',
      },
      status: { type: Sequelize.ENUM('PENDING', 'ACCEPTED', 'REJECTED'), defaultValue: 'PENDING' },
      message: { type: Sequelize.TEXT },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });

    // Recreate Sessions table
    await queryInterface.createTable('Sessions', {
      id: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true },
      mentorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
        onDelete: 'CASCADE',
      },
      menteeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
        onDelete: 'CASCADE',
      },
      requestId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: { model: 'Requests', key: 'id' },
        onDelete: 'CASCADE',
      },
      scheduledTime: { type: Sequelize.DATE, allowNull: false },
      feedbackMentee: { type: Sequelize.TEXT },
      ratingMentee: { type: Sequelize.INTEGER },
      feedbackMentor: { type: Sequelize.TEXT },
      reminderSent: { type: Sequelize.BOOLEAN, defaultValue: false },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });

    // Recreate Availabilities table
    await queryInterface.createTable('Availabilities', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      mentorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
        onDelete: 'CASCADE',
      },
      dayOfWeek: { type: Sequelize.STRING, allowNull: false },
      startTime: { type: Sequelize.TIME, allowNull: false },
      endTime: { type: Sequelize.TIME, allowNull: false },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
  },
  down: async (queryInterface, Sequelize) => {
    // Drop all tables (reverse migration)
    await queryInterface.dropTable('Sessions');
    await queryInterface.dropTable('Requests');
    await queryInterface.dropTable('Availabilities');
    await queryInterface.dropTable('Profiles');
    await queryInterface.dropTable('Users');
  },
};
