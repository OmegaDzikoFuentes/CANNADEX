'use strict';
const bcrypt = require('bcryptjs'); // Add this line at the top of the file


/** @type {import('sequelize-cli').Migration} */

const { User } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Users',
      [
        {
          firstName: 'Harry',
          lastName: 'Potter',
          username: 'thechosenone',
          email: 'harry.potter@example.com',
          hashedPassword: bcrypt.hashSync('password1', 10),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          firstName: 'Hermione',
          lastName: 'Granger',
          username: 'hermione_granger',
          email: 'hermione.granger@example.com',
          hashedPassword: bcrypt.hashSync('password2', 10),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          firstName: 'Ron',
          lastName: 'Weasley',
          username: 'ronweasley',
          email: 'ron.weasley@example.com',
          hashedPassword: bcrypt.hashSync('password3', 10),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          firstName: 'Draco',
          lastName: 'Malfoy',
          username: 'draco_malfoy',
          email: 'draco.malfoy@example.com',
          hashedPassword: bcrypt.hashSync('password4', 10),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          firstName: 'Luna',
          lastName: 'Lovegood',
          username: 'luna_lovegood',
          email: 'luna.lovegood@example.com',
          hashedPassword: bcrypt.hashSync('password5', 10),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          firstName: 'Neville',
          lastName: 'Longbottom',
          username: 'nevillelongbottom',
          email: 'neville.longbottom@example.com',
          hashedPassword: bcrypt.hashSync('password6', 10),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      'Users',
      {
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
      },
      {}
    );
  },
};
