let title="Wallet"
const Wallet=require('../models/wallet')

const walletLoad=(req,res)=>{
    res.render('user/wallet',{wallet:true,user: req.session.user,title,carttotal,cartnum})
}

const walletPagin=async (req,res)=>{
    try{
        const {page,limit}=req.body
        let skip=(page-1)*limit
        let wallet=await Wallet.findOne({u_id:req.session.user}).sort({createdAt:-1})
        if(!wallet){
            walletAdd(req.session.user)
        }
        wallet.action.sort((a, b) => b.time - a.time);
        const count = wallet.action.length;
        const action = wallet.action.slice(skip, skip + limit)        
        const pages=Math.floor(count/limit)
        res.status(200).json({wallet,action,pages})
    }
    catch{
        
    }

}

const walletAdd=async (u_id)=>{
    const addWallet=await Wallet.create({u_id:u_id})
}

module.exports={
    walletLoad,
    walletPagin
}