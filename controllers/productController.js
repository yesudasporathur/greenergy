const Product=require("../models/product")
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
    const _id=req.query.id
    const products = await Product.find({ _id: _id }).populate(['brand', 'category']);
    const brands=await Brand.find({delete: false})
    const categories=await Category.find({delete: false})
  
  
    console.log("Product details loaded:\n"+products)
    res.render('admin/product-edit',{products,categories,brands,title, layout: 'admin/layout'})
  }
  
  const product_edit_post=async(req,res)=>{
    const _id=req.query.id
    const name=req.body.name
    const isDuplicate=await Product.findOne({_id:{$ne:_id},name:name})
    if(isDuplicate){
      console.log("duplicate product name")
      //res.redirect('/product-edit?message=duplicate+product+found&id=)
  
    }
    else{
      const description=req.body.description
    const brand=req.body.brand
    const mrp=req.body.mrp
    const sp=req.body.sp
    const discount=Math.ceil(100-(sp/mrp)*100)
    const category=req.body.category
    const update=await Product.findByIdAndUpdate({_id:_id},{
      name: name,
      sp: sp,
      mrp: mrp,
      discount: discount,
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
    
  }
  
  const product_add_get=async (req,res)=>{
    const message = req.query.message;
  
    const categories=await Category.find({delete: false})
    const brands=await Brand.find({delete: false})
    res.render('admin/page-form-product-2',{categories,brands,message: message,title:`${title}`, layout: 'admin/layout'})
  }
  const product_add_post=async (req,res, next) => {
    try{
      const name=req.body.name
      const images = req.files.map(file=>file.filename )
      const description=req.body.description
    const brand=req.body.brand
    const mrp=req.body.mrp
    const sp=req.body.sp
    const discount=Math.ceil(100-(sp/mrp)*100)
    const category=req.body.category
    const products=new Product({
      name: name,
      sp: sp,
      mrp: mrp,
      discount: discount,
      description: description,
      brand: brand,
      category: category,
      images: images,
      delete: false
    })
    console.log(products)
    await products.save();
    console.log("New product: "+products)
    res.redirect('products')
    }
    catch{
      console.log("Product adding failed")
      res.redirect('/admin/product-add?message=Product+registration+failed!+Try+Again');
    }
  }

module.exports={
    products_get,
    product_edit_get,
    product_edit_post,
    product_add_get,
    product_add_post
}