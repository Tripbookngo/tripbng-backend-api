import { AsnycHandler } from "../../../utils/AsnycHandler.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";
import { sendPostRequest } from "../../../utils/sendRequest.js"
import { returnCode } from "../../../utils/returnCode.js";

const headers = {
    'Content-Type': 'application/json',
    'apikey': '112585e158fb4a-c601-4e83-b8d7-aece0cf5973a'
};


const searchHotel = returnCode('https://apitest.tripjack.com/hms/v1/hotel-searchquery-list',headers,"please enter all fileds" , "please enter correct data","data fetch successfully")


const detailSearch = returnCode("https://apitest.tripjack.com/hms/v1/hotelDetail-search" , headers,"please enter id" ,"please enter correct id","data fetch successfully")

     
const cancellation = returnCode("https://apitest.tripjack.com/hms/v1/hotel-cancellation-policy",headers,"please enter all the feilds" , "please enter correct feilds","data fetch successfully")


const review = returnCode("https://apitest.tripjack.com/hms/v1/hotel-review",headers,"please enter all the ids","please enter all correct ids","data fetch successfully")


const booking = AsnycHandler(async (req, res) => {
    const bookingObj = req.body;

    if (bookingObj == {}) {
        return res.status(400)
            .json(
                new ApiResponse(401, { success: false, data: "please enter entire object" }, "please enter entire object")
            )
    }

    const result = await sendPostRequest('https://apitest.tripjack.com/oms/v1/hotel/book', headers, bookingObj)
    console.log(result.errors)

    if (!result) {
        return res.status(400)
            .json(
                new ApiResponse(401, { success: false, data: "please enter correct details" }, "please eneter correct details")
            )
    }

    return res.status(200)
        .json(
            new ApiResponse(201, { success: true, data: result.data }, "data fetch successfully")
        )

})

const confirmHoldBooking = AsnycHandler(async (req, res) => {
    const { paymentInfos, bookingId } = req.body;
    if (!paymentInfos) {
        return res.status(400)
            .json(
                new ApiResponse(401, { success: false, data: "please give us hole payment information" }, "please enter all payment information"
                )
            )
    }

    const result = await sendPostRequest('https://apitest.tripjack.com/oms/v1/hotel/confirm-book', headers, { paymentInfos,bookingId })

    if (!result) {
        return res.status(401)
            .json(
                new ApiResponse(400,{success:false ,data:"please enter correct data"},"please enter correct data")
            )
    }

    return res.status(200)
    .json(
        new ApiResponse(201,{success:true , data:result.data},"fetch the all data")
    )

})

const bookingDetails = returnCode('https://apitest.tripjack.com/oms/v1/hotel/booking-details',headers,'please enter booking id','please enter correct booking id','data fetch successully')

const bookingCancellation = AsnycHandler(async(req,res)=>{
    const {bookingId} = req.body;
    if(!bookingId)
    {
        return res.status(400)
        .json(
            new ApiResponse(400,{success:false , data:"please enter the booking_id"},"please enter the booking id")
        )
    }
    const data = await sendPostRequest(`https://apitest.tripjack.com/oms/v1/hotel/cancel-booking/${bookingId}`,headers,{});
    console.log(data);

    return res.status(200)
    .json(
        new ApiResponse(200,{success:true , data:data.data},"successfully cancel the booking")
    )
})
export {
    searchHotel,
    detailSearch,
    cancellation,
    review,
    booking,
    confirmHoldBooking,
    bookingDetails,
    bookingCancellation
}

