'use strict';

/** @type {import('sequelize-cli').Migration} */

const { User } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await User.bulkCreate([
      {
        firstName: 'Harry',
        lastName: 'Potter',
        username: 'thechosenone',
        email: 'harry.potter@example.com',
        hashedPassword: 'hashedpassword1', // This should be a hashed password
      },
      {
        firstName: 'Hermione',
        lastName: 'Granger',
        username: 'hermione_granger',
        email: 'hermione.granger@example.com',
        hashedPassword: 'hashedpassword2', // This should be a hashed password
      },
      {
        firstName: 'Ron',
        lastName: 'Weasley',
        username: 'ronweasley',
        email: 'ron.weasley@example.com',
        hashedPassword: 'hashedpassword3', // This should be a hashed password
      },
      {
        firstName: 'Draco',
        lastName: 'Malfoy',
        username: 'draco_malfoy',
        email: 'draco.malfoy@example.com',
        hashedPassword: 'hashedpassword4', // This should be a hashed password
      },
      {
        firstName: 'Luna',
        lastName: 'Lovegood',
        username: 'luna_lovegood',
        email: 'luna.lovegood@example.com',
        hashedPassword: 'hashedpassword5', // This should be a hashed password
      },
      {
        firstName: 'Neville',
        lastName: 'Longbottom',
        username: 'nevillelongbottom',
        email: 'neville.longbottom@example.com',
        hashedPassword: 'hashedpassword6', // This should be a hashed password
      },
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('Users', {
      username: {
        [Op.in]: [
          'thechosenone',
          'hermione_granger',
          'ronweasley',
          'draco_malfoy',
          'luna_lovegood',
          'nevillelongbottom',
        ],
      },
    }, options);
  }
};
