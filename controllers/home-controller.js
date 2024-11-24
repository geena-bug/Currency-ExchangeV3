const { validationResult } = require('express-validator'); // Import the validation result method from express-validator

// Export the signUp function
module.exports.home = (req, res) => {
    // Render the signup page with a pageTitle
    res.render('index', {
        pageTitle: 'Welcome',
    });
};