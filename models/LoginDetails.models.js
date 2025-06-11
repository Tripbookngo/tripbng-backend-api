import mongoose from "mongoose";

const logindetailsSchema = new mongoose.Schema({
    ip:{
        type:String,
        required:true
    },
    logintime:{
        type:String,
        required:true
    },
    browserdetails:{
        type:String,
        required:true
    }
},{timestamps:true})


export const LoginDetails = mongoose.model("LoginDetails" , logindetailsSchema)