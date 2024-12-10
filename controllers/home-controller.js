// Import the validationResult method from express-validator for validating form inputs
const { validationResult } = require('express-validator');

// Export the home function to render the homepage
module.exports.home = (req, res) => {
    // Render the 'index' view template and pass an object containing the pageTitle
    res.render('index', {
        pageTitle: 'Welcome', // Set the page title to 'Welcome'
    });
};