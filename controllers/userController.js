
const User = require("../models/user");
const otpGenerator = require('otp-generator');
const sendOTP=require('../public/modules/sendOTP')

const home_get=(req,res)=>{ 
  res.render('home-03', { title: 'Greenergy' });
  setTimeout(() => {
    console.log("Login rendered")
  }, 100);
}
const home_post=(req,res)=>{
    console.log(req.body)
    MongoClient.connect('mongodb://localhost:27017',function(err,client){
      if(err){
        console.log('error')
      }
      else
      {
        console.log("connected")
      }
    })
  }
const shop_get=(req,res)=>{
    res.render('shop-02', { title: 'Shop' });
    setTimeout(() => {
      console.log("Shop rendered")
    }, 100);
  }
const sign_in_get=(req, res, next) =>{
    res.render('sign-in', { title: 'Sign-in' });
    setTimeout(() => {
      console.log("Sign-in rendered")
    }, 100);
  }

const create_account_get=(req, res, next) =>{
    res.render('create-account', { title: 'Create-Account' });
    setTimeout(() => {
      console.log("Create-Account rendered")
    }, 200);
  }
const create_account_post =  async (req, res) =>{
  var data={first_name,last_name,email,phone,password}=req.body

   if(req.body.password===req.body.confirmpassword){
    console.log(data)
    const user=await User.create({data})
    setTimeout(() => {
      console.log("Create-Account done")
    }, 100);
    res.redirect('/otp')

   }
   else{
    res.render('create-account', { message: 'Password not matching' });
    
   }

   //console.log(user)
    //res.render('create-account', { title: 'Create-Account' });
    
  }

const otp_get=(req, res, next)=> {
mail_id='dasporathur@gmail.com'
// Generate a 6-digit OTP
const otp = otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });
sendOTP(otp,mail_id)
console.log('Generated OTP:', otp);
    res.render('otp', { title: 'OTP Verification' });
        setTimeout(() => {
      console.log("OTP Verification rendered")
    }, 200);
  }

  
const search_get=(req, res, next)=> {
    res.render('!search!not!defined!', { title: 'Search' });
    setTimeout(() => {
      console.log("Search rendered")
    }, 100);
  }
module.exports={
    home_get,
    home_post,
    shop_get,
    sign_in_get,
    create_account_get,
    create_account_post,
    otp_get,
    search_get
}