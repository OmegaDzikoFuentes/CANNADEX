'use strict';

/** @type {import('sequelize-cli').Migration} */

const { StrainImage } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await StrainImage.bulkCreate([
      {
        strainId: 1, // Replace with an actual strain ID from your Strains table
        url: 'https://example.com/strain1_image.jpg', // Replace with actual image URL
        preview: true,
        type: 'image',
      },
      {
        strainId: 2, // Replace with an actual strain ID from your Strains table
        url: 'https://example.com/strain2_image.jpg', // Replace with actual image URL
        preview: false,
        type: 'image',
      },
      {
        strainId: 3, // Replace with an actual strain ID from your Strains table
        url: 'https://example.com/strain3_video.mp4', // Replace with actual video URL
        preview: true,
        type: 'video',
      },
      {
        strainId: 4, // Replace with an actual strain ID from your Strains table
        url: 'https://example.com/strain4_image.jpg', // Replace with actual image URL
        preview: false,
        type: 'image',
      },
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'StrainImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('StrainImages', {
      url: {
        [Op.in]: [
          'https://example.com/strain1_image.jpg',
          'https://example.com/strain2_image.jpg',
          'https://example.com/strain3_video.mp4',
          'https://example.com/strain4_image.jpg',
        ],
      },
    }, options);
  }
};
