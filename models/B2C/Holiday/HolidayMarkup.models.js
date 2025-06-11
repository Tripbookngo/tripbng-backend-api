import mongoose from "mongoose";

const markupTypes = [  
"Percentage(%) for Full Booking",
"Percentage(%) Per Pax"
]

const HolidayMarkupSchema = new mongoose.Schema({
    domestic_packages :{
        per:{
            type:Number,
            default:0
        },
        per_type:{
            type:String,
            enum:markupTypes
        }
    },
    international_packges:{
        per:{
            type:Number,
            default:0
        },
        per_type:{
            type:String,
            enum:markupTypes
        }
    }
},{timestamps:true})

export const HolidayMarkup = mongoose.model("HolidayMarkup" , HolidayMarkupSchema)