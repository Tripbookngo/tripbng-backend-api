import mongoose from "mongoose";


const flightBookingDataSchema =  mongoose.Schema({
    UserId:{
        type:String,
        required:true
    },
    ContactDetails :{
        type:String,
        required:true
    },
    UserType:{
        type:String,
        required:true
    },
    BookingRefNum:{
        type:String,
        require:true
    },

    Pax:{
        type:String
    },
    BookingStatus:{
        type:Boolean
    },
    TravelDate:{
        type:String
    },
    Pnr:{
        type:String,
        required:false
    }
    
    
},{timestamps:true})

export const flightbookingdata = mongoose.model("flightbookingdata",flightBookingDataSchema);