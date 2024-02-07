var createError = require('http-errors');
var express = require('express');
const session = require('express-session');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const mongoose = require("mongoose");
mongoose.connect('mongodb://127.0.0.1:27017/greenergy');

var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');
var adminRouter=require('./routes/admin')
var productRouter=require('./routes/product')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views/assets')));


app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));
function requireLogin(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/sign-in');
  }
  next();
}



//app.use('/', indexRouter);
//app.use('/user', userRouter);
app.use('/', userRouter);
app.use('/admin',adminRouter);
//app.use('/product', productRouter);


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
app.listen(3000,()=>{
  console.log("Server running in http://localhost:3000")
})

module.exports = app;
