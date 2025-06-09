var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var app = express();

const cors = require('cors');

const apiRouter = require('./routes/index');

const errorHandler = require('./middlewares/errorMiddleware');

app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use("/api", apiRouter);

app.use(errorHandler);

module.exports = app;
