const {sequelize} = require('../database/models'); // I
const listUsers = async (req, res) => {
    const models = req.app.get('models');

    try {
        const users = await models.users.findAll({
            attributes: [
                'id',
                'first_name',
                'last_name',
                'email',
                [
                    sequelize.fn('COUNT', sequelize.col('conversions.id')),
                    'conversion_count'
                ]
            ],
            include: [{
                model: models.conversions,
                attributes: [],
                required: false, // This makes it a LEFT JOIN,
                as: 'conversions'
            }],
            group: [
                'users.id',
                'users.first_name',
                'users.last_name',
                'users.email'
            ]
        });

        res.status(200).json({
            users: users
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: error.message
        });
    }
}


const deleteUser = async (req, res) => {
    const models = req.app.get('models');
    // Get the user ID from the params
    const userId = req.params.id

    try {
        await models.users.destroy({
                where: {
                    id: userId
                }
            }
        )
        // Redirect to the conversions page
        return res.status(204).json({
            success: true,
            message: 'User deleted successfully!',
        })
    }catch (err){
        return res.status(500).json({
            success: false,
            message: 'Error deleting user!',
        })
    }
}

// Export the module functions for use in other parts of the app where they are needed
module.exports = {
    listUsers,
    deleteUser,
}
