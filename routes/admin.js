var express = require('express');
var router = express.Router();
var adminController=require('../controllers/adminController')
var MongoClient=require('mongodb').MongoClient

router.get('/', adminController.login_get);
router.post('/', adminController.login_post);

router.get('/dashboard', adminController.dashboard_get);
router.get('/user-list',adminController.user_list_get)
router.get('/admin-logout',adminController.admin_logout)
router.get('/product',adminController.product_get)


module.exports = router;
