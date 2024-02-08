const User = require("../models/user");
const Product=require("../models/product")


  

let userdetails,userexist=false;


const login_get=(req,res)=>{
  {
    res.render('admin-login', { message: '' ,layout:false});
    console.log('login rendered')
  };
}
const login_post=(req,res)=>{
    const Username = 'admin';
    const Password = 'admin';
    const { username, password } = req.body;
    if (username === Username && password === Password) {
      //req.session.admin = username;
      //res.render('admin-dashboard', { message: '',userdetails,findmessage:'',updatemessage:'',userexist });
      res.redirect('/admin/users')
      console.log('logged in')
    }
    else
    {
      res.render('admin-login', { layout:false, message: 'Incorrect username or password' });
      console.log('login failed')

    }
}
const dashboard_get=(req,res)=>{ 
  res.render('admin-dashboard', { message: '' ,layout:'layout2'});
  console.log('login rendered')  
  setTimeout(() => {
    console.log("Admin Dash rendered")
  }, 1000);
}

const user_list_get=async (req,res)=>{
  
  
  try {
    // Retrieve products from MongoDB
    const users = await User.find();
    res.render('userlist',{users,layout:'layout2'})
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
  setTimeout(() => {
    console.log(users)
    
  }, 2000);
  res.render('user-details',{users, layout:'layout2'})
}



const user_details_post=async(req,res)=>{
  const {_id,first_name,last_name,email,phone,block}=req.body
  res.redirect('/admin/users')
  await User.findOneAndReplace({_id:_id},{first_name,last_name,email,phone,block})

  setTimeout(() => {
    console.log(_id,first_name,last_name,email,phone,block)

    
  }, 2000);
}



const products_get = async(req,res)=>{
  try {
    // Retrieve products from MongoDB
    const products = await Product.find({delete: false});
    res.render('page-products-grid',{products, layout:'layout2'})
  }
  catch(error){
    console.error(error)
    res.status(500).send("Internal server Error")
  }
}

const product_edit_get=async(req,res)=>{
  const _id=req.query.id
  const products=await Product.find({_id:_id})
  res.render('product-edit',{products, layout: 'layout2'})
}

const product_edit_post=async(req,res)=>{
  const _id=req.query.id
  const name=req.body.name
  const description=req.body.description
  const brand=req.body.brand
  const mrp=req.body.mrp
  const sp=req.body.sp
  const category=req.body.category
  await Product.findByIdAndUpdate({_id:_id},{
    name: name,
    sp: sp,
    mrp: mrp,
    description: description,
    brand: brand,
    category: category,
  });
  if(req.body.imgUpdate=== '1'){
    const images = req.files.map(file =>   file.filename );
    await Product.findByIdAndUpdate({_id:_id},{
      images: images
    });
  }
  if(req.body.softdel=== '1'){
    const images = req.files.map(file =>   file.filename );
    await Product.findByIdAndUpdate({_id:_id},{
      delete: true
    });
  }
}

const product_add_get=(req,res)=>{
  res.render('page-form-product-2',{layout: 'layout2'})
}
const product_add_post=async (req,res, next) => {
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
  console.log(products)

}

  

const admin_logout=(req,res)=>{
  
  req.session.destroy(err => {
    if (err) {
      console.error(err);
    }
    res.redirect('/admin', { message: '' });
    console.log("Redirect")
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
  product_edit_post

  
}