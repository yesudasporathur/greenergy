var express = require('express');
var router = express.Router();
var userController=require('../controllers/userController')
var MongoClient=require('mongodb').MongoClient
const User = require("../models/user");

const setNoCache=require('../public/javascripts/setNoCache')

router.get('/shop', requireLogin,setNoCache,isBlock,userController.shop_get);
router.get('/product', requireLogin,setNoCache,isBlock,userController.product)
router.get('/sign-in',isLoggedIn, setNoCache, userController.sign_in_get);
router.post('/sign-in', setNoCache, userController.sign_in_post)
router.get('/create-account',  setNoCache, userController.create_account_get);
router.post('/create-account',  setNoCache, userController.create_account_post);
router.get('/otp', setNoCache,  userController.otp_get);
router.post('/otp', setNoCache, userController.otp_post);
router.get('/otp-success', setNoCache, userController.otp_success)
router.get('/search', setNoCache, userController.search_get);
router.get('/user-dashboard',setNoCache,requireLogin,userController.user_dashboard_get)
router.get('/profile',setNoCache,requireLogin,userController.profile_get)
router.get('/logout', requireLogin, setNoCache, userController.user_logout)
router.get('/',  setNoCache, userController.home_get);
router.post('/',  setNoCache, userController.home_post)
router.get('/*', setNoCache, userController.page_not_found)

async function requireLogin(req, res, next) {
  console.log(req.session.user)
    if (!req.session.user) {
      return res.redirect('/sign-in');
    }
    next();
}
async function isLoggedIn(req, res, next) {
    if (req.session.user) {
      return res.redirect('/shop');
    }
    next();
}
async function isBlock(req,res,next){
  const userdata=await User.findOne({email: req.session.user})

  if(userdata.block==true){
    console.log("blocked")
    return res.redirect('/logout');
  }
  next()

}





module.exports = router;
