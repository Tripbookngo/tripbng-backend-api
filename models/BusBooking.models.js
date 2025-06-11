import mongoose from "mongoose";



const BusBookingSchema = new mongoose.Schema({
    SeatBookUserEmail :{
        type:String,
        required:true
    },
    UserType:{
        type:String,
        required:true
    },
   
    BookingRefNo:{
        type:String,
        requried:true
    }
  
},{timestamps:true})


export const BusBooking = mongoose.model("BusBooking" , BusBookingSchema);