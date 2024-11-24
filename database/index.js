// Import the sqlite3 module and enable verbose mode for detailed logging
const sqlite3 = require('sqlite3').verbose()

// Import SQL statements for table creation from the external file
const sqlStatements = require('./sqlTables')

// Create a new SQLite database connection (or open an existing one)
const db = new sqlite3.Database('app_db.sqlite', (err) => {
    // Check if there was an error connecting to the database
    if (err) {
        console.log('Error connecting to database', err.message) // Log the error message if the connection fails
        throw err // Throw the error to prevent further execution
    }
})

// Once connected, proceed to create tables using SQL statements
for (let i = 0; i < sqlStatements.length; i++) {
    // Execute each SQL statement in the array to create the tables
    db.run(sqlStatements[i], (err) => {
        // Check if there was an error during the table creation
        if (err) {
            console.log(err.message) // Log the error message if the table creation fails
        }
    })
}

// Export the database connection for use in other parts of the application
module.exports = db;
