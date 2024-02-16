
const User = require("../models/user");
const Product=require("../models/product")
const Category=require("../models/category")

const otpGenerator = require('otp-generator');
const sendOTP=require('../public/modules/sendOTP')
const crypt=require('../public/modules/crypt')



const home_get=(req,res)=>{
  res.redirect('sign-in')
  //res.render('home-03', { title: 'Greenergy' });
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
const shop_get=async (req,res)=>{
  const products=await Product.find({delete:false})
    res.render('shop-02', {products, title: 'Shop' });
    setTimeout(() => {
      console.log("Shop rendered")
    }, 100);
  }
const sign_in_get=(req, res, next) =>{
  res.set({
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma' : 'no-cache',
    'Expires' : '0',
})
    res.render('sign-in', { message:'',title: 'Sign-in' });
    setTimeout(() => {
      console.log("Sign-in rendered")
    }, 100);
  }
  const sign_in_post=async(req, res, next) =>{
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email});

        

        // If user not found, return error
        if (!user ) {
            return res.status(400).render('sign-in',{ message: 'User not found' });
        }

        if (user.block) {
          return res.status(400).render('sign-in',{ message: 'User is blocked' });
      }


        // Check if password matches
        const data = await User.findOne({email:email});       
        const val = await crypt.cmpPassword(data.password,password);
        
        // If password does not match, return error
        if (val==false) {
          return res.status(400).render('sign-in',{ message: 'Invalid credentials' });
        }
        else{
          
          res.redirect('/shop'); 
        }

        

        // If user is valid, render the home page
        // Assuming you have a home template

    } catch (error) {
        console.error(error);
        res.status(500).render('sign-in', {message: 'Server error' });
    }
;

    }

const create_account_get=(req, res, next) =>{
    res.render('create-account', { title: 'Create-Account' ,message:''});
    setTimeout(() => {
      console.log("Create-Account rendered")
    }, 200);
  }
const create_account_post =  async (req, res) =>{
  var data={first_name,last_name,email,phone,password}=req.body
  const userExist=await User.exists({email})
  if(userExist){

    res.render('sign-in', { message: 'Email already registered. Please Login' });
    setTimeout(() => {
      console.log("User exist")
      
    }, 2000);
    
  }
  else if(req.body.password===req.body.confirmpassword){
    req.session.data=data
    //const user=await User.create({data})
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
mail_id=req.session.data.email
// Generate a 6-digit OTP
const otp = otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });
sendOTP(otp,mail_id)
req.session.otp=otp
console.log('Generated OTP:', otp);
    res.render('otp', { title: 'OTP Verification' });
        setTimeout(() => {
      console.log("OTP Verification rendered")
      //console.log(req.session.data)
    }, 200);
  }

  const otp_post=async(req, res, next)=> {
    let otp=req.session.otp
    
    if(req.body.userotp===otp){
      res.redirect('otp-success');

        // Hash the password along with the salt
         const hashedPassword = await crypt.hashPassword(req.session.data.password);
        console.log("password:  ",hashedPassword)
      await User.create({
        email:req.session.data.email,
        first_name: req.session.data.first_name,
        last_name: req.session.data.last_name,
        phone: req.session.data.phone,
        password: hashedPassword,
        block: 0,
        isAdmin: 0,
      })      
    }
  
     
     else{
      res.render('otp', { message: 'OTP invalid' });
      
     }
    }

const otp_success=(req,res)=>{
  res.render('otp-success', { message: 'Your account have been created. Please proceed to login.' });
}

const product=async (req,res)=>{
  const id=req.query.id
  
  const details=await Product.find({ _id: id });
setTimeout(() => {
  console.log(details)

  
}, 5000);

  res.render('product-details', {details})
  console.log("Product details rendered")
}
  

  
const search_get=(req, res, next)=> {
    res.render('!search!not!defined!', { title: 'Search' });
    setTimeout(() => {
      console.log("Search rendered")
    }, 100);
  }

const page_not_found=(req,res)=>{
  res.status(404).render('404', { title: 'Search' ,layout:false});
  }


  const user_logout=(req,res)=>{
  
    req.session.destroy(err => {
      if (err) {
        console.error(err);
      }
      res.redirect('/sign-in')
      setTimeout(() => {
        console.log("Redirect")
  
        
      }, 2200);
   });
  }

module.exports={
    home_get,
    home_post,
    shop_get,
    sign_in_get,
    sign_in_post,
    create_account_get,
    create_account_post,
    otp_get,
    otp_post,
    otp_success,
    search_get,
    page_not_found,
    product,
    user_logout
}