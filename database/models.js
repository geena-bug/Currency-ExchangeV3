// Import the Sequelize library
const Sequelize = require('sequelize');

// Create a new Sequelize instance and configure it for SQLite
const sequelize = new Sequelize({
    dialect: 'sqlite', // Specify the database dialect to be used
    storage: './database.sqlite3' // Specify the storage location for the SQLite database file
});

// Define a User class that extends Sequelize's Model class
class User extends Sequelize.Model {}
// Initialize the User model with its attributes
User.init(
    {
        id: {
            type: Sequelize.INTEGER, // Define the id as an integer
            allowNull: false,        // Do not allow null values
            primaryKey: true,        // Set id as the primary key
            autoIncrement: true      // Enable auto-increment for id
        },
        first_name: {
            type: Sequelize.STRING,  // Define first_name as a string
            allowNull: false         // Do not allow null values
        },
        last_name: {
            type: Sequelize.STRING,  // Define last_name as a string
            allowNull: false         // Do not allow null values
        },
        email: {
            type: Sequelize.STRING,  // Define email as a string
            allowNull: false         // Do not allow null values
        },
        password:{
            type: Sequelize.STRING,  // Define password as a string
            allowNull: false         // Do not allow null values
        },
        user_type: {
            type: Sequelize.ENUM('admin', 'user') // Define user_type as an enum ('admin' or 'user')
        }
    },
    {
        sequelize, // Pass the Sequelize instance
        modelName: 'users' // Name the model as 'users'
    }
);

// Define a Conversions class that extends Sequelize's Model class
class Conversions extends Sequelize.Model {}
// Initialize the Conversions model with its attributes
Conversions.init(
    {
        id: {
            type: Sequelize.INTEGER, // Define the id as an integer
            allowNull: false,        // Do not allow null values
            primaryKey: true,        // Set id as the primary key
            autoIncrement: true      // Enable auto-increment for id
        },
        currency_from:{
            type: Sequelize.STRING,  // Define currency_from as a string
            allowNull: false         // Do not allow null values
        },
        currency_to:{
            type: Sequelize.STRING,  // Define currency_to as a string
            allowNull: false         // Do not allow null values
        },
        amount: {
            type: Sequelize.DECIMAL(12, 2), // Define amount as a decimal with 12 digits in total and 2 decimal places
            allowNull: false                // Do not allow null values
        },
        converted_amount: {
            type: Sequelize.DECIMAL(12, 2), // Define converted_amount as a decimal with 12 digits in total and 2 decimal places
            allowNull: false                // Do not allow null values
        },
        conversion_date: {
            type: Sequelize.DATE, // Define conversion_date as a date type
            allowNull: false      // Do not allow null values
        }
    },
    {
        sequelize, // Pass the Sequelize instance
        modelName: 'conversions' // Name the model as 'conversions'
    }
);

// Define an Activities class that extends Sequelize's Model class
class Activities extends Sequelize.Model {}
// Initialize the Activities model with its attributes
Activities.init(
    {
        id: {
            type: Sequelize.INTEGER, // Define the id as an integer
            allowNull: false,        // Do not allow null values
            primaryKey: true,        // Set id as the primary key
            autoIncrement: true      // Enable auto-increment for id
        },
        activity:{
            type: Sequelize.TEXT, // Define activity as a text type
            allowNull: false      // Do not allow null values
        },
        activity_date: {
            type: Sequelize.DATE, // Define activity_date as a date type
            allowNull: false      // Do not allow null values
        }
    },
    {
        sequelize, // Pass the Sequelize instance
        modelName: 'activities' // Name the model as 'activities'
    }
);

// Setup a one-to-many relationship between User and Conversions
User.hasMany(Conversions, {as :'conversions', foreignKey:'userId'});
// Setup a many-to-one relationship between Conversions and User
Conversions.belongsTo(User, {as: 'user'});
// Setup a one-to-many relationship between User and Activities
User.hasMany(Activities, {as : 'activities', foreignKey:'userId'});
// Setup a many-to-one relationship between Activities and User
Activities.belongsTo(User, {as: 'user'});

// Define an asynchronous function to initialize the database
const initDb = async () => {
    // Synchronize the User model with the database
    await User.sync({ force: false, logging: false});
    // Synchronize the Conversions model with the database
    await Conversions.sync({ force: false, logging: false });
    // Synchronize the Activities model with the database
    await Activities.sync({ force: false, logging: false });
}

// Export the sequelize instance and the models for use in other modules
module.exports = {
    sequelize,
    User,
    Conversions,
    Activities,
    initDb,
};