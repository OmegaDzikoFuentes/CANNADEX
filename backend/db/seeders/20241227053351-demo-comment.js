'use strict';

/** @type {import('sequelize-cli').Migration} */

const { Comment } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await Comment.bulkCreate([
      {
        strainId: 1, // Replace with an actual strain ID from your Strains table
        userId: 1, // Replace with an actual user ID from your Users table
        comment: 'This strain works wonders for my anxiety!',
        stars: 5,
        dose: 'Moderate',
        strain: 'Sativa-dominant',
        potency: 'High',
        methodOfUse: 'Vaping',
        frequencyOfUse: 'Daily',
        age: '25-35',
        gender: 'Male',
        physiology: 'Healthy',
      },
      {
        strainId: 2, // Replace with an actual strain ID from your Strains table
        userId: 2, // Replace with an actual user ID from your Users table
        comment: 'Really helps with pain relief but makes me feel drowsy.',
        stars: 4,
        dose: 'High',
        strain: 'Indica-dominant',
        potency: 'Medium',
        methodOfUse: 'Smoking',
        frequencyOfUse: 'Weekly',
        age: '36-45',
        gender: 'Female',
        physiology: 'Chronic pain',
      },
      {
        strainId: 3, // Replace with an actual strain ID from your Strains table
        userId: 3, // Replace with an actual user ID from your Users table
        comment: 'Gives me a great mood boost, but I feel a bit jittery afterward.',
        stars: 3,
        dose: 'Low',
        strain: 'Hybrid',
        potency: 'Low',
        methodOfUse: 'Edibles',
        frequencyOfUse: 'Occasionally',
        age: '18-24',
        gender: 'Non-binary',
        physiology: 'Active lifestyle',
      },
      {
        strainId: 4, // Replace with an actual strain ID from your Strains table
        userId: 4, // Replace with an actual user ID from your Users table
        comment: 'Excellent for relaxation and sleep.',
        stars: 5,
        dose: 'Low',
        strain: 'Indica',
        potency: 'High',
        methodOfUse: 'Vaping',
        frequencyOfUse: 'Nightly',
        age: '46-55',
        gender: 'Male',
        physiology: 'Insomnia',
      },
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Comments';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('Comments', {
      comment: {
        [Op.in]: [
          'This strain works wonders for my anxiety!',
          'Really helps with pain relief but makes me feel drowsy.',
          'Gives me a great mood boost, but I feel a bit jittery afterward.',
          'Excellent for relaxation and sleep.',
        ],
      },
    }, options);
  }
};
