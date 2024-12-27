const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const { requireAuth } = require('../../utils/auth');
const { User, Comment, Strain, CommentImage, StrainImage } = require('../../db/models');

const { check, validationResult } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

// GET /api/comments/current - Retrieve all comments of the current user
router.get('/current', requireAuth, async (req, res, next) => {
  const { user } = req;
  const comments = await Comment.findAll({
    where: {
      userId: user.id
    },
    include: [
      {
        model: User,
        attributes: ['id', 'firstName', 'lastName']
      },
      {
        model: Strain,
        include: [
          {
            model: StrainImage,
            attributes: ['url']
          }
        ]
      },
      {
        model: CommentImage,
        attributes: ['id', 'url']
      }
    ]
  });

  const formattedComments = comments.map(comment => ({
    id: comment.id,
    userId: comment.userId,
    strainId: comment.strainId,
    comment: comment.comment,
    stars: comment.stars,
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
    User: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName
    },
    Strain: {
      id: comment.Strain.id,
      ownerId: comment.Strain.ownerId,
      name: comment.Strain.name,
      type: comment.Strain.type,
      thcContent: comment.Strain.thcContent,
      cbdContent: comment.Strain.cbdContent,
      previewImage: comment.Strain.StrainImages[0]?.url || null
    },
    CommentImages: comment.CommentImages.map(image => ({
      id: image.commentId,
      url: image.url
    }))
  }));

  return res.json({
    Comments: formattedComments
  });
});

// POST /comments/:commentId/images
router.post('/:commentId/images', requireAuth, async (req, res, next) => {
  const { url } = req.body;
  const { commentId } = req.params;
  const { user } = req;

  try {
    const comment = await Comment.findByPk(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment couldn't be found" });
    }

    if (comment.userId !== user.id) {
      return res.status(403).json({ message: "This Comment Does Not Belong to You" });
    }

    const imageCount = await CommentImage.count({ where: { commentId } });

    if (imageCount >= 10) {
      return res.status(403).json({ message: "Maximum number of images for this resource was reached." });
    }

    const newImage = await CommentImage.create({
      commentId,
      url,
    });

    return res.status(201).json({
      id: newImage.id,
      url: newImage.url,
    });

  } catch (err) {
    next(err);
  }
});

// Validation middleware for comment body and stars
const validateComment = [
  check('comment')
    .exists({ checkFalsy: true })
    .withMessage('Comment text is required'),
  check('stars')
    .exists({ checkFalsy: true })
    .isInt({ min: 1, max: 5 })
    .withMessage('Stars must be an integer between 1 and 5'),
  handleValidationErrors
];

// PUT /comments/:commentId
router.put('/:commentId', requireAuth, validateComment, async (req, res, next) => {
  const { comment, stars } = req.body;
  const { commentId } = req.params;
  const { user } = req;

  try {
    const existingComment = await Comment.findByPk(commentId);

    if (!existingComment) {
      return res.status(404).json({ message: "Comment couldn't be found" });
    }

    if (existingComment.userId !== user.id) {
      return res.status(403).json({ message: 'You do not have permission to edit this comment' });
    }

    existingComment.comment = comment;
    existingComment.stars = stars;
    await existingComment.save();

    return res.json(existingComment);

  } catch (err) {
    next(err)
  }
});

// DELETE /comments/:commentId
router.delete('/:commentId', requireAuth, async (req, res, next) => {
  const { commentId } = req.params;
  const { user } = req;

  try {

    const comment = await Comment.findByPk(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment couldn't be found" });
    }

    if (comment.userId !== user.id) {
      return res.status(403).json('You do not have permission to delete this comment');
    }

    await comment.destroy();

    return res.status(200).json({ message: 'Successfully deleted' });

  } catch (err) {
    next(err)
  }
});

module.exports = router;
