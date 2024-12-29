const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const strainRouter = require('./strains.js'); // Updated to reflect Strain model
const commentRouter = require('./comments.js'); // Updated to reflect Comment model
const { restoreUser } = require("../../utils/auth.js");
const commentImageRouter = require('./comment-images.js'); // Updated to Comment Image routes
const strainImageRouter = require('./strain-images.js'); // Updated to Strain Image routes

// Connect restoreUser middleware to the API router
// If current user session is valid, set req.user to the user in the database
// If current user session is not valid, set req.user to null
router.use(restoreUser);

router.use('/comment-images', commentImageRouter); // Updated to Comment Image routes

router.use('/strain-images', strainImageRouter); // Updated to Strain Image routes

router.use('/session', sessionRouter);

router.use('/users', usersRouter);

router.use("/strains", strainRouter); // Updated to Strain routes

router.use('/comments', commentRouter); // Updated to Comment routes





module.exports = router;
