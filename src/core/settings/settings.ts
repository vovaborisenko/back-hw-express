import { env } from 'node:process';

export const SETTINGS = {
  PORT: env.PORT || 5000,

  MONGO_URL: env.MONGO_URL || '',
  DB_NAME: env.DB_NAME || '',

  AC_SECRET: env.AC_SECRET || '',
  AC_TIME: Number(env.AC_TIME) || 1e4,
  REFRESH_SECRET: env.REFRESH_SECRET || '',
  REFRESH_TIME: Number(env.REFRESH_TIME) || 1e6,

  ADMIN_USERNAME: env.ADMIN_USERNAME || '',
  ADMIN_PASSWORD: env.ADMIN_PASSWORD || '',

  EMAIL: env.EMAIL || '',
  EMAIL_NAME: env.EMAIL_NAME || '',
  EMAIL_PASSWORD: env.EMAIL_PASSWORD || '',

  RATE_LIMIT_MAX_ATTEMPTS: Number(env.RATE_LIMIT_MAX_ATTEMPTS) || 5,
  RATE_LIMIT_PERIOD: Number(env.RATE_LIMIT_PERIOD) || 1e4,
};
