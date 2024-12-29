const express = require('express');
const { Op, Sequelize } = require('sequelize');
const { Strain, Comment, StrainImage, User } = require('../../db/models'); // Include User model
const { check, validationResult } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// GET /api/strains - Retrieve all strains
router.get('/', async (req, res) => {
  let { page, size, minTHC, maxTHC, minCBD, maxCBD } = req.query;

  const errors = {};

  // Page validation
  if (page !== undefined) {
    page = parseInt(page);
    if (Number.isNaN(page) || page < 1) {
      errors.page = "Page must be greater than or equal to 1";
    }
  }

  // Size validation
  if (size !== undefined) {
    size = parseInt(size);
    if (Number.isNaN(size) || size < 1) {
      errors.size = "Size must be greater than or equal to 1";
    }
  }

  // THC validation
  if (minTHC !== undefined) {
    minTHC = parseFloat(minTHC);
    if (Number.isNaN(minTHC) || minTHC < 0) {
      errors.minTHC = "Minimum THC must be greater than or equal to 0";
    }
  }

  if (maxTHC !== undefined) {
    maxTHC = parseFloat(maxTHC);
    if (Number.isNaN(maxTHC) || maxTHC < 0) {
      errors.maxTHC = "Maximum THC must be greater than or equal to 0";
    }
  }

  // CBD validation
  if (minCBD !== undefined) {
    minCBD = parseFloat(minCBD);
    if (Number.isNaN(minCBD) || minCBD < 0) {
      errors.minCBD = "Minimum CBD must be greater than or equal to 0";
    }
  }

  if (maxCBD !== undefined) {
    maxCBD = parseFloat(maxCBD);
    if (Number.isNaN(maxCBD) || maxCBD < 0) {
      errors.maxCBD = "Maximum CBD must be greater than or equal to 0";
    }
  }

  // If there are any validation errors, return 400 response
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      message: "Bad Request",
      errors
    });
  }

  // Set defaults if not provided or invalid
  if (!page || page < 1) page = 1;
  if (!size || size < 1) size = 20;
  if (page > 10) page = 10;
  if (size > 20) size = 20;

  const where = {};
  if (minTHC) where.THC = { [Op.gte]: minTHC };
  if (maxTHC) where.THC = { ...where.THC, [Op.lte]: maxTHC };
  if (minCBD) where.CBD = { [Op.gte]: minCBD };
  if (maxCBD) where.CBD = { ...where.CBD, [Op.lte]: maxCBD };

  const strains = await Strain.findAll({
    where,
    attributes: {
      include: [
        [Sequelize.fn('AVG', Sequelize.col('Comments.stars')), 'avgRating']
      ]
    },
    include: [
      {
        model: StrainImage,
        attributes: ['url'],
        where: { preview: true },
        required: false
      },
      {
        model: Comment,
        attributes: []
      },
      {
        model: User, // Include user to get ownerId
        attributes: ['id', 'username'] // Retrieve necessary fields from the User
      }
    ],
    group: ['Strain.id', 'StrainImages.id', 'User.id']
  });

  const formattedStrains = strains.map(strain => ({
    id: strain.id,
    name: strain.name,
    description: strain.description,
    THC: parseFloat(strain.THC),
    CBD: parseFloat(strain.CBD),
    avgRating: Number(strain.dataValues.avgRating).toFixed(1),
    previewImage: strain.StrainImages[0]?.url || null,
    ownerId: strain.User.id, // Add ownerId
    ownerUsername: strain.User.username // Optionally include the owner's username
  })).slice(size * (page - 1), size * page);

  return res.status(200).json({
    Strains: formattedStrains,
    page,
    size
  });
});

// Configure multer for file uploads
const upload = multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Directory to store uploaded images
      },
      filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      const fileTypes = /jpeg|jpg|png/;
      const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = fileTypes.test(file.mimetype);
      if (extname && mimetype) {
        return cb(null, true);
      }
      cb(new Error('Images must be in JPEG or PNG format.'));
    },
  });

  // Validation middleware for creating a strain
  const validateStrain = [
    check('name')
      .exists({ checkFalsy: true })
      .notEmpty()
      .isLength({ max: 50 })
      .withMessage('Name must be less than 50 characters.'),
    check('description')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('Description is required.'),
    check('flavor')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('Flavor is required.'),
    check('city')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('City is required.'),
    check('state')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('State is required.'),
    check('country')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('Country is required.'),
    check('potency')
      .exists({ checkFalsy: true })
      .notEmpty()
      .isFloat({ min: 0 })
      .withMessage('Potency must be a valid number.'),
    check('shared')
      .optional()
      .isBoolean()
      .withMessage('Shared must be a boolean.'),
    check('price')
      .exists({ checkFalsy: true })
      .notEmpty()
      .isFloat({ min: 0 })
      .withMessage('Price must be a valid number.'),
    check('euphoric')
      .optional()
      .isBoolean()
      .withMessage('Euphoric must be a boolean.'),
    check('relaxed')
      .optional()
      .isBoolean()
      .withMessage('Relaxed must be a boolean.'),
    check('amused')
      .optional()
      .isBoolean()
      .withMessage('Amused must be a boolean.'),
    check('giggly')
      .optional()
      .isBoolean()
      .withMessage('Giggly must be a boolean.'),
    check('creative')
      .optional()
      .isBoolean()
      .withMessage('Creative must be a boolean.'),
    check('hungry')
      .optional()
      .isBoolean()
      .withMessage('Hungry must be a boolean.'),
    check('moreSensitiveToLight')
      .optional()
      .isBoolean()
      .withMessage('MoreSensitiveToLight must be a boolean.'),
    check('moreSensitiveToColor')
      .optional()
      .isBoolean()
      .withMessage('MoreSensitiveToColor must be a boolean.'),
    check('moreSensitiveToSound')
      .optional()
      .isBoolean()
      .withMessage('MoreSensitiveToSound must be a boolean.'),
    check('moreSensitiveToTouch')
      .optional()
      .isBoolean()
      .withMessage('MoreSensitiveToTouch must be a boolean.'),
    check('moreSensitiveToTaste')
      .optional()
      .isBoolean()
      .withMessage('MoreSensitiveToTaste must be a boolean.'),
    check('moreSensitiveToSmell')
      .optional()
      .isBoolean()
      .withMessage('MoreSensitiveToSmell must be a boolean.'),
    handleValidationErrors,
  ];

  // POST /api/strains - Create a new strain
  router.post(
    '/',
    requireAuth,
    upload.single('image'), // Handle single image upload
    validateStrain,
    async (req, res, next) => {
      const {
        name,
        description,
        flavor,
        city,
        state,
        country,
        potency,
        shared,
        price,
        euphoric,
        relaxed,
        amused,
        giggly,
        creative,
        hungry,
        moreSensitiveToLight,
        moreSensitiveToColor,
        moreSensitiveToSound,
        moreSensitiveToTouch,
        moreSensitiveToTaste,
        moreSensitiveToSmell,
      } = req.body;
      const ownerId = req.user.id; // Authenticated user's ID
      const image = req.file ? `/uploads/${req.file.filename}` : null; // Path to the uploaded image

      try {
        // Create the new strain
        const newStrain = await Strain.create({
          ownerId,
          name,
          description,
          flavor,
          city,
          state,
          country,
          potency,
          shared,
          price,
          euphoric,
          relaxed,
          amused,
          giggly,
          creative,
          hungry,
          moreSensitiveToLight,
          moreSensitiveToColor,
          moreSensitiveToSound,
          moreSensitiveToTouch,
          moreSensitiveToTaste,
          moreSensitiveToSmell,
        });

        // If an image is uploaded, associate it with the strain
        if (image) {
          await StrainImage.create({
            strainId: newStrain.id,
            url: image,
            preview: true,
          });
        }

        return res.status(201).json({
          strain: newStrain,
          image,
        });
      } catch (err) {
        next(err);
      }
    }
  );


  // GET /api/strains/current - Returns all strains posted by the current user
router.get('/current', requireAuth, async (req, res, next) => {
    const { user } = req;

    try {
      const strains = await Strain.findAll({
        where: {
          ownerId: user.id, // Assuming ownerId references the user who posted the strain
        },
        attributes: {
          include: [
            [Sequelize.fn('AVG', Sequelize.col('Comments.stars')), 'avgRating']
          ]
        },
        include: [
          {
            model: StrainImage, // Assuming StrainImage is the associated model for strain images
            attributes: ['url'],
            where: { preview: true },
            required: false
          },
          {
            model: Comment, // Assuming Reviews are linked to strains
            attributes: []
          }
        ],
        group: ['Strain.id', 'StrainImages.id'],
      });

      const formattedStrains = strains.map(strain => ({
        id: strain.id,
        ownerId: strain.ownerId,
        name: strain.name,
        description: strain.description,
        price: strain.price, // Assuming price exists in the Strain model
        createdAt: strain.createdAt,
        updatedAt: strain.updatedAt,
        avgRating: Number(strain.dataValues.avgRating).toFixed(1),
        previewImage: strain.StrainImages[0]?.url || null // Assuming StrainImage is for preview
      }));

      // Changed format for error matching
      return res.json({
        Strains: formattedStrains
      });
    } catch (err) {
      next(err);
    }
  });

  // GET /api/strains/:strainId
router.get('/:strainId', async (req, res, next) => {
    const { strainId } = req.params;

    try {
      // Find the strain by its ID
      const strain = await Strain.findByPk(strainId, {
        attributes: {
          include: [
            [Sequelize.fn('AVG', Sequelize.col('Comments.stars')), 'avgStarRating']
          ]
        },
        include: [
          {
            model: StrainImage, // Assuming StrainImage is the associated model for strain images
            attributes: ['id', 'url', 'preview'],
          },
          {
            model: Comment, // Changed from Review to Comment
            attributes: []
          },
          {
            model: User, // Assuming User is linked to the strain model
            attributes: ['id', 'firstName', 'lastName']
          }
        ],
        group: ['Strain.id', 'StrainImages.id', 'User.id'],
      });

      if (!strain) {
        return res.status(404).json({
          message: "Strain couldn't be found",
        });
      }

      // Get the number of comments and average star rating
      const numComments = await Comment.count({
        where: { strainId: strain.id },
      });

      const formattedStrain = {
        id: strain.id,
        ownerId: strain.ownerId,
        name: strain.name,
        description: strain.description,
        price: strain.price, // Assuming price exists in the Strain model
        createdAt: strain.createdAt,
        updatedAt: strain.updatedAt,
        numComments, // Changed from numReviews to numComments
        avgStarRating: Number(strain.dataValues.avgStarRating).toFixed(1),
        StrainImages: strain.StrainImages.map(image => ({
          id: image.id,
          url: image.url,
          preview: image.preview,
        })),
        Owner: {
          id: strain.User.id,
          firstName: strain.User.firstName,
          lastName: strain.User.lastName,
        },
      }

      // response
      return res.json(formattedStrain); // Added return word for response
    } catch (err) {
      next(err);
    }
  });

  // PUT /api/strains/:strainId - Updates an existing strain
router.put('/:strainId', requireAuth, validateStrain, async (req, res, next) => {
    const { strainId } = req.params;
    const { user } = req;
    const { name, description, price } = req.body; // assuming price exists for the strain

    try {
      // Check if strain exists
      const strain = await Strain.findByPk(strainId);
      if (!strain) {
        return res.status(404).json({
          message: "Strain couldn't be found",
        });
      }

      // Check if user is the owner of the strain
      if (strain.ownerId !== user.id) {
        return res.status(403).json({
          message: 'Unauthorized: You are not the owner of this strain',
        });
      }

      // Update strain data
      await strain.update({
        name,
        description,
        price
      });

      // Return the updated strain data
      return res.json({
        id: strain.id,
        ownerId: strain.ownerId,
        name: strain.name,
        description: strain.description,
        price: strain.price,
        createdAt: strain.createdAt,
        updatedAt: strain.updatedAt,
      });
    } catch (err) {
      next(err);
    }
  });

  //Validation middleware for comment
const validateComment = [
    check('comment')
      .exists({ checkFalsy: true })
      .withMessage('Comment text is required.'),
    check('stars')
      .exists({ checkFalsy: true })
      .isInt({ min: 1, max: 5 })
      .withMessage('Stars must be an integer from 1 to 5.'),
    handleValidationErrors
  ];

  // GET /api/strains/:strainId/comments - comments for strain by ID
  router.get('/:strainId/comments', async (req, res, next) => {
    const { strainId } = req.params;

    try {
      // Check if strain exists
      const strain = await Strain.findByPk(strainId);
      if (!strain) {
        return res.status(404).json({
          message: "Strain couldn't be found"
        });
      }

      const comments = await Comment.findAll({
        where: {
          strainId: strainId
        },
        include: [
          {
            model: User,
            attributes: ['id', 'firstName', 'lastName']
          },
          {
            model: CommentImage,
            attributes: ['id', 'url']
          }
        ]
      });

      // Return the comments
      return res.json({
        Comments: comments
      });
    } catch (err) {
      next(err);
    }
  });

  // POST /api/strains/:strainId/comments - comment for strain by ID
  router.post('/:strainId/comments', validateComment, async (req, res, next) => {
    const { strainId } = req.params;
    const { comment, stars } = req.body;
    const { user } = req;

    try {
      // Check if strain exists
      const strain = await Strain.findByPk(strainId);
      if (!strain) {
        return res.status(404).json({
          message: "Strain couldn't be found"
        });
      }

      // Check if the current user already commented on the strain
      const existingComment = await Comment.findOne({ where: { strainId, userId: user.id } });
      if (existingComment) {
        return res.status(500).json({
          message: "User already has a comment for this strain"
        });
      }

      // Create the new comment
      const newComment = await Comment.create({ userId: user.id, strainId, comment, stars });

      // Fetch the comment with User data
      const createdComment = await Comment.findByPk(newComment.id, {
        include: [
          {
            model: User,
            attributes: ['firstName', 'lastName'], // Include user data
          },
        ],
      });

      // Return the created comment with User data
      return res.status(201).json(createdComment);
    } catch (err) {
      next(err);
    }
  });


  // POST /api/strains/:strainId/images - Add an image to a strain by its ID
router.post('/:strainId/images', requireAuth, upload.single('image'), async (req, res, next) => {
    const { strainId } = req.params;
    const { preview } = req.body; // Preview boolean passed in the request
    const { user } = req;

    try {
      // Ensure an image is uploaded
      if (!req.file) {
        return res.status(400).json({
          message: 'Image file is required',
          statusCode: 400
        });
      }

      // Find the strain by its ID
      const strain = await Strain.findByPk(strainId);

      // Check if strain exists
      if (!strain) {
        return res.status(404).json({
          message: "Strain couldn't be found",
          statusCode: 404
        });
      }

      // Check if the user is the owner of the strain
      if (strain.ownerId !== user.id) {
        return res.status(403).json({
          message: 'You are not authorized to add images to this strain',
          statusCode: 403
        });
      }

      // Create a new strain image record
      const newImage = await StrainImage.create({
        strainId: strain.id,
        url: req.file.path,  // Store the file path in the database (relative to your uploads folder)
        preview: preview // Boolean that marks if this image is a preview
      });

      // Return the new image info
      return res.status(201).json({
        id: newImage.id,
        url: newImage.url,
        preview: newImage.preview
      });

    } catch (err) {
      next(err);
    }
  });

// DELETE /api/strains/:strainId - Delete a strain
router.delete('/:strainId', requireAuth, async (req, res, next) => {
    const { strainId } = req.params;
    const { user } = req;

    try {
      // Find the strain by its ID
      const strain = await Strain.findByPk(strainId);

      // Check if strain exists
      if (!strain) {
        return res.status(404).json({
          message: "Strain couldn't be found",
          statusCode: 404,
        });
      }

      // Check if the user is the owner of the strain
      if (strain.ownerId !== user.id) {
        return res.status(403).json({
          message: 'Only the owner of the strain can delete it',
          statusCode: 403,
        });
      }

      // Delete the strain
      await strain.destroy();

      return res.json({
        message: 'Successfully deleted',
        statusCode: 200,
      });
    } catch (err) {
      next(err);
    }
  });


module.exports = router;
