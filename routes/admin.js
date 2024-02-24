var express = require('express');
var router = express.Router();
var brandController=require('../controllers/brandController')
var userController=require('../controllers/userController')
const productController=require('../controllers/productController')
const categoryController=require('../controllers/categoryController')


const multer=require('../public/javascripts/multer')
const setNoCache=require('../public/javascripts/setNoCache')

//var MongoClient=require('mongodb').MongoClient

  

router.get('/logout', setNoCache, userController.admin_logout)
router.get('/dashboard', requireLogin,  setNoCache, userController.admin_dashboard_get);
router.get('/users', requireLogin,  setNoCache, userController.admin_user_list_get)
router.get('/user-details', requireLogin,  setNoCache, userController.admin_user_details_get)
router.post('/user-details', requireLogin,  setNoCache, userController.admin_user_details_post)
router.get('/products', requireLogin, setNoCache,  productController.products_get)
router.get('/product-add', requireLogin, setNoCache,  productController.product_add_get)
router.get('/product-edit', requireLogin,  setNoCache, productController.product_edit_get)
router.post('/product-edit', requireLogin,  setNoCache, multer.array('images', 10),productController.product_edit_post)
router.post('/product-add', requireLogin, setNoCache,  multer.array('images', 10),productController.product_add_post)
router.get('/categories', requireLogin,  setNoCache, categoryController.categories_get)
router.get('/category-add', requireLogin,  setNoCache, categoryController.category_add_get)
router.post('/category-add', requireLogin, setNoCache,  categoryController.category_add_post)
router.get('/category-edit', requireLogin,  setNoCache, categoryController.category_edit_get)
router.post('/category-edit', requireLogin, setNoCache,  categoryController.category_edit_post)
router.get('/brands', requireLogin,  setNoCache, brandController.brands_get)
router.get('/brand-add', requireLogin, setNoCache,  brandController.brand_add_get)
router.post('/brand-add', requireLogin, setNoCache,  multer.single('image'),brandController.brand_add_post)
router.get('/brand-edit', requireLogin, setNoCache,  brandController.brand_edit_get)
router.post('/brand-edit', requireLogin, setNoCache,  multer.single('image'),brandController.brand_edit_post)
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
