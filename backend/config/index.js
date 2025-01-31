// backend/config/index.js
require('dotenv').config();
console.log('DB_FILE:index.js', process.env.DB_FILE);
module.exports = {
    environment: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000,
    dbFile: process.env.DB_FILE || '.env',
    jwtConfig: {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN
    }
  };
