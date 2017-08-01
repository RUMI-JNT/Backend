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
      subject: 'Sending Email using Node.js',
      text: 'That was easy!'
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
    console.log(info)
    
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
      text: {
        image: info.image, 
        message: info.message
      }
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