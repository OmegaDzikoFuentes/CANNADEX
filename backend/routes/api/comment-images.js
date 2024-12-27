const express = require('express');
const { Comment, CommentImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

const router = express.Router();

// DELETE /comment-images/:commentImageId - Deletes an image for a comment
router.delete('/:commentImageId', requireAuth, async (req, res) => {
  const { commentImageId } = req.params;
  const { user } = req;

  const commentImage = await CommentImage.findByPk(commentImageId, {
    include: [{
      model: Comment,
      attributes: ['userId']
    }]
  });

  // Check if the comment image exists
  if (!commentImage) {
    return res.status(404).json({ message: 'Comment Image couldn\'t be found' });
  }

  const comment = await Comment.findByPk(commentImage.commentId);

  // Match comment and owner
  if (comment.userId !== user.id) {
    return res.status(403).json({ message: 'You are not authorized to delete this image' });
  }

  // Delete image
  await commentImage.destroy();

  return res.json({ message: 'Successfully deleted' });
});

module.exports = router;
