// Import Express.js to create a router
const express = require('express');
// Create a new router instance
const router = express.Router();
// Import (though not used here) validation middleware for possible authentication validations
const validations = require('../middleware/auth-validations');
// Import home controllers, although this file does not currently make use of them
const controllers = require('../controllers/home-controller');

/* Define the home page route */

// GET request handling for the home page
router.get('/', async function (req, res, next) {
    // An example of logging user data if using Sequelize (commented out)
    // console.log(await User.findAll());
    // Send a JSON response with a title key
    res.json({ title: 'Express' });
});

// Export the router for use in other parts of the application
module.exports = router;