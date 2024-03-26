var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var mobileNetRouter = require('./routes/mobilenet');
var cocoSsdRouter = require('./routes/coco-ssd');

var app = express();

app.use(express.json());
app.use(logger('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/mobilenet', mobileNetRouter);
app.use('/coco-ssd', cocoSsdRouter);

module.exports = app;
