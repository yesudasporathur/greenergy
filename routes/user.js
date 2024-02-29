var express = require('express');
var router = express.Router();
var userController=require('../controllers/userController')
var addressController=require('../controllers/addressController')
var productController=require('../controllers/productController')

var MongoClient=require('mongodb').MongoClient
const User = require("../models/user");

const setNoCache=require('../public/javascripts/setNoCache')

router.get('/shop', requireLogin,setNoCache.user,isBlock,productController.shop_get);
router.get('/product', requireLogin,setNoCache.user,isBlock,productController.product)
router.get('/sign-in',isLoggedIn, setNoCache.user, userController.sign_in_get);
router.post('/sign-in', setNoCache.user, userController.sign_in_post)
router.get('/create-account',  setNoCache.user, userController.create_account_get);
router.post('/create-account',  setNoCache.user, userController.create_account_post);
router.get('/otp', setNoCache.user,  userController.otp_get);
router.get('/resend', setNoCache.user, userController.otp_resend);
router.post('/otpcheck', setNoCache.user, userController.otp_check);
router.get('/otp-success', setNoCache.user, userController.otp_success)
router.get('/search', setNoCache.user, userController.search_get);
router.get('/user-dashboard',setNoCache.user,requireLogin,userController.user_dashboard_get)
router.get('/profile',setNoCache.user,requireLogin,userController.profile_get)
router.get('/settings',setNoCache.user,requireLogin,userController.settings_get)
router.get('/address-add',setNoCache.user,requireLogin,addressController.address_add_get)
router.post('/address-add',setNoCache.user,requireLogin,addressController.address_add_post)
router.get('/addresses',setNoCache.user,requireLogin,addressController.addresses_get)
router.get('/address-edit',setNoCache.user,requireLogin,addressController.address_edit_get)
router.post('/address-edit',setNoCache.user,requireLogin,addressController.address_edit_post)
router.get('/logout', requireLogin, setNoCache.user, userController.user_logout)
router.get('/',  setNoCache.user, userController.home_get);
router.post('/',  setNoCache.user, userController.home_post)
router.get('/*', setNoCache.user, userController.page_not_found)

async function requireLogin(req, res, next) {
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
  const userdata=await User.findOne({_id: req.session.user})

  if(userdata.block==true){
    console.log("blocked")
    return res.redirect('/logout');
  }
  next()

}





module.exports = router;
