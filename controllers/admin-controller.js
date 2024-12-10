// Import the sequelize instance from the models directory
const {sequelize} = require('../database/models');

// Define an asynchronous function to list users
const listUsers = async (req, res) => {
    const models = req.app.get('models'); // Retrieve the models from the request app

    try {
        // Use Sequelize to find all users with specific attributes
        const users = await models.users.findAll({
            attributes: [
                'id',                 // Select the 'id' attribute
                'first_name',         // Select the 'first_name' attribute
                'last_name',          // Select the 'last_name' attribute
                'email',              // Select the 'email' attribute
                [
                    sequelize.fn('COUNT', sequelize.col('conversions.id')), // Use COUNT function to count conversions
                    'conversion_count'                                     // Alias the count result as 'conversion_count'
                ]
            ],
            include: [{               // Include related models
                model: models.conversions, // Reference the conversions model
                attributes: [],            // No attributes needed from conversions
                required: false,           // LEFT JOIN equivalent
                as: 'conversions'          // Alias it as 'conversions'
            }],
            group: [                  // Group by these fields to get unique users
                'users.id',
                'users.first_name',
                'users.last_name',
                'users.email'
            ]
        });

        // Respond with the retrieved users
        res.status(200).json({
            users: users
        });
    } catch (error) {
        console.log(error); // Log any errors that occur
        // Respond with a 500 status and error message if an error occurs
        res.status(500).json({
            error: error.message
        });
    }
}

// Define an asynchronous function to delete a user
const deleteUser = async (req, res) => {
    const models = req.app.get('models'); // Retrieve the models from the request app
    const userId = req.params.id; // Get the user ID from the request parameters

    try {
        // Use Sequelize to delete the user with the specified ID
        await models.users.destroy({
                where: {
                    id: userId // Specify the condition to find the user by ID
                }
            }
        );
        // Respond with a 204 status and success message
        return res.status(204).json({
            success: true,
            message: 'User deleted successfully!',
        });
    } catch (err) {
        console.log(err); // Log any errors that occur
        // Respond with a 500 status and error message if an error occurs
        return res.status(500).json({
            success: false,
            message: 'Error deleting user!',
        });
    }
}

// Export the module functions for use in other parts of the app
module.exports = {
    listUsers,
    deleteUser,
}