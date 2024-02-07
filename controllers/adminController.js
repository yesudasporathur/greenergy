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
      res.redirect('/admin/user-list')
      console.log('logged in')
    } else {
      res.render('admin-login', { layout:false, message: 'Incorrect username or password' });
      console.log('login failed')

    }
}
const dashboard_get=(req,res)=>{ 
  res.render('admin-dashboard', { message: '' ,layout: false});
  console.log('login rendered')  
  setTimeout(() => {
    console.log("Admin Dash rendered")
  }, 1000);
}

const user_list_get=async (req,res)=>{
  
  
  try {
    // Retrieve products from MongoDB
    const users = await User.find();
    res.render('userlist',{users,layout:false})
} catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
}
}

const product_get = async(req,res)=>{
  try {
    // Retrieve products from MongoDB
    const users = await User.find();
    res.render('userlist',{users,layout:'layout2'})
  }
  catch(error){
    console.error(error)
    res.status(500).send("Internal server Error")
  }
}

  

const admin_logout=(req,res)=>{
  
//  req.session.destroy(err => {
//    if (err) {
//      console.error(err);
//    }
    res.render('/admin', { message: '' });
    console.log("Redirect")
 // });
}

module.exports={
  login_get,
  login_post,
  dashboard_get,
  user_list_get,
  admin_logout,
  product_get
  
}