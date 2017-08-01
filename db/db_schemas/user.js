const Sequelize = require('sequelize');
const sequelize = require('../../server').connection;

const User = sequelize.define('user', {
  username: {
    type: Sequelize.STRING,
    unique: true,   
  },
  password: {
    type: Sequelize.STRING
  },
  image: {
    type: Sequelize.STRING
  },
  email: {
    type: Sequelize.STRING
  }, 
  number: {
    type: Sequelize.INTEGER
  }
});

module.exports = User;

