'use strict';

//npm modules
const express = require('express');
const morgan = require('morgan');
const Promise = require('bluebird');
const cors = require('cors');
const mongoose = require('mongoose');
const debug = require('debug')('note:server');

//app modules
const listRouter = require('./route/list-route.js');
const noteRouter = require('./route/note-route.js');

//module constants
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/notedev';
const app = express();

//connect to database
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

//app middleware
app.use(morgan('dev'));
app.use(cors());

//routes
app.use(listRouter);
app.use(noteRouter);


const server = module.exports = app.listen(PORT, function() {
  debug(`server up ${PORT}`);
});

server.isRunning = true;
