// Import Express.js to create a router
const express = require('express');
// Create a new router instance
const router = express.Router();
// Import validation middleware for authentication routes
const validations = require('../middleware/auth-validations');
// Import authentication controllers that handle the login and sign-up processes
const controllers = require('../controllers/auth-controller');

// Define routes for user authentication

// Route to process user sign-up
router.post('/sign-up',
    [validations.signUpValidation], // Apply validation middleware for sign-up form data
    controllers.processSignup // Controller function to handle sign-up process
);

// Route to process user login
router.post('/login',
    [validations.loginValidation], // Apply validation middleware for login form data
    controllers.processLogin // Controller function to handle login process
);

// Export the router for use in the application
module.exports = router;