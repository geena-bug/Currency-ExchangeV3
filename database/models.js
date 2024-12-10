const Sequelize = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite3'
});

class User extends Sequelize.Model {}
User.init(
  {
      id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true
      },
      first_name: {
          type: Sequelize.STRING,
          allowNull: false
      },
      last_name: {
          type: Sequelize.STRING,
          allowNull: false
      },
      email: {
          type: Sequelize.STRING,
          allowNull: false
      },
      password:{
          type: Sequelize.STRING,
          allowNull: false
      },
      user_type: {
          type: Sequelize.ENUM('admin', 'user')
      }
  },
  {
    sequelize,
    modelName: 'users'
  }
);

class Conversions extends Sequelize.Model {}
Conversions.init(
  {
      id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true
      },
      currency_from:{
          type: Sequelize.STRING,
          allowNull: false
      },
      currency_to:{
          type: Sequelize.STRING,
          allowNull: false
      },
      amount: {
          type: Sequelize.DECIMAL(12, 2),
          allowNull: false
      },
      converted_amount: {
          type: Sequelize.DECIMAL(12, 2),
          allowNull: false
      },
      conversion_date: {
          type: Sequelize.DATE,
          allowNull: false
      }
  },
  {
    sequelize,
    modelName: 'conversions'
  }
);

class Activities extends Sequelize.Model {}
Activities.init(
  {
      id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true
      },
    activity:{
      type: Sequelize.TEXT,
      allowNull: false
    },
      activity_date: {
          type: Sequelize.DATE,
          allowNull: false
      }
  },
  {
    sequelize,
    modelName: 'activities'
  }
);

User.hasMany(Conversions, {as :'conversions',foreignKey:'userId'})
Conversions.belongsTo(User, {as: 'user'})
User.hasMany(Activities, {as : 'activities', foreignKey:'userId'})
Activities.belongsTo(User, {as: 'user'})

const initDb = async () => {
    await User.sync({ force: false, logging: false});
    await Conversions.sync({ force: false, logging: false });
    await Conversions.sync({ force: false, logging: false });
}

module.exports = {
  sequelize,
    User,
    Conversions,
    Activities,
    initDb,
};
