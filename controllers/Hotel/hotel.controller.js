import {ApiResponse} from "../../utils/ApiResponse.js"
import {asyncHandler} from "../../utils/asyncHandler.js"
import {isNull} from "../../utils/formCheck.js"
import {sendPostRequest , sendGetRequest}  from "../../utils/sendRequest.js"


// const header = {
//     "accountId":"zentrum-demo-account",
//     "customer-ip":"49.34.228.109",
//     "correlationId":"0fa387f8-2112-88f5-54a2-f310c92d8b77",
//     "apiKey":"demo123"
// }


const HotelBooking = asyncHandler(async(req,res)=>{ 
    const {hotelid,body,token,header} = req.body;
    if(!hotelid)
    {
        return res.status(400)
        .json(
            new ApiResponse(400 , {success:false , data:"Hotel ID is required"} , "Hotel ID is required")
        )
    }
    if(!token)
    {
        return res.status(400)
        .json(
            new ApiResponse(400 , {success:false , data:"Token is required"} , "Token is required")
        )
    }
    if(isNull(body))
    {
        return res.status(400)
        .json(
            new ApiResponse(400 , {success:false , data:"Body is required"} , "Body is required")
        )
    }

    const booking = await sendPostRequest(`${process.env.DEMO_HOTEL_URL}/${hotelid}/${token}/book` , header,{...body})

    if(!booking)
    {
        return res.status(400)
        .json(
            new ApiResponse(400 , {success:false , data:"Data is not found"} , "Data is not found")
        )  
    }
    return res.status(200)
    .json(
        new ApiResponse(200 , {success:true , data:booking.data} ,"Data fetched")
    )
})

const GetHotelDetails = asyncHandler(async(req,res)=>{
    const {channelId,bookingId} = req.body;
    if(!channelId || !bookingId)
    {
        return res.status(400)
        .json(
            new ApiResponse(400,{success:false , data:"Please Enter the Channel ID and Booking ID"} , "Please Enter the Channel ID and Booking ID")
        )
    }

    const hotelDetails = await sendGetRequest(`${process.env.DEMO_HOTEL_URL}/getBookingDetails` , header , {channelId,bookingId})
})

export {
    HotelBooking,
    GetHotelDetails
}
