var express = require('express');
var router = express.Router();
var brandController=require('../controllers/brandController')
var userController=require('../controllers/userController')
const productController=require('../controllers/productController')
const categoryController=require('../controllers/categoryController')
const orderController=require('../controllers/orderController')
const couponController=require('../controllers/couponController')
const puppeteer = require('puppeteer');
const fs = require('fs');



const multer=require('../public/javascripts/multer')
const setNoCache=require('../public/javascripts/setNoCache')

//var MongoClient=require('mongodb').MongoClient



router.post('/generatepdf',orderController.generatePdf)
router.post('/generatecsv',orderController.generateCsv)
router.get('/coupons', setNoCache.admin,  requireLogin, couponController.couponList)
router.get('/coupon-block/:_id', setNoCache.admin, requireLogin, couponController.couponBlock);
router.get('/coupon-unblock/:_id', setNoCache.admin, requireLogin, couponController.couponUnblock);
router.get('/coupon-delete/:_id', setNoCache.admin, requireLogin, couponController.couponDelete);


router.get('/coupon-add', setNoCache.admin,  requireLogin, couponController.couponAdd)
router.post('/coupon-add', setNoCache.admin,  requireLogin, couponController.couponAdding)
router.get('/coupon-edit', setNoCache.admin,  requireLogin, couponController.couponEdit)
router.post('/coupon-edit', setNoCache.admin,  requireLogin, couponController.couponEditing)

router.get('/logout', requireLogin, userController.admin_logout)
router.get('/dashboard', setNoCache.admin,  requireLogin, userController.admin_dashboard_get);
router.get('/users', setNoCache.admin,  requireLogin, userController.admin_user_list_get)
router.get('/user-details', setNoCache.admin,  requireLogin, userController.admin_user_details_get)
router.post('/user-details', setNoCache.admin,  requireLogin, userController.admin_user_details_post)
router.get('/products', setNoCache.admin, requireLogin,   productController.products_get)
router.get('/product-add', setNoCache.admin, requireLogin,  productController.product_add_get)
router.get('/product-edit', setNoCache.admin,  requireLogin, productController.product_edit_get)
router.post('/product-edit', setNoCache.admin,  requireLogin, multer.array('images', 10),productController.product_edit_post)
router.post('/product-add', setNoCache.admin, requireLogin,  multer.array('images', 10),productController.product_add_post)
router.get('/product-block/:_id', setNoCache.admin, requireLogin, productController.product_block);
router.get('/product-unblock/:_id', setNoCache.admin, requireLogin, productController.product_unblock);
router.get('/category-block/:_id', setNoCache.admin, requireLogin, categoryController.categoryBlock);
router.get('/category-unblock/:_id', setNoCache.admin, requireLogin, categoryController.categoryUnblock);
router.get('/categories', setNoCache.admin,  requireLogin, categoryController.categories_get)
router.get('/category-add', setNoCache.admin,  requireLogin, categoryController.category_add_get)
router.post('/category-add', setNoCache.admin, requireLogin,  categoryController.category_add_post)
router.get('/category-edit', setNoCache.admin,  requireLogin, categoryController.category_edit_get)
router.post('/category-edit', setNoCache.admin, requireLogin,  categoryController.category_edit_post)
router.post('/catDiscount', setNoCache.admin, requireLogin,  categoryController.catDiscount)
router.get('/brands', setNoCache.admin,  requireLogin, brandController.brands_get)
router.get('/brand-add', setNoCache.admin, requireLogin,  brandController.brand_add_get)
router.post('/brand-add', setNoCache.admin, requireLogin,  multer.single('image'),brandController.brand_add_post)
router.get('/brand-edit', setNoCache.admin, requireLogin,  brandController.brand_edit_get)
router.post('/brand-edit', setNoCache.admin, requireLogin,  multer.single('image'),brandController.brand_edit_post)
router.get('/orders', setNoCache.admin,  requireLogin, orderController.orderList)
router.get('/order-edit', setNoCache.admin,  requireLogin, orderController.order_edit_get)
router.post('/order-edit', setNoCache.admin,  requireLogin, orderController.order_edit_post)
router.get('/cancel-order', setNoCache.admin,  requireLogin, orderController.cancelOrder)
//router.get('/sales-report', setNoCache.admin,  requireLogin, orderController.salesReport)
router.post('/order-filter', setNoCache.admin,  requireLogin, orderController.orderFilter)

router.get('/', setNoCache.admin, userController.admin_login_get);
router.post('/', setNoCache.admin,  userController.admin_login_post);
router.get('/*', setNoCache.admin, userController.admin_page_not_found)




function requireLogin(req, res, next) {
  req.session.admin='65dc11c766e50223004d914e'

  if (!req.session.admin) {
    return res.redirect('/admin');
  }
  next();
}




module.exports = router;
