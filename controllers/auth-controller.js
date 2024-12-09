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

    // Extract error messages from the validation result
    let errors = validate.array().map(error => error.msg);

    // Check if there are validation errors
    if (!validate.isEmpty()) {
        errors = validate.array().map(error => error.msg); // Extract error messages if validation failed
    }

    // Check if there are no errors before proceeding with a database query
    if (errors.length === 0) {
        // Perform a database query to find a user with the submitted email and password
        const dbQuery = new Promise((resolve, reject) => {
            req.app.get('db').all(`
                SELECT * FROM users WHERE email = ? AND password = ?
            `, [email, password], (err, rows) => {
                // Handle database error
                if (err) {
                    reject(err);
                }
                // Resolve the promise with the database result (rows)
                if (rows) {
                    resolve(rows);
                }
            });
        });
        const result = await dbQuery; // Wait for the database query result

        // Check if the user is found in the database
        if (result.length > 0) {
            const userData = result[0]; // Get the first user from the result
            // Set the session data for the logged-in user
            const accessToken = jwt
                .sign(
                    {
                        id: userData.id,
                        email: userData.email
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

    // Extract error messages from the validation result
    let errors = validate.array().map(error => error.msg);

    // Check if there are validation errors
    if (!validate.isEmpty()) {
        errors = validate.array().map(error => error.msg); // Extract error messages if validation failed
    }

    // Check if there are no errors before proceeding with a database query
    if (errors.length === 0) {
        // Perform a database query to find if a user with the submitted email already exists
        const dbQuery = new Promise((resolve, reject) => {
            req.app.get('db').all(`
                SELECT * FROM users WHERE email = ?
            `, [email], (err, rows) => {
                // Handle database error
                if (err) {
                    reject(err);
                }
                // Resolve the promise with the database result (rows)
                if (rows) {
                    resolve(rows);
                }
            });
        });
        const result = await dbQuery; // Wait for the database query result

        // Check if a user with the submitted email already exists
        if (result.length > 0) {
            return res.status(400).json({
                message: 'User with email already exists',
            });
        } else {
            // If no user exists with the submitted email, save the new user to the database
            req.app.get('db').run(`
                INSERT INTO users (first_name, last_name, email, password, user_type) VALUES (?, ?, ?, ?, ?)
            `, [firstname, lastname, email, password, userType], function (err) {
                // Handle database error
                if (err) {
                    console.error(err, userType);
                    return res.json({
                        message: 'Error creating user',
                    }).status(500);
                }
                return res.json({
                    message: 'User created successfully',
                    user: {
                        id: this.lastID,
                        email: email,
                        first_name: firstname,
                        last_name: lastname
                    }
                }).status(200);
            })
        }
    }else{
        return res.status(427).json({
            message: 'Error validating fields',
            errors
        });
    }
};
