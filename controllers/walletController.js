let title="Wallet"
const Wallet=require('../models/wallet')


const walletLoad=async (req,res)=>{
    const wallet=await Wallet.findOne({u_id:req.session.user})
    wallet.action.sort((a, b) => b.time - a.time);

    if(!wallet){
        walletAdd(req.session.user)
        res.redirect('/wallet')
    }
    console.log(wallet)
    res.render('user/wallet',{user: req.session.user,title,wallet:wallet,carttotal,cartnum})
}

const walletAdd=async (u_id)=>{
    const addWallet=await Wallet.create({u_id:u_id})
}

module.exports={
    walletLoad
}