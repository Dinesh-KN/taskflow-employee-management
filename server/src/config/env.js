import dotenv from 'dotenv';

dotenv.config();

const requiredEnvVars = [
  'NODE_ENV',
  'PORT',
  'MONGO_URI',
  'CLIENT_ORIGIN',
  'BCRYPT_SALT_ROUNDS',
  'TEMP_PASSWORD_EXPIRES_IN_HOURS',
  'JWT_ACCESS_SECRET',
  'JWT_ACCESS_EXPIRES_IN',
  'JWT_REFRESH_SECRET',
  'JWT_REFRESH_EXPIRES_IN',
  'SEED_ADMIN_FIRST_NAME',
  'SEED_ADMIN_LAST_NAME',
  'SEED_ADMIN_EMAIL',
  'SEED_ADMIN_PASSWORD',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
];

requiredEnvVars.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});

export const env = {
  nodeEnv: process.env.NODE_ENV,
  port: process.env.PORT,
  mongoUri: process.env.MONGO_URI,

  clientOrigin: process.env.CLIENT_ORIGIN,

  bcryptSaltRounds: Number(process.env.BCRYPT_SALT_ROUNDS),

  tempPasswordExpiresInHours: Number(
    process.env.TEMP_PASSWORD_EXPIRES_IN_HOURS,
  ),

  accessTokenSecret: process.env.JWT_ACCESS_SECRET,
  accessTokenExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN,

  refreshTokenSecret: process.env.JWT_REFRESH_SECRET,
  refreshTokenExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN,

  seedAdminFirstName: process.env.SEED_ADMIN_FIRST_NAME,
  seedAdminLastName: process.env.SEED_ADMIN_LAST_NAME,
  seedAdminEmail: process.env.SEED_ADMIN_EMAIL,
  seedAdminPassword: process.env.SEED_ADMIN_PASSWORD,

  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
    profilePhotoFolder:
      process.env.CLOUDINARY_PROFILE_PHOTO_FOLDER || 'taskflow/avatars',
  },
};
