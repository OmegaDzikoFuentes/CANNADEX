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
      dose: {
        type: DataTypes.STRING,
        allowNull: true, // Optional field for comments about the dose
      },
      strain: {
        type: DataTypes.STRING,
        allowNull: true, // Optional field for comments about the strain
      },
      potency: {
        type: DataTypes.STRING,
        allowNull: true, // Optional field for comments about the potency
      },
      methodOfUse: {
        type: DataTypes.STRING,
        allowNull: true, // Optional field for comments on smoking, vaping, or ingestion
      },
      frequencyOfUse: {
        type: DataTypes.STRING,
        allowNull: true, // Optional field for comments about how often cannabis is used
      },
      age: {
        type: DataTypes.STRING,
        allowNull: true, // Optional field for comments about the user's age
      },
      gender: {
        type: DataTypes.STRING,
        allowNull: true, // Optional field for comments about the user's gender
      },
      physiology: {
        type: DataTypes.STRING,
        allowNull: true, // Optional field for comments about the user's physiology
      },
    },
    {
      sequelize,
      modelName: 'Comment',
    }
  );

  return Comment;
};
