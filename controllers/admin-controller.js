const listUsers = async (req, res) => {
    // Fetch the user's conversion history from the database
    const dbQuery = new Promise((resolve, reject) => {
        req.app.get('db').all(`
            SELECT 
                users.id, 
                users.first_name, 
                users.last_name, 
                users.email, 
                COUNT(conversions.id) AS conversion_count
            FROM 
                users
            LEFT JOIN 
                conversions ON users.id = conversions.user_id
            GROUP BY 
                users.id, users.first_name, users.last_name, users.email;
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

const deleteUser = async (req, res) => {
    // Get the user ID from the params
    const userId = req.params.id

    // Delete the user record from the database
    req.app.get('db').run(`DELETE FROM users WHERE id = ?`, [userId])

    // Redirect to the conversions page
    return res.status(204).json({
        success: true,
        message: 'User deleted successfully!',
    })
}

// Export the module functions for use in other parts of the app where they are needed
module.exports = {
    listUsers,
    deleteUser,
}
