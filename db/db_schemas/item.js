const Sequelize = require('sequelize');
const sequelize = require('../../server').connection;

const Item = sequelize.define('item', {
  name: {
    type: Sequelize.STRING,
  },
  image: {
    type: Sequelize.STRING
  },
  description: {
    type: Sequelize.STRING
  },
  times: {
    type: Sequelize.JSONB
  }
});

module.exports = Item;

