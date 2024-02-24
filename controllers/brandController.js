const Brand=require("../models/brand");
let title="Brands"

const brands_get=async(req,res)=>{
  const brands=await Brand.find()
  res.render('admin/page-brands',{title,brands, layout: 'admin/layout'})
}
const brand_add_get=async(req,res)=>{
  const message = req.query.message;
  res.render('admin/brand-add',{title,message, layout:'admin/layout'})
}

const brand_add_post=async (req,res, next) => {
  const name=req.body.name
  const isDuplicate=await Brand.findOne({name:name})
  if(isDuplicate){
    console.log("Duplicate brand name")
    res.redirect('/admin/brand-add?message=Duplicate+brand+name+found!+Try+Again');
    
  }
  else{
    const image = req.file.filename
  const brands=new Brand({
    name: name,
    image: image,
    delete: false
  })
  await brands.save();
  console.log(brands)
  res.redirect('brands')

  }

}

const brand_edit_get=async(req,res)=>{
  const _id=req.query.id
  const message=req.query.message
  const brands=await Brand.find({_id:_id})
  res.render('admin/brand-edit',{message,title,brands, layout: 'admin/layout'})
}
const brand_edit_post=async(req,res)=>{
    const _id=req.query.id
    const name=req.body.name
    
    const isDuplicate=await Brand.findOne({_id:{$ne:_id},name:name})
      if(isDuplicate){
    console.log("Duplicate brand name")
    res.redirect(`/admin/brand-edit?message=Duplicate+brand+name+found!+Try+Again&id=${_id}`);
  }
    else{
      await Brand.findByIdAndUpdate({_id:_id},{
        name: name,
      });
      if(req.body.imgUpdate=== '1'){
        try{
          image = req.file.filename
        await Brand.findByIdAndUpdate({_id:_id},{
          image: image
        });
        }
        catch{
          return res.redirect('brands')
        }
      }
      if(req.body.softdel){
        await Brand.findByIdAndUpdate({_id:_id},{
          delete: true
        });
      }
      else {
        await Brand.findByIdAndUpdate({ _id: _id }, {
            delete: false
        });
      }
    
    res.redirect('brands')
    }
}








module.exports={
  brands_get,
  brand_add_get,
  brand_add_post,
  brand_edit_get,
  brand_edit_post,  
}