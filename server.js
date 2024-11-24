const createError = require('http-errors'); // Import the http-errors module to handle HTTP errors
const express = require('express'); // Import Express framework
const path = require('path'); // Import path module to handle file and directory paths
const cookieParser = require('cookie-parser'); // Import cookie-parser to parse cookies
const logger = require('morgan'); // Import morgan for logging HTTP requests
const session = require('express-session'); // Import express-session to manage sessions
const flash = require("connect-flash");
const passport = require('./lib/passport'); // Import passport for authentication
const cors = require('cors');

// Import all route modules
const indexRouter = require('./routes/index'); // Router for handling index (home) routes
const usersRouter = require('./routes/users'); // Router for handling user-related routes
const adminRouter = require('./routes/admin'); // Router for handling user-related routes
const authRouter = require('./routes/auth'); // Router for handling authentication routes

const db = require('./database');
const PORT = 3000; // Define the port the server will run on
const app = express(); // Create an instance of the Express application

app.set('db', db); // Store the database connection in the app instance

// Use the imported middleware
app.use(logger('dev')); // Use morgan logger with 'dev' format to log requests
app.use(express.json()); // Parse incoming JSON request bodies
app.use(express.urlencoded({ extended: false })); // Parse incoming URL-encoded data
app.use(cookieParser()); // Parse cookies attached to the client request
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from the 'public' directory
app.use(cors());
// Session Setup
app.use(session({
  // Secret key used to sign the session ID cookie
  secret: 'gyU@oQJXAXVHzayWDSH',

  // Forces the session to be saved back to the session store, even if it wasn't modified
  resave: true,

  // Forces an uninitialized session (a session that is new but hasn't been modified) to be saved to the store
  saveUninitialized: true
}));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next){
  res.locals.message = req.flash();
  next();
});

// Set up routes
app.use('/', indexRouter); // Use the indexRouter for the root URL
app.use('/api/v1/users', usersRouter); // Use the usersRouter for '/users' URL
app.use('/api/v1/admin', adminRouter); // Use the usersRouter for '/users' URL
app.use('/api/v1/auth', authRouter); // Use the authRouter for '/auth' URL

// Catch 404 errors and forward them to the error handler
app.use(function(req, res, next) {
  next(createError(404)); // If no route matches, create a 404 error
});

// Error handler
app.use(function(err, req, res, next) {
  // Set local variables for the error, only providing error details in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page
  res.status(err.status || 500); // Set the status code to the error status or default to 500
  res.render('error'); // Render the 'error' view
});


// Start the server on the specified port
app.listen(PORT, () => console.log('Running server on port ' + PORT)); // Log that the server is running
