var createError = require('http-errors');
//open postamn tool and type localhost:3000/dishes  by post     body of post is one object from db.json file 
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var authenticate = require('./authenticate');
var logger = require('morgan');
var session = require('express-session');
var FileStore = require('session-file-store')(session);


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require('./routes/dishRouter')
var leaderRouter = require('./routes/leaderRouter')
var parameterRouter = require('./routes/leadersparameters')
const mongoose = require('mongoose');
const Dishes = require('./models/dishes');
mongoose.connect('mongodb://localhost:27017/sai').then((db)=>{
  console.log('connected correctly to server');
},(err)=>{console.log(err)});
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser('12345-67890-09876-54321'));


app.use(session({
  name: 'session-id',
  secret: '12345-67890-09876-54321',
  saveUninitialized: false,
  resave: false,
  store: new FileStore()
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/users', usersRouter);

function auth (req, res, next) {
  console.log(req.user);

  if (!req.user) {
    var err = new Error('You are not authenticated!');
    err.status = 403;
    next(err);
  }
  else {
        next();
  }
}

app.use(auth);


app.use(express.static(path.join(__dirname, 'public')));


app.use('/dishes',dishRouter)
app.use('/leaders',leaderRouter)
app.use('/leaders:id',parameterRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
