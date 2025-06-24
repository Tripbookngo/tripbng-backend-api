import { asyncHandler } from "../../../utils/asyncHandler.js";
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


const booking = asyncHandler(async (req, res) => {
    const bookingObj = req.body;

    if (bookingObj == {}) {
        return res.status(400)
            .json(
                new ApiResponse(401, { success: false, data: "please enter entire object" }, "please enter entire object")
            )
    }

    const result = await sendPostRequest('https://apitest.tripjack.com/oms/v1/hotel/book', headers, bookingObj)
    console.log(result)

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

const confirmHoldBooking = asyncHandler(async (req, res) => {
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

const bookingCancellation = asyncHandler(async(req,res)=>{
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


//new york - > 727279


//merchant key = > 2iZoPY
//marchant saly v1 = >xiSekJnGE84B47GOeh09zetYsqSMcl7F
//marchant salt v2 = > MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCu6XtmSEm1mkxYluf+BvnTenLISdf2eL0+yzALg3fEjFeLhqejPx5sboj6bYR2G6gA9Nz1GzPlylk92dsksA8oIX1nHIqfYI7GMdRbJvkJDIEXN8yw3YWzUMJlZNyg426xg44W1c+bc/NewCBzBSVNJBYz8Ltx3c0r+UN87Klo9AFGMC2uXIPj6h7GbRAKsIGFwwFVS/wZqFfSiyCsUYfddADN8Nme2lv9sV7LDQF2Ulyv7fLYjGTayQHorUZZHIPg717t08ZEdf0V0A1JDZlxeC4NeBYE6ACvFrEqM6oK9QVnbN8lA6scwBcmD8ZStCQkpfW6XONKdhWSNzDXVKKbAgMBAAECggEAZ0wcRFuMrGNjky4L9EnKYMp/3yk9EaJcoSj+Rs5tfPYk/ZGYjyBHp2HgI4VqJRZQMcBqfZaDH8JQ0eZHNXOEf/7HQI3qkBVGPGZRM0Pg7ycjVcLub8VjoHKhW6AlbB7k0JEQ6Qt8gCIKKHrurv7q+JPHSQVyrdx/vuiGotBhfEkj+6xAzUv0FzlOAxz6jUlvCXYVHunuaZFdL5P8tQzWVSh7jCm2aMl1L9leuMx+aJ9wx5EtMSy9hB5C4XqgOkdms+eIE8YmrA++pUmrfVlY5O+B1du3b0j2ziOWi46IpshqMFsFtfig9JmQa6AzxlyAshD3MjZemyuxMCSqDm3xgQKBgQDeHfO4Vgz6VLq6jLdjMRNt6Z0kyRU1qCa6BShxEcaoFQ/gkrOingsUxLlQFUjfGCz9ZY12StiAOCv3j4tuNc2tzveplkcgfB/r7DwQzjslk6tIQAebcx+LA3oAgSEvkVc60p5YftmwK6BBxa2ucebixtTUNvqQpY5sDeWq8IjPrQKBgQDJmBh/+HOCjbiC1WrDiQ0sdejp2V6VohVPDzQKPT5/CsDu4mn2pIcdyCo604kj0MXaN6Hbd2m3OpySINkF0tPbSW8BCmlxfQyoJZt+tWtVgUAZup42+lbdcQUct6SZqM8Z5RisAAYO9j2Jx8YbAnQZy8MZqS5a/pRmIaWyAv/kZwKBgBb0d3ykgADbAtVGt6krqDtiulfT5DpAX4g4Aj71PFegnZxy7Newh6qkzhYFrRtJT1T8ysrf31IY/ApAroM8Uj5VNmkzW7Ryv4XNS0PdXGV8xmXYIDEji639NP2aWsikt6Qfoje5HFxFlfFWMaXmpZroO5SW/fw27+og4YxyAWGdAoGBAI5+h7LM9zjs2+L+33xfP4SRw5SoJQc3jkBXyr0CFU7PVxiDycqg+TC/77mtFF7Qj0lz0WDDw2HUeB+CQGSxZTa3bVMa/PVPIscn7gVeTwQdXCXTl0ndIdFctfRaimpivCDdotbRHXct7smZABrPXSlusfVNdIq1MEgQuIJfRGk5AoGBAJqljHngbgnqXX71gxpvlKkSDKYM0YSBZTY7VY2Bg7uLbqiY7nyO/j6ID1tGhoqF5Yybcqaf3I/kQGAWNmp/sCXrdgq9irgk1GDFWFPoRI/sr98aNTw8VV8p6ag4qrNSJWBy7BA1wEJ4MVPBsCoWXuc2RBtZd8LqSYaa0mKIC+Gv


        