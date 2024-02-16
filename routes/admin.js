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

//router.use(requireLogin)
router.get('/', adminController.login_get);
router.post('/', adminController.login_post);
router.get('/logout',adminController.admin_logout)


router.get('/dashboard', requireLogin, adminController.dashboard_get);
router.get('/users', requireLogin, adminController.user_list_get)
router.get('/user-details', requireLogin, adminController.user_details_get)
router.post('/user-details', requireLogin, adminController.user_details_post)

router.get('/products', requireLogin, adminController.products_get)
router.get('/product-add', requireLogin, adminController.product_add_get)
router.get('/product-edit', requireLogin, adminController.product_edit_get)
router.post('/product-edit', requireLogin, upload.array('images', 10),adminController.product_edit_post)
router.post('/product-add', requireLogin, upload.array('images', 10),adminController.product_add_post)
router.get('/categories', requireLogin, adminController.categories_get)
router.get('/category-add', requireLogin, adminController.category_add_get)
router.post('/category-add', requireLogin, adminController.category_add_post)
router.get('/category-edit', requireLogin, adminController.category_edit_get)
router.post('/category-edit', requireLogin, adminController.category_edit_post)
router.get('/brands', requireLogin, adminController.brands_get)
router.get('/brand-add', requireLogin, adminController.brand_add_get)
router.post('/brand-add', requireLogin, upload.single('image'),adminController.brand_add_post)
router.get('/brand-edit', requireLogin, adminController.brand_edit_get)
router.post('/brand-edit', requireLogin, upload.single('image'),adminController.brand_edit_post)







module.exports = router;
