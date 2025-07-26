const { User, Profile, sequelize } = require('../src/models');

async function createMissingProfiles() {
  try {
    await sequelize.authenticate();
    const users = await User.findAll({
      include: [{ model: Profile, as: 'profile' }]
    });

    let createdCount = 0;
    for (const user of users) {
      if (!user.profile) {
        await Profile.create({
          userId: user.id,
          name: user.email, // Use email as default name
          bio: '',
          skills: [],
          goals: '',
          industry: ''
        });
        createdCount++;
        console.log(`Created profile for user: ${user.email}`);
      }
    }
    console.log(`Done! Created ${createdCount} missing profiles.`);
    process.exit(0);
  } catch (err) {
    console.error('Error creating missing profiles:', err);
    process.exit(1);
  }
}

createMissingProfiles();
