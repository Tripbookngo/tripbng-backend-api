import mongoose from "mongoose";


const VisaMarkupSchema = new mongoose.Schema({
    Visa: {
        per: {
            type: Number,
            default: 0
        },
        per_type: {
            type: String,
            enum: [

                "Flat for Full Booking",
                "Flat Per Pax",
                "Percentage(%) for Full Booking",
                "Percentage(%) Per Pax"
            ]
        }

    }
}, { timestamps: true })

export const VisaMarkup = mongoose.model("VisaMarkup" , VisaMarkupSchema)