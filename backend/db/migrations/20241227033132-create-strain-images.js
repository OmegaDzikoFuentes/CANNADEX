'use strict';

/** @type {import('sequelize-cli').Migration} */
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('StrainImages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      strainId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Strains', // Ensure this matches your Strain table name
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      url: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      preview: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      type: {
        type: Sequelize.ENUM('image', 'video'),
        allowNull: false,
        defaultValue: 'image',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    }, options);
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'StrainImages';
    await queryInterface.dropTable(options);
  },
};
