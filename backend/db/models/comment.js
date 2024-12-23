'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate(models) {
      Comment.belongsTo(models.Strain, { foreignKey: 'strainId', onDelete: 'CASCADE' });
      Comment.belongsTo(models.User, { foreignKey: 'userId', onDelete: 'CASCADE' });
      Comment.hasMany(models.CommentImage, { foreignKey: 'commentId', onDelete: 'CASCADE' });
    }
  }

  Comment.init(
    {
      strainId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Strains', key: 'id' },
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
      },
      comment: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      stars: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 5,
        },
      },
    },
    {
      sequelize,
      modelName: 'Comment',
    }
  );
  return Comment;
};
