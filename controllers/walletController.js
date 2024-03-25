let title="Wallet"
const Wallet=require('../models/wallet')


const walletLoad=async (req,res)=>{
    const wallet=await Wallet.findOne({u_id:req.session.user}).limit(10)
    if(!wallet){
        walletAdd(req.session.user)
        res.redirect('/wallet')
    }
    res.render('user/wallet',{title,wallet:wallet})
}

const walletAdd=async (u_id)=>{
    const addWallet=await Wallet.create({u_id:u_id})
}

module.exports={
    walletLoad
}