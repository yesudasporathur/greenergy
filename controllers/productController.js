const Product=require("../models/product")
const Category=require("../models/category")
const Brand=require('../models/brand')
const Cart = require("../models/cart")

let title="Products"


const products_get = async(req,res)=>{
    try {
      // Retrieve products from MongoDB
      const products = await Product.find().populate('category');
      console.log("Products list loaded");
      res.render('admin/page-products-list',{products,title, layout:'admin/layout'})
    }
    catch(error){
      console.error(error)
      res.status(500).send("Internal server Error")
    }
  }
  
  
  const product_edit_get=async(req,res)=>{
    const message=req.query.message
    const _id=req.query.id
    const products = await Product.find({ _id: _id }).populate(['brand', 'category']);
    const brands=await Brand.find({delete: false})
    const categories=await Category.find({delete: false})
  
  
    console.log("Product details loaded:\n"+products)
    res.render('admin/product-edit',{message:message,products,categories,brands,title, layout: 'admin/layout'})
  }
  
  const product_edit_post=async(req,res)=>{
    const _id=req.body._id
    const name=req.body.name
    const sku=req.body.sku
    const description=req.body.description
    const brand=req.body.brand
    const mrp=req.body.mrp
    const sp=req.body.sp
    const stock=req.body.stock
    const discount=Math.ceil(100-(sp/mrp)*100)
    const category=req.body.category
    const isDup=await Product.findOne({_id:{$ne:_id},sku:sku})
    if(isDup){
      res.redirect(`product-edit?message=Duplicate&id=${_id}`)
    }
    else
    {
    const update=await Product.findByIdAndUpdate({_id:_id},{
      name: name,
      sku:sku,
      sp: sp,
      mrp: mrp,
      stock:stock,
      discount: discount,
      description: description,
      brand: brand,
      category: category,
    });
    console.log(update)
    if(req.body.imgUpdate=== '1'){
      const images = req.files.map(file =>   file.filename );
      await Product.findByIdAndUpdate({_id:_id},{
        images: []
      });
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
    res.redirect('/admin/products')
  }
    
  
    
    
  }
const product_block=async (req,res)=>{
  const _id=req.params._id
  await Product.findByIdAndUpdate({ _id: _id }, {delete: true})
  res.redirect('/admin/products')

}
const product_unblock=async (req,res)=>{
  const _id=req.params._id
  await Product.findByIdAndUpdate({ _id: _id }, {delete: false})
  res.redirect('/admin/products')

}


  
  const product_add_get=async (req,res)=>{
    const message = req.query.message;
  
    const categories=await Category.find({delete: false})
    const brands=await Brand.find({delete: false})
    res.render('admin/page-form-product-2',{categories,brands,message: message,title:`${title}`, layout: 'admin/layout'})
  }
  const product_add_post=async (req,res, next) => {
    try{
      const sku=req.body.sku
      const name=req.body.name
      const images = req.files.map(file=>file.filename)
      const description=req.body.description
    const brand=req.body.brand
    const mrp=req.body.mrp
    const sp=req.body.sp
    const stock=req.body.stock
    const discount=Math.ceil(100-(sp/mrp)*100)
    const category=req.body.category
    const products=new Product({
      sku: sku,
      name: name,
      sp: sp,
      mrp: mrp,
      stock:stock,
      discount: discount,
      description: description,
      brand: brand,
      category: category,
      images: images,
      delete: false
    })
    console.log(products)
    const isDuplicate=await Product.findOne({sku:sku})
    console.log(isDuplicate)
    if(isDuplicate){
      res.redirect('/admin/product-add?message=Duplicate+SKU+found!+Try+Again');
    }
    else{
      await products.save();
      console.log("New product: "+products)
      res.redirect('products')
    }
    }
    catch{
      console.log("Product adding failed")
      res.redirect('/admin/product-add?message=Product+registration+failed!+Try+Again');
    }
  }

  const product=async (req,res)=>{
    const id=req.query.id
    
    const details=await Product.find({ _id: id }).populate(['brand','category']);
    const related=await Product.find({_id:{$ne:id}});
    

    res.render('user/product-details', {user: req.session.user,details,title,related, cartnum, carttotal})
    console.log("Product details rendered")
  }
  const clearSearch_get=(req,res)=>{
    req.session.search=""
    res.redirect('shop')
  }
  const availability=(req,res)=>{
    if(req.session.availability==true){
      req.session.availability=false
    }
    else{
      req.session.availability=true
    }
    res.redirect('shop')
  }
  const shop_get=async (req,res)=>{
    const brand=await Brand.find({delete: false})
    if(!req.session.search){
      req.session.search=""
    }
    const products=await Product.find({delete:false, name: {$regex:new RegExp(req.session.search, 'i')}}).populate('category')

    const categories=await Category.find({delete: false})
    const cart = await Cart.findOne({user:req.session.user})

      res.render('user/shop-02', { brand,shop:true, user: req.session.user,search:req.session.search ,title, categories,products:products, title: 'Shop' , cartnum,carttotal});
      console.log("shop_get rendered")
      
    }


const filter=async (req,res)=>{
  const {category,pricemin,pricemax,brand,rating,sort}=req.body
  let search=req.body.search
  if(!search){
    search=""
  }
  switch (sort) {
    case 'lowtohigh':
        sorting = 'sp:1';
        break;
    case 'hightolow':
        sorting = 'sp:-1';
        break;
    case 'popularity':
      sorting='popularity:-1'
      break;
    case 'rating':
      sorting='rating:-1'
      break;
    case 'atoz':
      sorting = 'name:1';
        break;
    case 'ztoa':
      sorting = 'name:-1';
        break;
    default:
      sorting = 'sp:1';
      break;

  }
  const products=await Product.find({delete:false, name: {$regex:new RegExp(search, 'i')}}).populate('category').sort(sorting)
  console.log(products)
  return res.status(200).json("OK")

}

module.exports={
    products_get,
    product_edit_get,
    product_edit_post,
    product_add_get,
    product_add_post,
    product_block,
    product_unblock,
    product,
    shop_get,
    clearSearch_get,
    availability,
    filter
}