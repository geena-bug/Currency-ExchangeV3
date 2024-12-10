// Define a SQL statement to create the 'users' table if it doesn't exist
const userTable = `
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,  // Define 'id' as the primary key with auto-increment
        first_name TEXT NOT NULL,              // Define 'first_name' as text and do not allow null values
        last_name TEXT NOT NULL,               // Define 'last_name' as text and do not allow null values
        user_type TEXT NOT NULL DEFAULT 'user',// Define 'user_type' as text, defaulting to 'user' and not allowing null values
        email TEXT NOT NULL UNIQUE,            // Define 'email' as text, do not allow nulls, ensure uniqueness
        password TEXT NOT NULL,                // Define 'password' as text and do not allow null values
        photo VARCHAR(200) DEFAULT NULL        // Define 'photo' as a varchar with a max length of 200, defaulting to NULL
    )
`

// Define a SQL statement to create the 'conversions' table if it doesn't exist
const conversionsTable = `
    CREATE TABLE IF NOT EXISTS conversions (
        id INTEGER PRIMARY KEY AUTOINCREMENT, // Define 'id' as the primary key with auto-increment
        user_id INTEGER TEXT NOT NULL,        // Define 'user_id' as an integer (foreign key) and do not allow null values
        currency_from TEXT NOT NULL,          // Define 'currency_from' as text and do not allow null values
        currency_to TEXT NOT NULL,            // Define 'currency_to' as text and do not allow null values
        amount DECIMAL(10,2) NOT NULL,        // Define 'amount' as a decimal with 10 total digits and 2 decimal places, do not allow null values
        converted_amount DECIMAL(10,2) NOT NULL,// Define 'converted_amount' as a decimal with 10 total digits and 2 decimal places, do not allow null values
        conversion_date TEXT NOT NULL,        // Define 'conversion_date' as text and do not allow null values
        FOREIGN KEY (user_id)                 // Set 'user_id' as a foreign key
            REFERENCES users (id)             // Reference 'id' in the 'users' table
            ON DELETE CASCADE                 // Cascade delete operations
            ON UPDATE NO ACTION               // Do nothing on update operations
    )
`

// Array that holds the SQL statements for creating the 'users' and 'conversions' tables
const sqlStatements = [
    userTable,       // Add the 'users' table creation statement to the array
    conversionsTable // Add the 'conversions' table creation statement to the array
]

// Export the SQL statements so they can be used in other modules
module.exports = sqlStatements