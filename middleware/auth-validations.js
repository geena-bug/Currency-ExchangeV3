// Extract the 'body' function from 'express-validator' to be used for request body validation
const { body } = require('express-validator')

// Define an array of validation rules for the login form
const loginValidation = [
    // Validate 'email' field, ensure it's a valid email address
    body('email', "Invalid email")
        .isEmail() // Check if the input is a valid email format
        .trim() // Remove excess white spaces
        .normalizeEmail(), // Normalize the email (e.g., lowercase, remove dots in Gmail, etc.)

    // Validate 'password' field, ensure it has a minimum length of 4 and is a string
    body('password', "Password is required")
        .isLength({min: 4}) // Check that the password is at least 4 characters long
        .isString() // Ensure the password is a string
]

// Define an array of validation rules for the sign-up form
const signUpValidation = [
    // Validate 'first_name' field, ensure it exists and has at least 3 characters
    body('first_name', "First name is required")
        .exists() // Check if the first name field exists in the request
        .isLength({min: 3}) // Ensure the first name is at least 3 characters long
        .trim(), // Remove excess white spaces

    // Validate 'first_name' field, ensure it exists and has at least 3 characters
    body('user_type', "User type is required and allowed values are 'admin' or 'user'")
        .exists() // Check if the first name field exists in the request
        .isLength({min: 3}) // Ensure the first name is at least 3 characters long
        .isIn(['admin', 'user']) // Ensure the first name is at least 3 characters long
        .trim(), // Remove excess white spaces

    // Validate 'last_name' field, ensure it has at least 3 characters
    body('last_name', "Last name is required")
        .isLength({min: 3}) // Ensure the last name is at least 3 characters long
        .trim(), // Remove excess white spaces

    // Validate 'email' field, ensure it's a valid email address
    body('email', "Invalid email")
        .isEmail() // Check if the input is a valid email format
        .trim(), // Remove excess white spaces

    // Validate 'password' field, ensure it has a length between 4 and 16 characters and is a string
    body('password', "Password is required and must be between 4 to 16 characters")
        .isLength({min: 4}) // Ensure the password is at least 4 characters long
        .isString(), // Ensure the password is a string

    // Validate 'confirmPassword' field, ensure it matches the password
    body('confirm_password')
        .isLength({min: 4}) // Ensure the confirm password is at least 4 characters long
        .withMessage("Confirm Password is required and must be between 4 to 16 characters") // Custom error message
        .isString() // Ensure confirmPassword is a string
        .custom((value, { req }) => {
            // Custom validator to check if 'confirmPassword' matches 'password'
            if (value !== req.body.password) {
                // Throw an error if passwords do not match
                throw new Error("Passwords don't match");
            } else {
                return value; // Return the value if validation is successful
            }
        })
]

// Export the validation arrays to be used in other parts of the application
module.exports = {
    loginValidation, // Export login validation rules
    signUpValidation // Export sign-up validation rules
}
