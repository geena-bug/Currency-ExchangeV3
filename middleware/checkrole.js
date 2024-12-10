// Define a higher-order function `checkRole` that returns middleware for role checking
const checkRole = () => (roles) => {
    return (req, res, next) => {
        // Check if the user's role is included in the allowed roles
        if (roles.includes(req.user.user_type)) {
            next(); // If user's role is allowed, proceed to the next middleware or route handler
        } else {
            // If not allowed, respond with a 403 Forbidden status
            res.status(403).json({
                message: 'Forbidden! You are not allowed to access this resource.'
            });
        }
    };
};

// Export the checkRole function for use in other parts of the application
module.exports = checkRole;