import mongoose, { model } from "mongoose";


const TempTravelSchema = new mongoose.Schema({

    username: {
        type: String,
    },
    contact: {
        type: String,
        required: false
    },
    from_city:{
        type:String
    },
    package_type: {
        type: String
    },
    no_of_person: [
        {
            adult: String,
            child: String,
            inflant: String
        }
    ],
    travel_type: {
        type: String
    },
    destination: {
        type: String
    },
    travel_date: {
        type: String
    },
    return_date: {
        type: String
    },
    days: {
        type: String
    },
    nights: {
        type: String
    },
    discription: {
        type: String
    },
    additional_city: [String]
    ,
    travel_class:{
        type:String
    }

}, { timestamps: true })


export const TempTravel = mongoose.model("TempTravel", TempTravelSchema)