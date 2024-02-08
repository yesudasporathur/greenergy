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

router.get('/', adminController.login_get);
router.post('/', adminController.login_post);

router.get('/dashboard', adminController.dashboard_get);
router.get('/users',adminController.user_list_get)
router.get('/user-details',adminController.user_details_get)
router.post('/user-details',adminController.user_details_post)

router.get('/logout',adminController.admin_logout)
router.get('/products',adminController.products_get)
router.get('/product-add',adminController.product_add_get)
router.get('/product-edit',adminController.product_edit_get)
router.post('/product-edit',upload.array('images', 10),adminController.product_edit_post)
router.post('/product-add',upload.array('images', 10),adminController.product_add_post)



module.exports = router;
