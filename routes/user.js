var express = require('express');
var router = express.Router();
var userController=require('../controllers/userController')
var addressController=require('../controllers/addressController')
var productController=require('../controllers/productController')
var cartController=require('../controllers/cartController')
var orderController=require('../controllers/orderController')
var wishlistController=require('../controllers/wishlistController.js')
const walletController=require('../controllers/walletController.js')
const couponController=require('../controllers/couponController.js')


var MongoClient=require('mongodb').MongoClient
const User = require("../models/user");

const setNoCache=require('../public/javascripts/setNoCache');
const Cart = require('../models/cart');
const { template } = require('handlebars');

router.get('/shop', requireLogin,setNoCache.user,isBlock,userPreload,productController.shop_get);
router.post('/filter', requireLogin,setNoCache.user,isBlock,userPreload,productController.filter);
router.post('/coupon-apply', requireLogin,setNoCache.user,isBlock,userPreload,couponController.couponApply);
router.get('/coupon-apply/:code', requireLogin,setNoCache.user,isBlock,userPreload,couponController.couponApplyAvail);
router.get('/coupon-remove', requireLogin,setNoCache.user,isBlock,userPreload,couponController.couponRemove);
router.get('/clearSearch', requireLogin,setNoCache.user,isBlock,userPreload,productController.clearSearch_get);
router.get('/availability',requireLogin,setNoCache.user,isBlock,userPreload,productController.availability)
router.get('/product', requireLogin,setNoCache.user,isBlock,userPreload,productController.product)
router.get('/sign-in',isLoggedIn, setNoCache.user, userPreload,userController.sign_in_get);
router.post('/sign-in',isLoggedIn, setNoCache.user, userPreload,userController.sign_in_post)
router.get('/forgot-password',isLoggedIn,setNoCache.user, userPreload,userController.forgotPassword)
router.post('/forgot-password',isLoggedIn,setNoCache.user, userPreload,userController.forgotPasswordForm)
router.get('/new-password',isLoggedIn,setNoCache.user, userPreload,userController.newPassword)
router.post('/new-password',isLoggedIn,setNoCache.user, userPreload,userController.newPasswordForm)
router.get('/create-account', isLoggedIn, setNoCache.user,userPreload, userController.create_account_get);
router.post('/create-account',  setNoCache.user, userPreload,userController.create_account_post);
router.get('/otp', setNoCache.user, userPreload, userController.otp_get);
router.get('/resend', setNoCache.user, userPreload,userController.otp_resend);
router.post('/otpcheck', setNoCache.user,userPreload, userController.otp_check);
router.get('/otp-success', setNoCache.user,userPreload, userController.otp_success)
router.post('/search', setNoCache.user, userPreload,userController.search_post);
router.get('/user-dashboard',setNoCache.user,requireLogin,userPreload,userController.user_dashboard_get)
router.get('/profile',setNoCache.user,requireLogin,userPreload,userController.profile_get)
router.get('/settings',setNoCache.user,requireLogin,userPreload,userController.settings_get)
router.post('/settings',setNoCache.user,requireLogin,userPreload,userController.settings_post)
router.get('/address-add',setNoCache.user,requireLogin,userPreload,addressController.address_add_get)
router.post('/address-add',setNoCache.user,requireLogin,userPreload,addressController.address_add_post)
router.get('/addresses',setNoCache.user,requireLogin,userPreload,addressController.addresses_get)
router.get('/address-edit',setNoCache.user,requireLogin,userPreload,addressController.address_edit_get)
router.post('/address-edit',setNoCache.user,requireLogin,userPreload,addressController.address_edit_post)
router.get('/address-delete',setNoCache.user,requireLogin,userPreload,addressController.address_delete_get)
router.get('/address-cart',setNoCache.user,requireLogin,userPreload,addressController.address_cart_get)
router.post('/address-cart',setNoCache.user,requireLogin,userPreload,addressController.address_cart_post)
router.get('/cart',setNoCache.user,requireLogin,userPreload,cartController.cart_view_get)
router.post('/addToCart',setNoCache.user,requireLogin,userPreload,cartController.add_to_cart_post)
router.post('/removeFromCart',setNoCache.user,requireLogin,userPreload,cartController.remove_from_cart_post)
router.get('/deleteFromCart',setNoCache.user,requireLogin,userPreload,cartController.delete_from_cart_get)
router.get('/checkout',setNoCache.user,requireLogin,userPreload,cartController.checkout)
router.post('/checkout',setNoCache.user,requireLogin,userPreload,cartController.checkoutOrdering)
router.post('/razorpay',setNoCache.user,requireLogin,userPreload,cartController.razorPayFn)
//router.get('/checkout-cod',setNoCache.user,requireLogin,userPreload,cartController.checkout_cod)

router.get('/coupons',  requireLogin,setNoCache.user,isBlock,userPreload,couponController.coupons);

router.post('/pay-id',setNoCache.user,requireLogin,userPreload,cartController.payId)
router.get('/order-details',setNoCache.user,requireLogin,userPreload,orderController.order_details_get)
router.get('/order-list',setNoCache.user,requireLogin,userPreload,orderController.order_list_get)
router.get('/order-cancel',setNoCache.user,requireLogin,userPreload,orderController.order_cancel_get)
router.post('/orderInvoice',setNoCache.user,requireLogin,userPreload,orderController.orderInvoice)
router.get('/wishlist',setNoCache.user,requireLogin,userPreload,wishlistController.wishlist)
router.post('/wishlist-add',setNoCache.user,requireLogin,userPreload,wishlistController.wishlistAdd)
router.get('/wishlist-remove',setNoCache.user,requireLogin,userPreload,wishlistController.wishlistRemove)
router.get('/wallet',setNoCache.user,requireLogin,userPreload,walletController.walletLoad)
router.get('/logout', requireLogin, setNoCache.user, userPreload,userController.user_logout,()=>{console.log("cookie"+req.cookies.redirecturl)})
router.get('/',  setNoCache.user, userPreload,userController.home_get);
router.post('/',  setNoCache.user, userPreload,userController.home_post)
router.get('/*', setNoCache.user, userPreload,userController.page_not_found)

async function requireLogin(req, res, next) {
  req.session.user='65dc11c766e50223004d914e'
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
async function userPreload(req,res,next){
  try{
    
  const cart=await Cart.findOne({u_id:req.session.user})
  cartnum=cart.items.length
  carttotal=cart.total
  const user=await User.findOne({u_id:req.session.user})
    res.locals.referral=user.referral
    console.log(user.referral)
  next()  
  }
  catch{
    cartnum=0
  carttotal=0
  next() 

  }
}

module.exports = router;