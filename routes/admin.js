// Import Express.js to create a router
const express = require('express');
// Create a new router instance
const router = express.Router();
// Import the admin controller for handling admin functionalities
const adminController = require('../controllers/admin-controller');
// Import the checkRole middleware for role-based access control
const checkRole = require('../middleware/checkRole');
// Import Passport.js configuration
const passport = require('../lib/passport');
// Create the role checking middleware, allowing only 'admin' role
const adminPermissionChecker = checkRole();

// Define user management routes with authentication and role checking

// Route to list users
router.get('/list-users',
    passport.authenticate('jwt', { session: false }), // Authenticate using JWT without a session
    adminPermissionChecker(['admin']), // Allow access only to users with 'admin' role
    adminController.listUsers // Controller function to list users
);

// Route to delete a user by ID
router.delete('/delete-user/:id',
    passport.authenticate('jwt', { session: false }), // Authenticate using JWT without a session
    adminPermissionChecker(['admin']), // Allow access only to users with 'admin' role
    adminController.deleteUser // Controller function to delete a user
);

// Export the router for use in the application
module.exports = router;