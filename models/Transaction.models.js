import mongoose from "mongoose"


const TransactionSchema = new mongoose.Schema({
    user_id:{
        type:String,
        required:true
    },
    txn_id:{
        type:String,
        required:true
    },
    for:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true
    }
},{timestamps:true})

export const Transaction = mongoose.model("Transaction",TransactionSchema);
