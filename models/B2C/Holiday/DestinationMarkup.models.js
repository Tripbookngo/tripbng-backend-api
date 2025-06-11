import mongoose from "mongoose"

const DestinationWiseMarkupHolidaySchema = new mongoose.Schema({
    destination: {
        type: String
    },
    markup: {
        per: {
            type: Number,
            default: 0
        },
        per_type: {
            type: String,
            enum: [

                "Percentage(%) for Full Booking",
                "Percentage(%) Per Pax"
            ]
        }

    }

}, { timestamps: true })


export const DestinationWiseMarkupHoliday = mongoose.model("DestinationWiseMarkupHoliday", DestinationWiseMarkupHolidaySchema)