const { validationResult } = require('express-validator');
const passport = require("../lib/passport"); // Import the validationResult method from express-validator to handle form validation results
const {trackActivity} = require('../common/track-activity') // Import the track activity function
const jwt = require('jsonwebtoken');

// Export the processLogin function to handle login form submission
module.exports.processLogin = async (req, res) => {
    // Validate the form fields using express-validator
    const validate = validationResult(req);
    const password = req.body.password; // Get the submitted password
    const email = req.body.email.toLowerCase(); // Get the submitted email and convert it to lowercase
    const models = req.app.get('models');

    // Extract error messages from the validation result
    let errors = validate.array().map(error => error.msg);

    // Check if there are validation errors
    if (!validate.isEmpty()) {
        errors = validate.array().map(error => error.msg); // Extract error messages if validation failed
        return res.status(401).json({
            message: 'Error validating fields',
            errors,
        });
    }

    // Check if there are no errors before proceeding with a database query
    if (errors.length === 0) {
        const user = await models.users.findOne({
            where: {
                email: email,
                password: password,
            },
        })
        // Check if the user is found in the database
        if (user) {
            // Set the session data for the logged-in user
            const accessToken = jwt
                .sign(
                    {
                        id: user.id,
                        email: user.email
                    },
                    "secret",
                    { expiresIn: "1d" }
                )
            // Redirect the user to the dashboard or profile page
            return res.status(200).json({
                accessToken,
            });
        } else {
            // If the user is not found, add an error message
            return res.status(401).json({
                message: 'Invalid email or password',
            });
        }
    }
    return res.json({
        message: 'Error validating fields',
        errors
    }).status(427);
};

// Export the processSignup function to handle signup form submission
module.exports.processSignup = async (req, res) => {
    // Validate the form fields using express-validator
    const validate = validationResult(req);
    const firstname = req.body.first_name; // Get the submitted first name
    const lastname = req.body.last_name; // Get the submitted last name
    const password = req.body.password; // Get the submitted password
    const userType = req.body.user_type; // Get the submitted password
    const email = req.body.email.toLowerCase(); // Get the submitted email and convert it to lowercase
    const models = req.app.get('models');

    // Extract error messages from the validation result
    let errors = validate.array().map(error => error.msg);

    // Check if there are validation errors
    if (!validate.isEmpty()) {
        return res.status(401).json({
            message: 'Error validating fields',
            errors,
        });
    }

    const user = await models.users.findOne({
        where: {
            email: email,
        },
    })

    if (user) {
        return res.status(400).json({
            message: 'User with email already exists',
        });
    }

    await models.users.create({
        first_name: firstname,
        last_name: lastname,
        email: email,
        password: password,
        user_type: userType,
    });
    return res.json({
        message: 'User created successfully',
        user: {
            id: this.lastID,
            email: email,
            first_name: firstname,
            last_name: lastname
        }
    }).status(200);
};
