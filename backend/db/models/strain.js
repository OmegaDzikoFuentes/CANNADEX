'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Strain extends Model {
    static associate(models) {
      Strain.belongsTo(models.User, { foreignKey: 'ownerId', onDelete: 'CASCADE' });
      Strain.hasMany(models.StrainImage, { foreignKey: 'strainId', onDelete: 'CASCADE' });
      Strain.hasMany(models.Comment, { foreignKey: 'strainId', onDelete: 'CASCADE' });
    }
  }

  Strain.init(
    {
     ownerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
      },
      flavor: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      state: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      country: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      potency: {
        type: DataTypes.DECIMAL(10, 8),
        allowNull: false,
      },
      shared: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      euphoric: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      relaxed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      amused: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      giggly: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      creative: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      hungry: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      moreSensitiveToLight: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      moreSensitiveToColor: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      moreSensitiveToSound: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      moreSensitiveToTouch: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      moreSensitiveToTaste: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      moreSensitiveToSmell: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'Strain',
    }
  );

  return Strain;
};
