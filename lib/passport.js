const passport  = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const db = require('../database');
const {User} = require('../database/models'); // I

const opts = {
    secretOrKey: 'secret',
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
}
passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
    const userObj = await User.findOne({
            where: {
                id: jwt_payload.id,
            }
        }
    )

    // Check if the user is found in the database
    if (userObj) {
        const userData = userObj // Get the first user from the result
        // Set the session data for the logged-in user
        const user = {
            id: userData.id,
            email: userData.email,
            photo: userData.photo,
            first_name: userData.first_name,
            last_name: userData.last_name,
            user_type: userData.user_type
        };
        // Return the user data
        return done(null, user);
    }
    // Return false if the user is not found
    return done(null, false);
}));
module.exports = passport;