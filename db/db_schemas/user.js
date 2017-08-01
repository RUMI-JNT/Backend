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
    type: Sequelize.STRING,
    unique: true,   
  }, 
  number: {
    type: Sequelize.STRING
  }
});

module.exports = User;

