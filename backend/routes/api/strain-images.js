const express = require('express');
const { Strain, StrainImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

const router = express.Router();

// DELETE /strain-images/:imageId - Deletes an image for a strain
router.delete('/:imageId', requireAuth, async (req, res, next) => {
  const { imageId } = req.params;
  const { user } = req;

  try {
    const strainImage = await StrainImage.findByPk(imageId);

    // Check if the strain image exists
    if (!strainImage) {
      return res.status(404).json({ message: 'Strain Image couldn\'t be found' });
    }

    // Find the related strain
    const strain = await Strain.findByPk(strainImage.strainId);

    // Match strain and owner
    if (strain.ownerId !== user.id) {
      return res.status(403).json({ message: 'You are not authorized to delete this image' });
    }

    // Delete the image
    await strainImage.destroy();

    return res.json({ message: 'Successfully deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
