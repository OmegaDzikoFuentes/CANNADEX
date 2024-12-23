// backend/config/database.js
const config = require('./index');

module.exports = {
  development: {
    storage: config.dbFile, // Ensure this is defined in index.js or .env
    dialect: "sqlite",
    seederStorage: "sequelize",
    logQueryParameters: true,
    typeValidation: true
  },
  test: {
    storage: config.dbTestFile || ':memory:', // Using an in-memory database for tests
    dialect: "sqlite",
    seederStorage: "sequelize",
    logQueryParameters: false,
    typeValidation: true
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    seederStorage: 'sequelize',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false // Ensures SSL is used and unauthorized SSL connections are rejected
      }
    },
    define: {
      schema: process.env.SCHEMA // Schema from environment variable
    }
  }
};
