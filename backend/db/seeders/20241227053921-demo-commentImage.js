'use strict';

/** @type {import('sequelize-cli').Migration} */

const { CommentImage } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await CommentImage.bulkCreate([
      {
        commentId: 1, // Replace with an actual comment ID from your Comments table
        url: 'https://example.com/comment1_image.jpg', // Replace with actual image URL
      },
      {
        commentId: 2, // Replace with an actual comment ID from your Comments table
        url: 'https://example.com/comment2_image.jpg', // Replace with actual image URL
      },
      {
        commentId: 3, // Replace with an actual comment ID from your Comments table
        url: 'https://example.com/comment3_image.jpg', // Replace with actual image URL
      },
      {
        commentId: 4, // Replace with an actual comment ID from your Comments table
        url: 'https://example.com/comment4_image.jpg', // Replace with actual image URL
      },
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'CommentImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('CommentImages', {
      url: {
        [Op.in]: [
          'https://example.com/comment1_image.jpg',
          'https://example.com/comment2_image.jpg',
          'https://example.com/comment3_image.jpg',
          'https://example.com/comment4_image.jpg',
        ],
      },
    }, options);
  }
};
