// Define a middleware function to check user authentication status
const isAuthenticated = (req, res, next) => {
    // Check if the user is authenticated using Passport.js
    if (req.isAuthenticated()) {
        return next(); // If authenticated, proceed to the next middleware or route handler
    }
    // If not authenticated, redirect the user to the login page
    res.redirect('/auth/login');
}

// Export the isAuthenticated function for use in other parts of the application
module.exports = isAuthenticated;