const listUsers = async (req, res) => {
    // Fetch the user's conversion history from the database
    const dbQuery = new Promise((resolve, reject) => {
        req.app.get('db').all(`
            SELECT * FROM users
        `, [], (err, rows) => {
            if (err) {
                reject(err) // Handle database error
            }
            if (rows) {
                resolve(rows) // Return the fetched conversion data
            }
        })
    })

    const result = await dbQuery // Wait for the database query to complete

    res.status(200).json({
        users: result, // Pass the conversion data
    })
}

// Export the module functions for use in other parts of the app where they are needed
module.exports = {
    listUsers
}
