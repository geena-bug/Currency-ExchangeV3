// Import the validationResult method from express-validator for handling form validation results
const { validationResult } = require('express-validator');
// Import passport configuration
const passport = require("../lib/passport");
// Import the track activity function
const { trackActivity } = require('../common/track-activity');
// Import the jsonwebtoken library
const jwt = require('jsonwebtoken');

// Export the processLogin function to handle login form submission
module.exports.processLogin = async (req, res) => {
    const validate = validationResult(req); // Validate the form fields using express-validator
    const password = req.body.password; // Get the submitted password from the request body
    const email = req.body.email.toLowerCase(); // Get the submitted email and convert it to lowercase
    const models = req.app.get('models'); // Get models from the application context

    let errors = validate.array().map(error => error.msg); // Extract error messages from the validation result

    // Check if there are validation errors
    if (!validate.isEmpty()) {
        return res.status(401).json({
            message: 'Error validating fields', // Respond with an error message
            errors,
        });
    }

    // Check if there are no errors before proceeding with a database query
    if (errors.length === 0) {
        const user = await models.users.findOne({
            where: {
                email: email,   // Query the users table for a matching email
                password: password, // Query for a matching password
            },
        });

        // Check if the user is found in the database
        if (user) {
            // Generate a JSON Web Token for the logged-in user
            const accessToken = jwt.sign(
                {
                    id: user.id,        // Include the user's ID in the token
                    email: user.email   // Include the user's email in the token
                },
                "secret",               // Secret key for signing the token
                { expiresIn: "1d" }     // Set the token expiration to 1 day
            );
            // Respond with the access token
            return res.status(200).json({
                accessToken,
            });
        } else {
            // If the user is not found, respond with an error message
            return res.status(401).json({
                message: 'Invalid email or password',
            });
        }
    }
    // Respond with validation error messages
    return res.json({
        message: 'Error validating fields',
        errors
    }).status(427);
};

// Export the processSignup function to handle signup form submission
module.exports.processSignup = async (req, res) => {
    const validate = validationResult(req); // Validate the form fields using express-validator
    const firstname = req.body.first_name;  // Get the submitted first name
    const lastname = req.body.last_name;    // Get the submitted last name
    const password = req.body.password;     // Get the submitted password
    const userType = req.body.user_type;    // Get the submitted user type
    const email = req.body.email.toLowerCase(); // Get the submitted email and convert it to lowercase
    const models = req.app.get('models');   // Get models from the application context

    let errors = validate.array().map(error => error.msg); // Extract error messages from the validation result

    // Check if there are validation errors
    if (!validate.isEmpty()) {
        return res.status(401).json({
            message: 'Error validating fields',
            errors,
        });
    }

    // Check if a user with the submitted email already exists
    const user = await models.users.findOne({
        where: {
            email: email,
        },
    });

    if (user) {
        // Respond with an error message if the email already exists
        return res.status(400).json({
            message: 'User with email already exists',
        });
    }

    // Create a new user in the database with the submitted details
    await models.users.create({
        first_name: firstname,
        last_name: lastname,
        email: email,
        password: password,
        user_type: userType,
    });

    // Respond with a success message and new user details
    return res.json({
        message: 'User created successfully',
        user: {
            id: this.lastID,             // Placeholder for the last inserted ID
            email: email,
            first_name: firstname,
            last_name: lastname
        }
    }).status(200);
};