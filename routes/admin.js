var express = require('express');
var router = express.Router();
var brandController=require('../controllers/brandController')
var userController=require('../controllers/userController')
const productController=require('../controllers/productController')
const categoryController=require('../controllers/categoryController')


const multer=require('../public/javascripts/multer')
const setNoCache=require('../public/javascripts/setNoCache')

//var MongoClient=require('mongodb').MongoClient

  

router.get('/logout', requireLogin, userController.admin_logout)
router.get('/dashboard', setNoCache,  requireLogin, userController.admin_dashboard_get);
router.get('/users', setNoCache,  requireLogin, userController.admin_user_list_get)
router.get('/user-details', setNoCache,  requireLogin, userController.admin_user_details_get)
router.post('/user-details', setNoCache,  requireLogin, userController.admin_user_details_post)
router.get('/products', setNoCache, requireLogin,   productController.products_get)
router.get('/product-add', setNoCache, requireLogin,  productController.product_add_get)
router.get('/product-edit', setNoCache,  requireLogin, productController.product_edit_get)
router.post('/product-edit', setNoCache,  requireLogin, multer.array('images', 10),productController.product_edit_post)
router.post('/product-add', setNoCache, requireLogin,  multer.array('images', 10),productController.product_add_post)
router.get('/categories', setNoCache,  requireLogin, categoryController.categories_get)
router.get('/category-add', setNoCache,  requireLogin, categoryController.category_add_get)
router.post('/category-add', setNoCache, requireLogin,  categoryController.category_add_post)
router.get('/category-edit', setNoCache,  requireLogin, categoryController.category_edit_get)
router.post('/category-edit', setNoCache, requireLogin,  categoryController.category_edit_post)
router.get('/brands', setNoCache,  requireLogin, brandController.brands_get)
router.get('/brand-add', setNoCache, requireLogin,  brandController.brand_add_get)
router.post('/brand-add', setNoCache, requireLogin,  multer.single('image'),brandController.brand_add_post)
router.get('/brand-edit', setNoCache, requireLogin,  brandController.brand_edit_get)
router.post('/brand-edit', setNoCache, requireLogin,  multer.single('image'),brandController.brand_edit_post)
router.get('/', setNoCache, userController.admin_login_get);
router.post('/', setNoCache,  userController.admin_login_post);
router.get('/*', setNoCache, userController.admin_page_not_found)




function requireLogin(req, res, next) {
  if (!req.session.admin) {
    return res.redirect('/admin');
  }
  next();
}




module.exports = router;
