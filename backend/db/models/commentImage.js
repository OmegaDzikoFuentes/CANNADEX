'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CommentImage extends Model {
    static associate(models) {
      CommentImage.belongsTo(models.Comment, { foreignKey: 'commentId', onDelete: 'CASCADE' });
    }
  }

  CommentImage.init(
    {
      commentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Comments', key: 'id' },
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'CommentImage',
    }
  );
  return CommentImage;
};
