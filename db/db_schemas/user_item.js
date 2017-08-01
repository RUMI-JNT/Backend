const Sequelize = require('sequelize');
const sequelize = require('../../server').connection;

const UserItem = sequelize.define('users_items', {
  requester_id: {
    type: Sequelize.STRING,
  },
  acceptor_id: {
    type: Sequelize.STRING,
  },
  item_id: {
    type: Sequelize.STRING
  }
});

module.exports = UserItem;

