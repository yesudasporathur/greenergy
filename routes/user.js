var express = require('express');
var router = express.Router();
var userController=require('../controllers/userController')
var MongoClient=require('mongodb').MongoClient

router.get('/', userController.home_get);
router.post('/', userController.home_post)
router.get('/shop', userController.shop_get);
router.get('/product',userController.product)
router.get('/sign-in', userController.sign_in_get);
router.post('/sign-in',userController.sign_in_post)
router.get('/create-account', userController.create_account_get);
router.post('/create-account', userController.create_account_post);
router.get('/otp', userController.otp_get);
router.post('/otp',userController.otp_post);
router.get('/otp-success',userController.otp_success)
//router.get('/*',userController.page_not_found)
//router.get('/search', userController.search_get);


module.exports = router;
