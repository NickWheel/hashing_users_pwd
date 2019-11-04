var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const Users = require('./models/userModel')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// DB connection
mongoose.connect('mongodb+srv://admin:1111@cluster0-7cnbh.mongodb.net/test?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;
db.once('open', (err)=>{
  if(err) throw err;
  console.log('Connected to db!');
});


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// secret middleware tests if cookie is ok => show a page
// THE PROBLEM WITH THIS MIDDLEWARE
app.use('/users/secret', function(req,res,next){
  if(req.cookies.hash && req.cookies.login){
    Users.findOne({login: req.cookies.login})
    .then(data=>{
      let firstFiveSymbolsOfPwd = data.pwd.match(/(.{1,5})/);
      if(req.cookies.hash === firstFiveSymbolsOfPwd){
        next();
      }
    })
    .catch(err=>{if(err) throw err});
  } else{
    res.send('<h1>404</h1> \n\n You are lox without a cookie.');
  }
});
app.use('/users/unlogin', (req,res,next)=>{
  // i dunno if this conditions could work lol
  if(req.cookies.hash || req.cookies.login || (req.cookies.login&&req.cookies.hash) ){
    console.log('condition is working!');
    res.clearCookie('login').clearCookie('hash');
    next();
  }else{
    res.send('<h1>404</h1> \n\n go for a cookie donbass');
  }
})

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
