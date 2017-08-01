const User = require('./db_schemas/user.js');
const Item = require('./db_schemas/item.js');
const UserItem = require('./db_schemas/user_item.js');

(async () => {
  await User.sync();
  await Item.sync();
  await UserItem.sync();
})()