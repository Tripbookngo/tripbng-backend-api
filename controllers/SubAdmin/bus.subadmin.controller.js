import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { Query } from "../../models/query.model.js";
import {BusBooking} from "../../models/BusBooking.models.js"




const GetBusBookingDetails = asyncHandler(async (req, res) => {
    const allBooking = await BusBooking.find({});
        if(allBooking.length <1)
        {
            return res.status(200)
            .json(
                new ApiResponse(200,{success:true , data:"not any bus booking found"},"not any bus booking found")
            )
        }
    
        return res.status(200)
        .json(
            new ApiResponse(200,{success:true , data:allBooking} , "all bus booking data fetch")
        )
})

const GetQuiryBus = asyncHandler(async (req, res) => {

    const allQuiries = await Query.find({query_for:'bus'});
    if (!allQuiries) {
        return res.status(200)
            .json(200, { success: true, data: "Not found any quire" }, "Not found any quiry")
    }

    return res.status(200)
        .json(
            new ApiResponse(200, { success: true, data: allQuiries }, "data fetch successfully")
        )

})

const ReplayQuiryBus = asyncHandler(async (req, res) => {
    const { query_id, reply } = req.body;
    if (!query_id || !reply) {
        return res.status(400)
            .json(
                new ApiResponse(400, { success: false, data: "Please Enter All the details" }, "Please Enter All the details")
            )
    }
    const query = await Query.findById(query_id);
    if (!query) {
        return res.status(400)
            .json(
                new ApiResponse(400, { success: false, data: "given id is not valid" }, "given id is not valid")
            )
    }

    query.reply.push(reply);
    await query.save();

    return res.status(200)
        .json(
            new ApiResponse(200, { success: true, data: query }, "Give Replay SuccessFully")
        )

})



export {
    GetBusBookingDetails,
    GetQuiryBus,
    ReplayQuiryBus
}
