// Import express-validator for request body validation
const { body } = require('express-validator');

// Validation rules for currency conversion
const conversionValidation = [
    // Validate 'currencyFrom' field
    body('currencyFrom', "Currency from is required")
        .exists() // Check if field exists
        .isLength({ min: 1 }) // Minimum length of 1 character
        .trim(), // Remove excess whitespace

    // Validate 'currencyTo' field
    body('currencyTo', "Currency to is required")
        .isLength({ min: 1 }) // Minimum length of 1 character
        .trim(), // Remove excess whitespace

    // Validate 'amount' field
    body('amount', "Amount is required")
        .isNumeric() // Check if value is numeric
        .isLength({ min: 1 }), // Minimum length of 1 character
];

const updatePasswordValidation = [
    // Validate 'password' field, ensure it has a length between 4 and 16 characters and is a string
    body('current_password', "Password is required and must be between 4 to 16 characters")
        .isLength({min: 4}) // Ensure the password is at least 4 characters long
        .isString(), // Ensure the password is a string

    body('new_password', "Password is required and must be between 4 to 16 characters")
        .isLength({min: 4}) // Ensure the password is at least 4 characters long
        .isString(), // Ensure the password is a string
    // Validate 'confirmPassword' field, ensure it matches the password
    body('confirm_password')
        .isLength({min: 4}) // Ensure the confirm password is at least 4 characters long
        .withMessage("Confirm Password is required and must be between 4 to 16 characters") // Custom error message
        .isString() // Ensure confirmPassword is a string
        .custom((value, { req }) => {
            // Custom validator to check if 'confirmPassword' matches 'password'
            if (value !== req.body.new_password) {
                // Throw an error if passwords do not match
                throw new Error("Passwords don't match");
            } else {
                return value; // Return the value if validation is successful
            }
        })
];

// Validation rules for updating account information
const updateAccountValidation = [
    // Validate 'first_name' field
    body('first_name', "First name is required")
        .exists() // Check if field exists
        .isLength({ min: 3 }) // Minimum length of 3 characters
        .trim(), // Remove excess whitespace

    // Validate 'last_name' field
    body('last_name', "Last name is required")
        .isLength({ min: 3 }) // Minimum length of 3 characters
        .trim(), // Remove excess whitespace

    // Validate 'email' field
    body('email', "Invalid email")
        .isEmail() // Check if value is a valid email
        .trim(), // Remove excess whitespace
];

// Validation rules for photo upload
const photoUploadValidator = [
    // Validate 'photo' field
    body('photo', "Please select an image to upload")
        .exists() // Check if field exists
        .isLength({ min: 1 }), // Minimum length of 1 character
];

// Export validation rules as a module
module.exports = {
    conversionValidation,
    updateAccountValidation,
    photoUploadValidator,
    updatePasswordValidation,
};
