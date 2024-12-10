// Import Passport.js, a middleware for authentication in Node.js
const passport = require('passport');
// Import the JWT Strategy and the ExtractJwt module from passport-jwt for handling JWTs
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
// Import the User model from your database models
const { User } = require('../database/models');

// Define options for the JWT Strategy
const opts = {
    secretOrKey: 'secret', // Secret key to verify the JWT
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken() // Extract JWT from the authorization header as a Bearer token
}

// Configure Passport to use the JWT Strategy
passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
    // Find a user in the database by ID from the JWT payload
    const userObj = await User.findOne({
        where: {
            id: jwt_payload.id, // JWT payload contains the user ID
        }
    });

    // Check if the user is found in the database
    if (userObj) {
        const userData = userObj; // Retrieve user data from the found object

        // Map necessary user fields to a new object for session data
        const user = {
            id: userData.id,
            email: userData.email,
            photo: userData.photo,
            first_name: userData.first_name,
            last_name: userData.last_name,
            user_type: userData.user_type
        };

        // Indicate success by passing the user object to done()
        return done(null, user);
    }

    // Indicate failure by passing false to done() if the user is not found
    return done(null, false);
}));

// Export the configured passport module for use in other parts of the application
module.exports = passport;