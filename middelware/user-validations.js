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
};
