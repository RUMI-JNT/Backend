const Sequelize = require('sequelize');
const sequelize = require('../../server').connection;

const UserItem = sequelize.define('item', {
  requester_id: {
    type: Sequelize.INTEGER,
  },
  acceptor_id: {
    type: Sequelize.INTEGER,
  },
  item_id: {
    type: Sequelize.INTEGER
  }
});

module.exports = UserItem;

