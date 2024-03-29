require('dotenv').config();
const express = require('express');
const app = express();
const exphbs  = require('express-handlebars');
const session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
//const logger = require('morgan');
//const createError = require('http-errors');
const mongoose = require("mongoose");
var hbs = require('hbs');
// const puppeteer = require('puppeteer');
// const fs = require('fs');

const PORT=process.env.CONNECTION
const userRouter = require('./routes/user');
const adminRouter=require('./routes/admin')

mongoose.connect(process.env.MONGODB_URI);



app.set('views', path.join(__dirname, 'views'));
hbs.registerHelper('dateFormat', require( '../greenergy/public/javascripts/dateConvert'));
hbs.registerHelper('timeFormat', require( '../greenergy/public/javascripts/timeConvert'));

app.set('view engine', 'hbs');



//app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
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













































