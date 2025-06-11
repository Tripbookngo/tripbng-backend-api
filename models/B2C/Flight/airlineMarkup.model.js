import mongoose from "mongoose";



const AirLineWiseMarkupSchema = new mongoose.Schema({
    carrier: {
        type: String
    },
    domestic_one_way: {
        commision: {
            type: Number,
            default: 0
        },
        commision_mode: {
            type: Number,
            default: 0
        },
        commision_type: {
            type: String
        }
    },
    domestic_round_way: {
        commision: {
            type: Number,
            default: 0
        },
        commision_mode: {
            type: Number,
            default: 0
        },
        commision_type: {
            type: String
        }
    },
    international_one_way: {
        commision: {
            type: Number,
            default: 0
        },
        commision_mode: {
            type: Number,
            default: 0
        },
        commision_type: {
            type: String
        }
    },
    international_round_way: {
        commision: {
            type: Number,
            default: 0
        },
        commision_mode: {
            type: Number,
            default: 0
        },
        commision_type: {
            type: String
        }
    }
}, { timestamps: true })


export const AirLineWiseMarkup = mongoose.model("AirLineWiseMarkup", AirLineWiseMarkupSchema)