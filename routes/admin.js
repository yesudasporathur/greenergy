var express = require('express');
var router = express.Router();
var adminController=require('../controllers/adminController')
//var MongoClient=require('mongodb').MongoClient
const multer  = require('multer');


// Set up Multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/images/') // Specify the directory where uploaded files will be stored
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname) // Generate unique filenames
    }
  })
  const upload = multer({ storage: storage });

  function requireLogin(req, res, next) {
    if (!req.session.admin) {
      return res.redirect('/admin');
    }
    next();
  }

router.get('/logout', setNoCache, adminController.admin_logout)
router.get('/dashboard', requireLogin,  setNoCache, adminController.dashboard_get);
router.get('/users', requireLogin,  setNoCache, adminController.user_list_get)
router.get('/user-details', requireLogin,  setNoCache, adminController.user_details_get)
router.post('/user-details', requireLogin,  setNoCache, adminController.user_details_post)
router.get('/products', requireLogin, setNoCache,  adminController.products_get)
router.get('/product-add', requireLogin, setNoCache,  adminController.product_add_get)
router.get('/product-edit', requireLogin,  setNoCache, adminController.product_edit_get)
router.post('/product-edit', requireLogin,  setNoCache, upload.array('images', 10),adminController.product_edit_post)
router.post('/product-add', requireLogin, setNoCache,  upload.array('images', 10),adminController.product_add_post)
router.get('/categories', requireLogin,  setNoCache, adminController.categories_get)
router.get('/category-add', requireLogin,  setNoCache, adminController.category_add_get)
router.post('/category-add', requireLogin, setNoCache,  adminController.category_add_post)
router.get('/category-edit', requireLogin,  setNoCache, adminController.category_edit_get)
router.post('/category-edit', requireLogin, setNoCache,  adminController.category_edit_post)
router.get('/brands', requireLogin,  setNoCache, adminController.brands_get)
router.get('/brand-add', requireLogin, setNoCache,  adminController.brand_add_get)
router.post('/brand-add', requireLogin, setNoCache,  upload.single('image'),adminController.brand_add_post)
router.get('/brand-edit', requireLogin, setNoCache,  adminController.brand_edit_get)
router.post('/brand-edit', requireLogin, setNoCache,  upload.single('image'),adminController.brand_edit_post)
router.get('/', setNoCache, adminController.login_get);
router.post('/', setNoCache,  adminController.login_post);
router.get('/*', setNoCache, adminController.page_not_found)


function setNoCache(req, res, next) {
  res.set({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
  });
  next();
}






module.exports = router;
