const Product=require("../models/product")
const Category=require("../models/category")
const Brand=require('../models/brand')
const Cart = require("../models/cart")

let title="Products"


const productsList = async(req,res)=>{
    try {
      // Retrieve products from MongoDB
      const categories=await Category.find()
      const brands = await Brand.find()
      console.log("Products list loaded");
      res.render('admin/page-products-list',{brands,categories,title, layout:'admin/layout'})
    }
    catch(error){
      console.error(error)
      res.status(500).send("Internal server Error")
    }
  }
  
  
const product_edit_get=async(req,res)=>{
  try{
    const message=req.query.message
    const _id=req.query.id
    const products = await Product.find({ _id: _id }).populate(['brand', 'category']);
    const brands=await Brand.find({delete: false})
    const categories=await Category.find({delete: false})
    req.session.images=products[0].images


    // console.log("Product details loaded:\n"+products)
    res.render('admin/product-edit',{message:message,products,categories,brands,title, layout: 'admin/layout'})
  }
  catch(err){
    console.log(err)
    res.redirect('/admin')
  }
}
  



const product_edit_post=async(req,res)=>{
  try{
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
    if(req.body.imgUpdate!== '1'){


      const images = req.files.map(file => file.filename);
      if (!req.session.images) {
        req.session.images = [];
      }
      images.forEach(image => {
        req.session.images.push(image);
      });
      const uniqueSet = new Set();
      req.session.images = req.session.images.filter(image => {
        if (uniqueSet.has(image)) {
          return false;
        } else {
          uniqueSet.add(image);
          return true;
        }
      });
      console.log(req.session.images);

      await Product.findByIdAndUpdate({_id:_id},{
        images: []
      });
      await Product.findByIdAndUpdate({_id:_id},{
        images: req.session.images
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
  catch(err){
    console.log(err)
    res.redirect('/admin/')
  }
  
  

  
  
}
const product_block=async (req,res)=>{
  try{
    const _id=req.params._id
    await Product.findByIdAndUpdate({ _id: _id }, {delete: true})
    res.redirect('/admin/products')

  }
  catch(err){
    console.log(err)
  }

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



const ProductAddSave=async (req,res, next) => {
  try{
    const {sku,name,description,brand,mrp,sp,stock,category}=req.body
    const images = req.session.images
    const discount=Math.ceil(100-(sp/mrp)*100)
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
      // image count>2, productstock>0, mrp>0
      if(products.images.length>2 && products.stock>0 && products.mrp>0){
        console.log(true)
        await products.save();
      console.log("New product: "+products)
      res.redirect('products')
      }
      
    }
    req.session.images=[]
  }
  catch(err){
    console.log("Product adding failed",err)
    res.redirect('/admin/product-add?message=Product+registration+failed!+Try+Again');
  }
}

const productFilter=async(req,res)=>{
  try{
      let {search,page,limit,sort,category,brand}=req.body        
      res.json(await filterFn(search,page,limit,sort,category,brand))
      console.log("productFilter");
  }
  catch(err){
    console.log(err)
      res.status(500).json("Error occured")
  }
    



}
const filterFn=async(search,page,limit,sort,category,brand)=>{
  
  if(!page){
      page=1
  }
  let skip=(page-1)*limit
  switch(sort){
      default: sorting={order_id:-1}
  }
  console.log(category)
  if(category=='All categories'){
    category=await Category.find()
  }
  if(brand=='All brands'){
    brand=await Brand.find()
  }
  let findFn={category:category,brand:brand,name: { $regex: new RegExp(search, 'i') }};
  const count=await Product.countDocuments(findFn)
  const products=await Product.find(findFn).sort(sorting).skip(skip).limit(limit);
  let pages=Math.ceil(count/limit)
  return {products,pages,page,count}
}

const product=async (req,res)=>{
  const id=req.query.id
  
  const details=await Product.find({ _id: id }).populate(['brand','category']);
  const related=await Product.find({_id:{$ne:id}});
  

  res.render('user/product-details', {user: req.session.user,details,title,related, cartnum, carttotal})
  console.log("Product details rendered")
}


const clearSearch=(req,res)=>{
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


const shopLoad=async (req,res)=>{
  if(!req.session.search){
    req.session.search=""
  }
  const categories=await Category.find({delete: false})
  const brand=await Brand.find({delete: false})
  res.render('user/shop-02', { brand,shop:true, user: req.session.user,search:req.session.search ,title, categories, title: 'Shop' , cartnum,carttotal});
  console.log("shopLoad rendered")

    
}


const filter=async (req,res)=>{
  try{
    let {search,category,pricemin,pricemax,brand,rating,sort,availability,page}=req.body
  let ratingVal = rating.reduce((acc, curr) => {
      return acc < curr ? acc : curr;
  })
  if(category=='all'){
    category = await Category.find({delete: false})
  }
  if(!search){
    search=""
  }
  switch (sort) {
    case 'lowtohigh':
        sorting = {"sp":1};
        break;
    case 'hightolow':
        sorting = {"sp":-1}
        break;
    case 'popularity':
      sorting={"popularity":-1}
      break;
    case 'rating':
      sorting={"rating":-1}
      break;
    case 'atoz':
      sorting = {"name":1};
        break;
    case 'ztoa':
      sorting = {"name":-1};
        break;
    default:
      sorting = {};
      break;

  }
  let stockMin=0
  if(availability){
    stockMin=1
  }
  let limit=6
  let skip=(page-1)*limit
  const count=await Product.countDocuments({delete:false,sp:{$gte:pricemin,$lte:pricemax},rating:{$gte:ratingVal},stock:{$gte:stockMin},category:{$in:category},brand: {$in:brand}, name: {$regex:new RegExp(search, 'i')}})
  const products=await Product.find({delete:false,sp:{$gte:pricemin,$lte:pricemax},rating:{$gte:ratingVal},stock:{$gte:stockMin},category:{$in:category},brand: {$in:brand}, name: {$regex:new RegExp(search, 'i')}}).populate('category').sort(sorting).skip(skip).limit(limit)
  let pages=Math.ceil(count/limit)
  return res.status(200).json({count,products,page,pages})

  }
  catch(err){
    console.log(err)

  }
}

const addImage=(req,res)=>{
  const images=req.session.images
  res.status(200).json({images})
}


const removeImage=(req,res)=>{
  const {filename}=req.body
  console.log(filename)
  console.log(req.session.images); 

  if (Array.isArray(req.session.images)) {
    const index = req.session.images.indexOf(filename);
    if (index !== -1) {
      req.session.images.splice(index, 1); 
    }
  }
  console.log(req.session.images); 
  const images=req.session.images
  res.json({images})

}


module.exports={
  productsList,
  product_edit_get,
  product_edit_post,
  product_add_get,
  ProductAddSave,
  product_block,
  product_unblock,
  product,
  shopLoad,
  clearSearch,
  availability,
  filter,
  productFilter,
  removeImage,
  addImage
    
}