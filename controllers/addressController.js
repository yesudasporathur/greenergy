const User = require("../models/user");
const Address=require('../models/address')
let title="Address"


const addressAddLoad=async(req,res)=>{
  const message=req.query.message    
    res.render('user/address-add', {message,title,address:true,carttotal,cartnum})
  }
  
const addressAdd=async(req,res)=>{
  
    try{
        let defaultVal=false
        firstAddress=await Address.findOne({u_id:req.session.user})
        if(!firstAddress){
          defaultVal=true
        }
        const data=new Address({
          default: defaultVal,
          u_id:req.session.user,
          name:req.body.name,
          pincode:req.body.pincode,
          addr1:req.body.addr1,
          addr2:req.body.addr2,
          mark: req.body.mark,
          city:req.body.city,
          state:req.body.state,
          country:req.body.country,
          type:req.body.type,
          email:req.body.email,
          phone:req.body.phone,
        })
        await data.save()
        res.redirect('addresses')
    }
    catch(err){
      console.log(err)
      res.redirect('address-add?message=Error+occured.+Try+again')
    }
}


  const addresses=async(req,res)=>{
    const addrs=await Address.find({u_id:req.session.user},{})
    res.render('user/addresses',{user: req.session.user,addrs,title,address:true,carttotal,cartnum})
    console.log(`addresses_get rendered`)
  }
  
  const addressEditLoad=async(req,res)=>{
    const message=req.query.message
    const _id=req.query._id
    const data=await Address.findOne({_id:_id})
      res.render('user/address-edit', {user: req.session.user,message:message,data,title,address:true,carttotal,cartnum})
    }

    const addressEdited=async(req,res)=>{
      
      try{
        const _id=req.body._id
        if(req.body.default){
          await Address.updateMany({},{default:false})
          await Address.updateOne({_id:_id},{default:true})
        }
        const address=await Address.findOne({_id})
        if(address){
        await Address.updateOne({_id:_id},{$set:{
          name:req.body.name,
          pincode:req.body.pincode,
          addr1:req.body.addr1,
          addr2:req.body.addr2,
          mark: req.body.mark,
          city:req.body.city,
          state:req.body.state,
          country:req.body.country,
          type:req.body.type,
          email:req.body.email,
          phone:req.body.phone,
        }})
        res.redirect('addresses')
        }
        else{
          res.redirect(`address-edit?message=Cannot+find+previous+data.+Try+again&_id=${_id}`)

        }
      }
      catch(err){
        console.log(err)
        res.redirect(`address-edit?message=Error+occured.+Try+again&_id=${_id}`)
      }
  }

  const addressDeleteLoad=async(req,res)=>{
    const message=req.query.message
    const _id=req.query._id
    const data=await Address.findOneAndDelete({_id:_id})
      res.render('user/addresses', {message:message,data,title})
    }
  
  const addressCart=async(req,res)=>{
    const message=req.query.message
      res.render('user/address-cart', {message,title,carttotal,cartnum})
    }
    
  const addressCartSave=async(req,res)=>{
      try{
        const data=new Address({
          default: false,
          u_id:req.session.user,
          name:req.body.name,
          pincode:req.body.pincode,
          addr1:req.body.addr1,
          addr2:req.body.addr2,
          mark: req.body.mark,
          city:req.body.city,
          state:req.body.state,
          country:req.body.country,
          type:req.body.type,
          email:req.body.email,
          phone:req.body.phone,
        })
        await data.save()
        res.redirect('checkout')
      }
      catch(err){
        console.log(err)
        res.redirect('address-cart?message=Error+occured.+Try+again')
      }
  }

//------------------------------------- Exports -------------------------------------\\
module.exports={
    
  addressAddLoad,
  addressAdd,
    
  addresses,
  addressEditLoad,
    addressEdited,
    addressDeleteLoad,

    addressCart,
    addressCartSave
      
  }