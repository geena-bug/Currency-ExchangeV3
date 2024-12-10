// Import Express.js to create a router
const express = require('express');
// Create a new router instance
const router = express.Router();
// Import the user controller managing user operations
const userController = require('../controllers/users-controller');
// Import validation middleware for user actions
const validation = require('../middleware/user-validations');
// Import middleware for role-based access control
const checkRole = require('../middleware/checkRole');
// Import Passport.js configuration for JWT authentication
const passport = require('../lib/passport');
// Create a middleware for checking user roles
const userPermissionChecker = checkRole();

/* Define user-related routes and protect them */

// Route to load the user dashboard
router.get('/',
    passport.authenticate('jwt', { session: false }), // Authenticate using JWT
    userPermissionChecker(['user', 'admin']), // Allow access to users with 'user' or 'admin' roles
    userController.dashboard // Controller function to load the dashboard
);

// Route to get the current user's data
router.get('/me',
    passport.authenticate('jwt', { session: false }),
    userPermissionChecker(['user', 'admin']),
    userController.me
);

// Route to get list of countries and their currencies
router.get('/country-list',
    passport.authenticate('jwt', { session: false }),
    userPermissionChecker(['user', 'admin']),
    userController.countryCurrencyList
);

// Route to load user conversions
router.get('/conversions',
    passport.authenticate('jwt', { session: false }),
    userPermissionChecker(['user', 'admin']),
    userController.listConversions
);

// Route to load live exchange rates
router.get('/live-exchange',
    passport.authenticate('jwt', { session: false }),
    userPermissionChecker(['user', 'admin']),
    userController.liveExchange
);

// Route to delete a user's conversion history
router.delete('/delete-conversions/:conversionId',
    passport.authenticate('jwt', { session: false }),
    userPermissionChecker(['user', 'admin']),
    userController.deleteHistory
);

// Route to update user account information
router.put('/update-account',
    passport.authenticate('jwt', { session: false }),
    [validation.updateAccountValidation], // Validate account update data
    userPermissionChecker(['user', 'admin']),
    userController.updateAccount
);

// Route to convert currency
router.post('/convert-currency',
    passport.authenticate('jwt', { session: false }),
    [validation.conversionValidation], // Validate conversion data
    userPermissionChecker(['user', 'admin']),
    userController.convertCurrency
);

// Route to update user password
router.put('/update-password',
    passport.authenticate('jwt', { session: false }),
    [validation.updatePasswordValidation], // Validate password update data
    userPermissionChecker(['user', 'admin']),
    userController.updatePassword
);

// Export the router for use in the application
module.exports = router;