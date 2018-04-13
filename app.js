const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const session = require('express-session');
const bodyParser = require("body-parser");
const flash = require ('connect-flash');


const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const admins = require ('./routes/admins');
const log = require ('./routes/log');
const mailer = require('./routes/mailer');
const winston = require('./config/winston');
const multer = require('./config/multer');

const app = express();




//map the components folder as a route
app.use('/components', express.static(`${__dirname}/public/components`));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

var hbs = require('hbs');
hbs.registerPartials(`${__dirname}/views/partials`);

var hbsUtils = require('hbs-utils')(hbs);
hbsUtils.registerWatchedPartials(`${__dirname}/views/partials`);

app.use(morgan('dev'));
app.use(morgan('combined',{stream: winston.stream}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use( "/uploads", express.static( path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'bower_components')));

app.use(session({
    secret: '12345',
    name: 'Session',
    resave: true,
    saveUninitialized: true
}));

app.use(flash());


    //Routes
app.use('/admins',admins);
app.use('/log',log);
app.use('/', indexRouter);
app.use('/views', usersRouter);
app.use('/mailer', mailer);


    //URL Encode
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  app.get('views/404.hbs')
  //next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
