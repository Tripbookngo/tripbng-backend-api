import mongoose from "mongoose";

const HotelMarkupSchema = new mongoose.Schema({
    domestic: {
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
    },
    international:{
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
    },
    cancellation_markup:{
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



export const HotelMarkup = mongoose.model("HotelMarkup" , HotelMarkupSchema)