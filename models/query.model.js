import mongoose from "mongoose";

const QuerySchema = new mongoose.Schema({
    user_id:{
       type:String,
       required:true
    },
    query:{
        type:String,
        required:true,
    },
    query_for:{
        type:String,
        required:true,
        enum:['flight','bus','holiday','visa','hotel']
    },
    reply:[
        {
            type:String,
            required:false
        }
    ]
},{timestamps:true})


export const Query = mongoose.model('Query' , QuerySchema)
