export const SETTINGS = {
  PORT: process.env.PORT || 5000,

  MONGO_URL: process.env.MONGO_URL || 'mongodb://localhost:27017/incubator-hw',
  DB_NAME: process.env.DB_NAME || 'incubator-hw',

  AC_SECRET: process.env.AC_SECRET || 'some-secretest-key',
  AC_TIME: process.env.AC_TIME || '1h',

  ADMIN_USERNAME: process.env.ADMIN_USERNAME || 'admin',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'qwerty',
};
