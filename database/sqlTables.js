//Create user table
const userTable = `
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        user_type TEXT NOT NULL DEFAULT 'user',
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        photo VARCHAR(200) DEFAULT NULL
    )
`
//Create the conversion table
const conversionsTable = `
    CREATE TABLE IF NOT EXISTS conversions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER TEXT NOT NULL,
        currency_from TEXT NOT NULL,
        currency_to TEXT NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        converted_amount DECIMAL(10,2) NOT NULL,
        conversion_date TEXT NOT NULL,
        FOREIGN KEY (user_id)
            REFERENCES users (id)
            ON DELETE CASCADE
            ON UPDATE NO ACTION
    )
`
// Array that holds the SQL statements for creating the 'users' and 'conversions' tables
const sqlStatements = [
    userTable,
    conversionsTable
]
module.exports = sqlStatements