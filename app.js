require('dotenv').config();
const express = require('express');
const app = express();
const session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
//const logger = require('morgan');
//const createError = require('http-errors');
const mongoose = require("mongoose");

const PORT=process.env.PORT
const userRouter = require('./routes/user');
const adminRouter=require('./routes/admin')

mongoose.connect(process.env.MONGODB_URI);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

//app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views/admin')));
app.use(express.static(path.join(__dirname, 'views/user')));

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use('/admin',adminRouter);
app.use('/', userRouter);

app.listen(PORT,()=>{
  console.log(`Server running in http://localhost:${PORT}`)
})

module.exports = app;













































// catch 404 and forward to error handler
//  app.use(function(req, res, next) {
//    next(createError(404));
//  });


/*
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
*/
