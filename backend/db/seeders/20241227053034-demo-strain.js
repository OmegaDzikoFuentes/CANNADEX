'use strict';

/** @type {import('sequelize-cli').Migration} */

const { Strain } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await Strain.bulkCreate([
      {
        ownerId: 1, // Assuming 1 is a valid user ID
        flavor: 'Sweet',
        city: 'Los Angeles',
        state: 'CA',
        country: 'USA',
        potency: 0.85,
        shared: true,
        name: 'Sunset OG',
        description: 'A hybrid strain with sweet and relaxing effects.',
        price: 200.00,
        euphoric: true,
        relaxed: true,
        creative: false,
        hungry: true,
        moreSensitiveToLight: false,
        moreSensitiveToColor: false,
        moreSensitiveToSound: true,
        moreSensitiveToTouch: false,
        moreSensitiveToTaste: false,
        moreSensitiveToSmell: true,
      },
      {
        ownerId: 2, // Assuming 2 is another valid user ID
        flavor: 'Earthy',
        city: 'San Francisco',
        state: 'CA',
        country: 'USA',
        potency: 0.92,
        shared: true,
        name: 'Northern Lights',
        description: 'A calming indica strain with earthy undertones.',
        price: 220.00,
        euphoric: false,
        relaxed: true,
        creative: true,
        hungry: false,
        moreSensitiveToLight: true,
        moreSensitiveToColor: false,
        moreSensitiveToSound: false,
        moreSensitiveToTouch: true,
        moreSensitiveToTaste: true,
        moreSensitiveToSmell: false,
      },
      {
        ownerId: 1,
        flavor: 'Citrus',
        city: 'Denver',
        state: 'CO',
        country: 'USA',
        potency: 0.75,
        shared: false,
        name: 'Lemon Haze',
        description: 'A sativa-dominant strain with a strong citrus flavor.',
        price: 180.00,
        euphoric: true,
        relaxed: false,
        creative: true,
        hungry: false,
        moreSensitiveToLight: false,
        moreSensitiveToColor: true,
        moreSensitiveToSound: true,
        moreSensitiveToTouch: false,
        moreSensitiveToTaste: false,
        moreSensitiveToSmell: true,
      },
      {
        ownerId: 2,
        flavor: 'Pine',
        city: 'Portland',
        state: 'OR',
        country: 'USA',
        potency: 0.80,
        shared: false,
        name: 'Pineapple Express',
        description: 'A tropical hybrid with a pine flavor and euphoric effects.',
        price: 250.00,
        euphoric: true,
        relaxed: true,
        creative: true,
        hungry: true,
        moreSensitiveToLight: false,
        moreSensitiveToColor: false,
        moreSensitiveToSound: true,
        moreSensitiveToTouch: true,
        moreSensitiveToTaste: true,
        moreSensitiveToSmell: false,
      }
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Strains';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('Strains', {
      name: {
        [Op.in]: [
          'Sunset OG',
          'Northern Lights',
          'Lemon Haze',
          'Pineapple Express'
        ],
      },
    }, options);
  }
};
