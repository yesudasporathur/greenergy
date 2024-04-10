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


//var MongoClient=require('mongodb').MongoClient
const User = require("../models/user");

const setNoCache=require('../public/javascripts/setNoCache');
const Cart = require('../models/cart');
const { template } = require('handlebars');

router.post('/invoice-pdf',setNoCache.user,requireLogin,setNoCache.user,isBlock,userPreload,orderController.invoicePdf)
router.get('/shop', setNoCache.user,requireLogin,setNoCache.user,isBlock,userPreload,productController.shopLoad);
router.post('/filter',setNoCache.user, requireLogin,setNoCache.user,isBlock,userPreload,productController.filter);
router.post('/coupon-apply',setNoCache.user, requireLogin,setNoCache.user,isBlock,userPreload,couponController.couponApply);
router.get('/coupon-apply/:code',setNoCache.user, requireLogin,setNoCache.user,isBlock,userPreload,couponController.couponApplyAvail);
router.get('/coupon-remove', setNoCache.user,requireLogin,setNoCache.user,isBlock,userPreload,couponController.couponRemove);
router.get('/clearSearch',setNoCache.user, requireLogin,setNoCache.user,isBlock,userPreload,productController.clearSearch);
router.get('/availability',setNoCache.user,requireLogin,setNoCache.user,isBlock,userPreload,productController.availability)
router.get('/product',setNoCache.user, requireLogin,setNoCache.user,isBlock,userPreload,productController.product)
router.get('/sign-in',setNoCache.user,isLoggedIn, setNoCache.user, userPreload,userController.signInLoad);
router.post('/sign-in',setNoCache.user,isLoggedIn, setNoCache.user, userPreload,userController.signInAction)
router.get('/forgot-password',setNoCache.user,isLoggedIn,setNoCache.user, userPreload,userController.forgotPassword)
router.post('/forgot-password',setNoCache.user,isLoggedIn,setNoCache.user, userPreload,userController.forgotPasswordForm)
router.get('/new-password',setNoCache.user,isLoggedIn,setNoCache.user, userPreload,userController.newPassword)
router.post('/new-password',setNoCache.user,isLoggedIn,setNoCache.user, userPreload,userController.newPasswordForm)
router.get('/create-account',setNoCache.user, isLoggedIn, setNoCache.user,userPreload, userController.create_account_get);
router.post('/create-account',  setNoCache.user, userPreload,userController.create_account_post);
router.get('/otp', setNoCache.user, userPreload, userController.otp_get);
router.get('/resend', setNoCache.user, userPreload,userController.otp_resend);
router.post('/otpcheck', setNoCache.user,userPreload, userController.otp_check);
router.get('/otp-success', setNoCache.user,userPreload, userController.otp_success)
router.post('/search', setNoCache.user, userPreload,userController.search_post);
router.get('/user-dashboard',setNoCache.user,requireLogin,userPreload,userController.userDashboard)
router.get('/profile',setNoCache.user,requireLogin,userPreload,userController.profileLoad)
router.get('/settings',setNoCache.user,requireLogin,userPreload,userController.settingsLoad)
router.post('/settings',setNoCache.user,requireLogin,userPreload,userController.settingsSave)
router.get('/address-add',setNoCache.user,requireLogin,userPreload,addressController.addressAddLoad)
router.post('/address-add',setNoCache.user,requireLogin,userPreload,addressController.addressAdd)
router.get('/addresses',setNoCache.user,requireLogin,userPreload,addressController.addresses)
router.get('/address-edit',setNoCache.user,requireLogin,userPreload,addressController.addressEditLoad)
router.post('/address-edit',setNoCache.user,requireLogin,userPreload,addressController.addressEdited)
router.get('/address-delete',setNoCache.user,requireLogin,userPreload,addressController.addressDeleteLoad)
router.get('/address-cart',setNoCache.user,requireLogin,userPreload,addressController.addressCart)
router.post('/address-cart',setNoCache.user,requireLogin,userPreload,addressController.addressCartSave)
router.get('/cart',setNoCache.user,requireLogin,userPreload,cartController.cartView)
router.post('/addToCart',setNoCache.user,requireLogin,userPreload,cartController.addToCartSave)
router.post('/removeFromCart',setNoCache.user,requireLogin,userPreload,cartController.removeFromCartSave)
router.get('/deleteFromCart',setNoCache.user,requireLogin,userPreload,cartController.deleteFromCart)
router.get('/checkout',setNoCache.user,requireLogin,userPreload,cartController.checkout)
router.post('/checkout',setNoCache.user,requireLogin,userPreload,cartController.checkoutOrdering)
router.post('/razorpay',setNoCache.user,requireLogin,userPreload,cartController.razorPayFn)
//router.get('/checkout-cod',setNoCache.user,requireLogin,userPreload,cartController.checkout_cod)
router.get('/coupons', setNoCache.user, requireLogin,setNoCache.user,isBlock,userPreload,couponController.coupons);
router.post('/pay-id',setNoCache.user,requireLogin,userPreload,cartController.payId)
router.get('/order-details',setNoCache.user,requireLogin,userPreload,orderController.orderDetailsLoad)
router.get('/order-list',setNoCache.user,requireLogin,userPreload,orderController.OrderListLoad)
router.post('/order-history-paging',setNoCache.user,requireLogin,userPreload,orderController.orderListPagin)
router.get('/order-cancel',setNoCache.user,requireLogin,userPreload,orderController.orderCancelLoad)
router.post('/orderInvoice',setNoCache.user,requireLogin,userPreload,orderController.orderInvoice)
router.get('/wishlist',setNoCache.user,requireLogin,userPreload,wishlistController.wishlist)
router.post('/wishlist-add',setNoCache.user,requireLogin,userPreload,wishlistController.wishlistAdd)
router.get('/wishlist-remove',setNoCache.user,requireLogin,userPreload,wishlistController.wishlistRemove)
router.get('/wallet',setNoCache.user,requireLogin,setNoCache.user,isBlock,userPreload,walletController.walletLoad)
router.post('/wallet-paging',setNoCache.user,requireLogin,setNoCache.user,isBlock,userPreload,walletController.walletPagin)
router.get('/logout', setNoCache.user,requireLogin, setNoCache.user, userPreload,userController.user_logout,()=>{})
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
    return res.redirect('/logout');
  }
  next()

}
async function userPreload(req,res,next){
  try{
    
  const cart=await Cart.findOne({u_id:req.session.user})
  cartnum=cart.items.length
  carttotal=cart.total
  const user=await User.findOne({_id:req.session.user})
  

    res.locals.referral=user.referral
  next()  
  }
  catch{
    cartnum=0
  carttotal=0
  next() 

  }
}

module.exports = router;