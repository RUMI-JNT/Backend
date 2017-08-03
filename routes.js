const express = require('express');
const helpers = require('./helpers.js');

const router = express.Router();

const User = require('./db/db_schemas/user.js');
const Item = require('./db/db_schemas/item.js');
const UserItem = require('./db/db_schemas/user_item.js');

router.options('/*', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Authorization, Content-Length, X-Requested-With, Access-Control-Allow-Headers');
  return res.sendStatus(200);
});

router.get('/', (req, res) => res.status(200).send('hello'));

router.post('/v1/signup', async (req, res) => {
  console.log(req.body)
  console.log(req.params)

  const username = req.body.username;
  const password = req.body.password;
  const image = "";
  const email = req.body.email;
  const number = req.body.number;

  try {
    let user = await User.create({
        username,
        password,
        image,
        email,
        number
    })
      .then(async resp => {
        console.log("resp", resp)
        helpers.signUpEmail(email, res);
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        let data = {
          id: resp.dataValues.id,
          username: resp.dataValues.username,
          image: resp.dataValues.image
        }
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.status(200).end(JSON.stringify(data));
      })
      .catch(err => {
        console.log("err", err)
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        return res.status(400).end('Invalid user');
      })
  } catch (error) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    return res.status(400).end();
  }
})

router.post('/v1/login', async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  try {
    let user = await User.findOne({
      where: {
        username,
        password
      }
    }).then(async resp => {
      console.log("resp", resp)
      let data = {
        id: resp.dataValues.id,
        username: resp.dataValues.username,
        image: resp.dataValues.image
      }
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      res.status(200).end(JSON.stringify(data));
    })
      .catch(err => {
        console.log("err", err)
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        return res.status(400).end('Invalid user');
      })
  } catch (error) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    return res.status(400).end();
  }
});

router.post('/v1/updateprofile', (req, res) => {
  const userid = req.body.userid;
  const image = req.body.image;
  
  try {
    User.update({
      image
    }, {
      where: { id: userid }
    })
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    return res.status(200).end();
  } catch (error) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    return res.status(400);
  }
})

router.get('/v1/validateemail/*', async (req, res) => {
  const email = req.params[0];

  try {
    let user = await User.findOne({ where: { email } })
      .then(async resp => {
        console.log("resp", resp)
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        let data = {
          id: resp.dataValues.id,
          username: resp.dataValues.username,
          image: resp.dataValues.image,
          number: resp.dataValues.number,
          email: resp.dataValues.email
        }
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.status(200).end(JSON.stringify(data));
      })
      .catch(err => {
        console.log("err", err)
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        return res.status(400).end('Invalid user');
      })    
  } catch (error) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    return res.status(400);
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
        User.findOne({
          where: {
            id: requester.toString()
          }
        }).then(data => {
          console.log("data",data);
          sendInfo['user'] = data.dataValues.username;
          sendInfo['message'] = description;
          helpers.sendEmail(sendInfo, res);
        }).catch( err=> {
          console.log(err)
        })
        // if (sendBy === 'email') {
        // } else {
        //   console.log('inside else')
        //   await helpers.sendText(sendInfo, res);
        // }
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.status(200).end('item saved');
      } catch (err) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        return res.status(400).send(err);
      }
    }
  } catch (error) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    return res.status(400);
  }
})

router.get('/v1/useritems/*', async (req, res) => {
  const userId = req.params[0];
  console.log(typeof userId)
  try {
    let userItems = await UserItem.findAll({ 
      where: {
        requester_id: userId
      } 
    })
      .then((items) => {
        console.log('then1')
        let itemsArr = Promise.all(items.map(async (item) => {
          console.log('then1')
          
          let holder = await Item.findById(item.id);
          console.log(holder.dataValues)
          return holder.dataValues;
        })).then( results => {
          res.header("Access-Control-Allow-Origin", "*");
          res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
          res.status(200).send(JSON.stringify(results))
        })
        .catch(err => {
          res.header("Access-Control-Allow-Origin", "*");
          res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
          res.status(400).end(err);
        })
      })
  } catch (error) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.status(400).end(error);
  }
})

module.exports = router;
