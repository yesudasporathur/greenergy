let title="Wallet"
const Wallet=require('../models/wallet')

const walletLoad=(req,res)=>{
    res.render('user/wallet',{wallet:true,user: req.session.user,title,carttotal,cartnum})
}

const walletPagin=async (req,res)=>{
    const {page,limit}=req.body
    let skip=(page-1)*limit
    const wallet=await Wallet.findOne({u_id:req.session.user}).sort({createdAt:-1}).skip(skip).limit(limit);
    wallet.action.sort((a, b) => b.time - a.time);
    if(!wallet){
        walletAdd(req.session.user)
    }
    const pages=Math.floor(count/limit)

    res.status(200).json({wallet})
}

const walletAdd=async (u_id)=>{
    const addWallet=await Wallet.create({u_id:u_id})
}

module.exports={
    walletLoad,
    walletPagin
}