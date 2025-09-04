'use strict';

// Sequelize CLI configuration powered by environment variables (.env)
// Supports DATABASE_URL (preferred for Neon) or discrete variables

require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';

function computeSslEnabled(databaseUrl) {
  const urlIndicatesSsl = typeof databaseUrl === 'string' && /sslmode=require/i.test(databaseUrl);
  return (
    urlIndicatesSsl ||
    process.env.DB_SSL === 'true' ||
    process.env.PGSSLMODE === 'require' ||
    (isProduction && process.env.DB_SSL !== 'false')
  );
}

function envConfig() {
  const databaseUrl =
    process.env.DATABASE_URL_MIGRATIONS || process.env.DATABASE_URL || process.env.DB_URL;
  const useEnvVarName = process.env.DATABASE_URL_MIGRATIONS
    ? 'DATABASE_URL_MIGRATIONS'
    : (process.env.DATABASE_URL ? 'DATABASE_URL' : (process.env.DB_URL ? 'DB_URL' : undefined));
  const sslEnabled = computeSslEnabled(databaseUrl);
  if (databaseUrl && useEnvVarName) {
    return {
      use_env_variable: useEnvVarName,
      dialect: 'postgres',
      dialectOptions: sslEnabled ? { ssl: { require: true, rejectUnauthorized: false } } : {},
    };
  }

  return {
    username: process.env.DB_USERNAME || process.env.DB_USER,
    password: process.env.DB_PASSWORD || process.env.DB_PASS,
    database: process.env.DB_DATABASE || process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 5432),
    dialect: 'postgres',
    dialectOptions: sslEnabled ? { ssl: { require: true, rejectUnauthorized: false } } : {},
  };
}

module.exports = {
  development: envConfig(),
  test: envConfig(),
  production: envConfig(),
};


