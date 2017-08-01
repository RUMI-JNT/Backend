require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');

const server = express();
const PORT = process.env.PORT;
const connection = new Sequelize(process.env.DATABASE_URL);
module.exports.connection = connection;

const User = require('./db/tables.js');
const routes = require('./routes');

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }));
server.use('/', routes);

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
