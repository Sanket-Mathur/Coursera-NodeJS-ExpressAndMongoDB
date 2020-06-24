var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require('./routes/dishRouter');
var promoRouter = require('./routes/promoRouter');
var leaderRouter = require('./routes/leaderRouter');
var favoriteRouter = require('./routes/favoriteRouter')
var mongoose = require('mongoose')
var passport = require('passport')
var authenticate = require('./authenticate') 
var config = require('./config')
const url = config.momgoUrl

const connect = mongoose.connect(url)

connect.then((db)=>{
	console.log('Connected correctly to server \n')
}, (err) =>{
	console.log(err)
})


var app = express();

app.all('*', (req, res, next) =>{
  if(req.secure){
    next()
  }
  else{
    res.redirect(307, 'https://' + req.hostname +':' + app.get('secPort') + req.url)
  }
})

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize())


app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use('/dishes',dishRouter);
app.use('/promotions',promoRouter);
app.use('/leaders',leaderRouter);
app.use('/favorites',favoriteRouter);

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
