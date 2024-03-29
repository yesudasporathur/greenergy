const mongoose=require('mongoose')

const Schema=mongoose.Schema

const walletSchema=new Schema({
    u_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    balance: {
        type:Number,
        default:0
    },
    action:[{
        credit: Boolean,
        amount: Number,
        current:Number,
        reference: String,
        time: { type: Date, default: Date.now },
        o_id:String,
    }]
},{ timestamps: true, versionKey: false })
module.exports = mongoose.model("wallet", walletSchema);