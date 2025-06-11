import mongoose from "mongoose";


const CoupunSchema =  mongoose.Schema({
    userId:{
        type:String,
        required:true

    },
    coupneCode:{
        type:String,
        required:true
    },
    discount:{
        type:String,
        required:true
    },
    isUsable:{
        type:Boolean,
        required:true,
        default:true
    }

},{timestamps:true})


export const Coupun = mongoose.model("Coupun", CoupunSchema);