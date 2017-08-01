const express = require('express');
const helpers = require('./helpers.js');

const router = express.Router();

const User = require('./db/db_schemas/user.js');
const Item = require('./db/db_schemas/item.js');
const UserItem = require('./db/db_schemas/user_item.js');

router.get('/', (req, res) => res.status(200).send('hello'));

router.post('/v1/signup', async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const image = req.body.image;
  const email = req.body.email;
  const number = req.body.number;

  try {
    let user = await User.create({
        username,
        password,
        image,
        email,
        number
    });
    await helpers.signUpEmail(email, res);
    console.log(user);
    console.log(signUpEmail);
    res.status(200).end(`${user.dataValues.id}`);
  } catch (error) {
    return res.status(400).send(error);
  }
})

router.post('/v1/updateprofile', (req, res) => {
  const userid = req.body.userid;
  const image = req.body.image;
  
  try {
    User.update({
      image
    }, {
      where: { id: userid }
    })
    return res.status(200).end();
  } catch (error) {
    return res.status(400).send(error);
  }
})

router.get('/v1/validateemail/*', async (req, res) => {
  const email = req.params[0];

  try {
    let user = await User.findOne({ where: { email } });
    return res.status(200).end(JSON.stringify(user));
  } catch (error) {
    return res.status(400).send(error);
  }
})

router.post('/v1/createitem', async (req, res) => {
  const name = req.body.name;
  const image = req.body.image;
  const description = req.body.description;
  const times = req.body.times;
  const requester = req.body.requester;
  const acceptor = req.body.acceptor;
  const sendBy = req.body.sendBy;
  const sendInfo = req.body.sendInfo;
  
  try {
    let item = await Item.create({
      name,
      image,
      description,
      times
    });
    if(item) {
      const item_id = item.dataValues.id;
      const email = item.dataValues.email;
      const phone = item.dataValues.phone;
      
      try {
        let userItem = await UserItem.create({
          requester_id: requester,
          acceptor_id: acceptor,
          item_id
        })
        // if (sendBy === 'email') {
        //   await helpers.sendEmail(sendInfo, res);
        // } else {
        //   console.log('inside else')
        //   await helpers.sendText(sendInfo, res);
        // }
        res.status(200).end('item saved');
      } catch (err) {
        return res.status(400).send(err);
      }
    }
  } catch (error) {
    return res.status(400).send(error);
  }
})

router.get('/v1/useritems/*', async (req, res) => {
  const userId = req.params[0];

  try {
    let userItems = await UserItem.findAll({ 
      where: {
        requester_id: userId
      } 
    })
      .then((items) => {
        let itemsArr = Promise.all(items.map(async (item) => {
          let holder = await Item.findById(item.id);
          return holder.dataValues;
        })).then( results => {
          res.status(200).send(JSON.stringify(results))
        })
      })
  } catch (error) {
    res.status(400).end(error);
  }
})

module.exports = router;
