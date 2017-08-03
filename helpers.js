require('dotenv').config();

const nodemailer = require('nodemailer');
const axios = require('axios');
const twilio = require('twilio');

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

module.exports = {
  signUpEmail: (email, res) => {
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.RUMI_EMAIL,
        pass: process.env.RUMI_PASS
      }
    })

    var mailOptions = {
      from: process.env.RUMI_EMAIL,
      to: email,
      subject: 'Welcome to Rūmi!',
      text: `Thank you for joining RUMI app that lets you minimize confusion and conflicts over resources one share at a time.

      To get started simply navigate to the Share Screen (hyperlink this to that screen), enter your item, description and desired recipient’s information.

      Then select the timeframe for which you want to share your item.

      Then submit!`

    };
    

        transporter.sendMail(mailOptions, async (err, info) => {
      if (err) {
        res.status(400).end(err);
      } else {
        return "Email Sent";
      }
    })
  },
  sendText: async (info, res) => {
    console.log(info)
    await client.sendMessage({
      to: `+1${info.number}`,
      from: process.env.TWILIO_NUM,
      body: `Hey, check this item out`,
      mediaUrl: info.image
    }, (err, resp) => {
      if (err) {
        console.error('Error sending SMS: ', err);
      } else {
        console.log(resp, 'response');
      }
    });
  },
  sendEmail: async (info, res) => {
    console.log(info, 'dsaxs')
    
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.RUMI_EMAIL,
        pass: process.env.RUMI_PASS
      }
    })

    var mailOptions = {
      from: process.env.RUMI_EMAIL,
      to: info.email,
      subject: 'Rūmi Item Creation',
      text: `Hey, ${info.user} created a rumi to ${info.message}, check it out!`
    };

    let result = await transporter.sendMail(mailOptions, async (err, info) => {
      if (err) {
        res.status(400).end(err);
      } else {
        console.log(info)
        return "Email Sent";
      }
    }).then(result => {
      console.log("result", result)
    })
      .catch(errr => {
        console.log(errr)
      });
    return result;
  }
}