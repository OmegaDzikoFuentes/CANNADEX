'use strict';

/** @type {import('sequelize-cli').Migration} */
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Strains', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      ownerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users', // Ensure this matches your Users table name
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      flavor: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      city: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      state: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      country: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      potency: {
        type: Sequelize.DECIMAL(10, 8),
        allowNull: false,
      },
      shared: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      price: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      euphoric: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      relaxed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      amused: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      giggly: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      creative: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      hungry: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      moreSensitiveToLight: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      moreSensitiveToColor: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      moreSensitiveToSound: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      moreSensitiveToTouch: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      moreSensitiveToTaste: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      moreSensitiveToSmell: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
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

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Strains';
    await queryInterface.dropTable(options);
  },
};
