
const User = require("../models/user");
const Product=require("../models/product")
const Category=require("../models/category")

const otpGenerator = require('otp-generator');
const sendOTP=require('../public/modules/sendOTP')
const crypt=require('../public/modules/crypt')

let title="Greenergy"



const home_get=(req,res)=>{
  res.redirect('/sign-in')
  //res.render('user/home-03', { title: 'Greenergy' });
  console.log("Login rendered")
}
const home_post=(req,res)=>{
    MongoClient.connect(process.env.MONGODB_URI,function(err,client){
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
  const products=await Product.find({delete:false}).populate('category')
    res.render('user/shop-02', {user: req.session.user, products:products, title: 'Shop' });
    console.log("shop_get rendered")
  }
const sign_in_get=(req, res, next) =>{
  

    res.render('user/sign-in', { user: req.session.user,message:'',title: 'Sign-in' });

    console.log("sign_in_get rendered")
  }
  const sign_in_post=async(req, res, next) =>{
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email});
        // If user not found, return error
        if (!user ) {
            return res.status(400).render('user/sign-in',{ message: 'User not found' });
        }

        if (user.block) {
          return res.status(400).render('user/sign-in',{ message: 'User is blocked' });
      }


        // Check if password matches
        const data = await User.findOne({email:email});       
        const val = await crypt.cmpPassword(data.password,password);
        
        // If password does not match, return error
        if (val==false) {
          return res.status(400).render('user/sign-in',{ message: 'Invalid credentials' });
        }
        else{
          req.session.user=email
          res.redirect('/shop'); 
        }

        

        // If user is valid, render the home page
        // Assuming you have a home template

    } catch (error) {
        console.error(error);
        res.status(500).render('user/sign-in', {message: 'Server error' });
    }
;

    }

const create_account_get=(req, res, next) =>{
    res.render('user/create-account', {user: req.session.user, title: 'Create-Account' ,message:''});
    console.log("Create-Account rendered")
  }
const create_account_post =  async (req, res) =>{
  var data={first_name,last_name,email,phone,password}=req.body
  const userExist=await User.exists({email})
  if(userExist){

    res.render('user/sign-in', {user: req.session.user, message: 'Email already registered. Please Login' });
    console.log("User exist")
    
  }
  else if(req.body.password===req.body.confirmpassword){
    req.session.data=data
    //const user=await User.create({data})
    console.log("Create-Account done")
    res.redirect('/otp')

   }
   else{
    res.render('user/create-account', { user: req.session.user,message: 'Password not matching' });
    
   }

   //console.log(user)
    //res.render('user/create-account', {user: req.session.user, title: 'Create-Account' });
    
  }

const otp_get=(req, res, next)=> {
mail_id=req.session.data.email
// Generate a 6-digit OTP
const otp = otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });
sendOTP(otp,mail_id)
req.session.otp=otp
console.log('Generated OTP:', otp);
    res.render('user/otp', { user: req.session.user,title: 'OTP Verification' });
    console.log("OTP Verification rendered")
      //console.log(req.session.data)
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
      res.render('user/otp', { user: req.session.user,message: 'OTP invalid' });
      
     }
    }

const otp_success=(req,res)=>{
  res.render('user/otp-success', { user: req.session.user,message: 'Your account have been created. Please proceed to login.' });
}

const product=async (req,res)=>{
  const id=req.query.id
  
  const details=await Product.find({ _id: id }).populate(['brand','category']);
  const related=await Product.find({_id:{$ne:id}});

  res.render('user/product-details', {user: req.session.user,details,related})
  console.log("Product details rendered")
}
  

  
const search_get=(req, res, next)=> {
    res.render('user/!search!not!defined!', {user: req.session.user, title: 'Search' });
    console.log("Search rendered")
  }

const page_not_found=(req,res)=>{
  res.status(404).render('user/404', { title: 'Search' , layout:false});
  }


  const user_logout=(req,res)=>{
  
    req.session.destroy(err => {
      if (err) {
        console.error(err);
      }
      res.redirect('/sign-in')
      console.log("Redirect")
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