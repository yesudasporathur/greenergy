const crypt=require('../public/modules/crypt')
const User = require("../models/user");
const Product=require("../models/product")
const Category=require("../models/category");
const Brand=require("../models/brand");



  

let userdetails,userexist=false;


const login_get=(req,res)=>{
  if(req.session.admin){
    res.redirect('/admin/users')

  }
  else
  {
    res.render('admin/admin-login', { message: '' ,layout:false});
    console.log('Admin Login rendered')
  };
}
const login_post=async(req,res)=>{
    const { username, password } = req.body;
    
    try {
      // Find the user by email
      const user = await User.findOne({ email:username, isAdmin:true});
      

      

      // If user not found, return error
      if (!user ) {
          return res.status(400).render('admin/admin-login',{ message: 'Unauthorised access' ,layout:false});
      }
      

      // Check if password matches
      const data = await User.findOne({email:username});       

      // If password does not match, return error
      const val = await crypt.cmpPassword(data.password,password);
        
        // If password does not match, return error
        if (val==false) {
          return res.status(400).render('admin-login',{ message: 'Invalid credentials' ,layout:false});
      }
      req.session.admin = username;
      res.redirect('/admin/users')
      //res.render('userlist', { message: '',userdetails,findmessage:'',updatemessage:'',userexist });
      console.log('Logged in as '+req.session.admin)
      


      

      // If user is valid, render the home page
      // Assuming you have a home template

  } catch (error) {
      console.error(error);
      res.status(500, '/', {message: 'Server error' ,layout:false});
  }
;

  }

const dashboard_get=(req,res)=>{ 
  res.render('admin-dashboard', { message: '' ,layout:'admin/layout'});
  console.log("Admin Dashboard rendered")  
  
}

const user_list_get=async (req,res)=>{
  
  
  try {
    // Retrieve products from MongoDB
    const users = await User.find();
    res.render('admin/userlist',{users,layout:'admin/layout'})
  }
  catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
}
}

const blockUser = async (req, res) => {
  try {
      await User.findByIdAndUpdate({ _id: req.body.userId }, { $set: { is_blocked: 1 } });
      res.status(200).json({ success: true, message: 'User blocked successfully.' });
  } catch (error) {
      console.error(error.message);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

const unblockUser = async (req, res) => {
  try {
      await User.findByIdAndUpdate({ _id: req.body.userId }, { $set: { is_blocked: 0 } });
      res.status(200).json({ success: true, message: 'User unblocked successfully.' });
  } catch (error) {
      console.error(error.message);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

const user_details_get=async(req,res)=>{
  const id=req.query.id
  const users = await User.find({_id:id});
  console.log(users+"\nUser details loaded")
  res.render('admin/user-details',{users, layout:'admin/layout'})
}

const brands_get=async(req,res)=>{
  const brands=await Brand.find()
  res.render('admin/page-brands',{brands, layout: 'admin/layout'})
}
const brand_add_get=async(req,res)=>{
  res.render('brand-add',{layout:'admin/layout'})
}

const brand_add_post=async (req,res, next) => {
  const name=req.body.name
  const image = req.file.filename
  const brands=new Brand({
    name: name,
    image: image,
  })
  await brands.save();
  console.log(req.file)
  res.redirect('brands')


}

const brand_edit_get=async(req,res)=>{
  const _id=req.query.id
  const brands=await Brand.find({_id:_id})
  res.render('brand-edit',{brands, layout: 'admin/layout'})
}
const brand_edit_post=async(req,res)=>{
  const _id=req.query.id
  const name=req.body.name
  await Brand.findByIdAndUpdate({_id:_id},{
    name: name,
  });
  res.redirect('brands')
}

const user_details_post=async(req,res)=>{
  const {_id,first_name,last_name,email,phone,block,password,isAdmin}=req.body
  if(req.session.admin==email && block==true){
  const id=req.query.id
  const users = await User.find({_id:id});
  console.log("Invalid operation")
  res.render('user-details',{users,message:"Invalid operation", layout:'admin/layout'})
  }
  else{
  await User.findOneAndReplace({_id:_id},{first_name,last_name,email,phone,block,password,isAdmin})
  res.redirect('users')
  }

}



const products_get = async(req,res)=>{
  try {
    // Retrieve products from MongoDB
    const products = await Product.find().populate('category');
    console.log("Products list loaded");
    res.render('page-products-list',{products, layout:'admin/layout'})
  }
  catch(error){
    console.error(error)
    res.status(500).send("Internal server Error")
  }
}

const product_edit_get=async(req,res)=>{
  const _id=req.query.id
  const products = await Product.find({ _id: _id }).populate(['brand', 'category']);
  const brands=await Brand.find()
  const categories=await Category.find()


  console.log("Product details loaded:\n"+products)
  res.render('product-edit',{products,categories,brands, layout: 'admin/layout'})
}

const product_edit_post=async(req,res)=>{
  const _id=req.query.id
  const name=req.body.name
  const description=req.body.description
  const brand=req.body.brand
  const mrp=req.body.mrp
  const sp=req.body.sp
  const category=req.body.category
  const update=await Product.findByIdAndUpdate({_id:_id},{
    name: name,
    sp: sp,
    mrp: mrp,
    description: description,
    brand: brand,
    category: category,
  });
  console.log(update)
  if(req.body.imgUpdate=== '1'){
    const images = req.files.map(file =>   file.filename );
    await Product.findByIdAndUpdate({_id:_id},{
      images: images
    });
  }
  if(req.body.softdel){
    await Product.findByIdAndUpdate({_id:_id},{
      delete: true
    });
  }
  else {
    await Product.findByIdAndUpdate({ _id: _id }, {
        delete: false
    });
  }
  res.redirect('products')
}

const product_add_get=async (req,res)=>{
  const message = req.query.message;

  const categories=await Category.find()
  const brands=await Brand.find()
  res.render('page-form-product-2',{categories,brands,message: message, layout: 'admin/layout'})
}
const product_add_post=async (req,res, next) => {
  try{
    const name=req.body.name
  const images = req.files.map(file=>file.filename );
  const description=req.body.description
  const brand=req.body.brand
  const mrp=req.body.mrp
  const sp=req.body.sp
  const category=req.body.category
  const products=new Product({
    name: name,
    sp: sp,
    mrp: mrp,
    description: description,
    brand: brand,
    category: category,
    images: images,
    delete: false
  })
  await products.save();
  console.log("New product: "+products)
  res.redirect('products')
  }
  catch{
    console.log("Product adding failed")
    res.redirect('/admin/product-add?message=Product+registration+failed!+Try+Again');

  }


}

const categories_get=async(req,res)=>{
  const categories=await Category.find({delete:false})
  res.render('categories',{categories, layout: 'admin/layout'})
}

const category_add_get=async(req,res)=>{
  res.render('category-add',{layout: 'admin/layout'})
}

const category_add_post=async(req,res)=>{
  const name=req.body.name
  await Category.create({name,delete:false})  
  res.redirect('categories')
}

const category_edit_get=async(req,res)=>{
  const _id=req.query.id
  const categories=await Category.find({_id:_id})
  res.render('category-edit',{categories, layout: 'admin/layout'})
}

const category_edit_post=async(req,res)=>{
    const _id=req.query.id
    const name=req.body.name
    if(req.body.softdel=== '1'){
      await Category.findByIdAndUpdate({_id:_id},{
        delete: true
      });
    }
    await Category.findByIdAndUpdate({_id:_id},{
      name: name,
    })
    res.redirect('categories')
}

  

const admin_logout=(req,res)=>{
  
  req.session.destroy(err => {
    if (err) {
      console.error(err);
    }
    res.redirect('/admin/')
    console.log("Redirected to Admin Login")
 });
}

module.exports={
  login_get,
  login_post,
  dashboard_get,
  user_list_get,
  user_details_get,
  user_details_post,
  admin_logout,
  products_get,
  product_add_get,
  product_add_post,
  blockUser,
  unblockUser,
  product_edit_get,
  product_edit_post,
  categories_get,
  category_add_get,
  category_add_post,
  category_edit_get,
  category_edit_post,
  brands_get,
  brand_add_get,
  brand_add_post,
  brand_edit_get,
  brand_edit_post

  
}