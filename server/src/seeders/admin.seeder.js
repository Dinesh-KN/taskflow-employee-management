import { connectDB } from '../config/db.js';
import { env } from '../config/env.js';
import { USER_ROLES } from '../shared/constants/user.constants.js';
import { User } from '../modules/users/user.model.js';

const seedAdmin = async () => {
  try {
    await connectDB();

    const existingAdmin = await User.findOne({ email: env.seedAdminEmail });

    if (existingAdmin) {
      console.log('Admin account already exists');
      process.exit(0);
    }

    await User.create({
      firstName: env.seedAdminFirstName,
      lastName: env.seedAdminLastName,
      email: env.seedAdminEmail,
      password: env.seedAdminPassword,
      role: USER_ROLES.ADMIN,
      mustChangePassword: false,
    });

    console.log('Admin account created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Admin seeding failed:', error.message);
    process.exit(1);
  }
};

seedAdmin();