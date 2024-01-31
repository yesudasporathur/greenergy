var express = require('express');
var router = express.Router();
var adminController=require('../controllers/adminController')
var MongoClient=require('mongodb').MongoClient

router.get('/', adminController.dashboard_get);
//router.post('/dashboard', adminController.dashboard_post)


module.exports = router;
