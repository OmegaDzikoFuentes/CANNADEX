'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class StrainImage extends Model {
    static associate(models) {
      StrainImage.belongsTo(models.Strain, { foreignKey: 'strainId', onDelete: 'CASCADE' });
    }
  }

  StrainImage.init(
    {
      strainId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Strains', key: 'id' },
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      preview: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      type: {
        type: DataTypes.ENUM('image', 'video'),
        allowNull: false,
        defaultValue: 'image',
      },
    },
    {
      sequelize,
      modelName: 'StrainImage',
    }
  );
  return StrainImage;
};
