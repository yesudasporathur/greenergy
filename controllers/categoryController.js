const Category=require("../models/category");
let title="Categories"


const categories_get=async(req,res)=>{
    const categories=await Category.find()
    res.render('admin/categories',{categories:categories, title,layout: 'admin/layout'})
  }
  
  const category_add_get=async(req,res)=>{
    const message = req.query.message;
  
    const categories=await Category.find()
  
    res.render('admin/category-add',{message,categories:categories, title,layout: 'admin/layout'})
  }
  
  const category_add_post=async(req,res)=>{
    const name=req.body.name
    const isDuplicate=await Category.findOne({name:name})
    if(isDuplicate){
      console.log("Duplicate category name")
      res.redirect('/admin/category-add?message=Duplicate+category+name+found!+Try+Again');
    }
    else{
    await Category.create({name,delete:false}) 
    res.redirect('categories')
    }
    
  
    }
    
  
  
  const category_edit_get=async(req,res)=>{
    const message = req.query.message;
    const _id=req.query.id
    const categories=await Category.find({_id:_id})
    res.render('admin/category-edit',{message, categories, title,layout: 'admin/layout'})
  }
  
  const category_edit_post = async (req, res, next) => {
    try {
      
        const _id = req.query.id;
        const name = req.body.name;
        const isDuplicate=await Category.findOne({_id:{$ne:_id},name:name})
        if(isDuplicate){
      console.log("Duplicate category name")
      res.redirect(`/admin/category-edit?message=Duplicate+category+name+found!+Try+Again&id=${_id}`);
    }
    else{
      if (req.body.softdel) {
            await Category.findByIdAndUpdate({ _id: _id }, { delete: true });
        } else {
            await Category.findByIdAndUpdate({ _id: _id }, { delete: false });
        }
  
        await Category.findByIdAndUpdate({ _id: _id }, { name: name });
  
        // After all processing, redirect to the appropriate route
        res.redirect('/admin/categories');
    } 
    }
    catch (error) {
      // Handle any errors that occur during the process
      next(error); // Pass the error to the error handling middleware
  }
  
        
  };
  

module.exports={
    categories_get,
    category_add_get,
    category_add_post,
    category_edit_get,
    category_edit_post,

}