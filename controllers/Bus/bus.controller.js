import { ApiResponse } from "../../utils/ApiResponse.js"
import { AsnycHandler } from "../../utils/AsnycHandler.js"
import { isNull } from "../../utils/FormCheck.js"
import { sendGetRequest, sendPostRequest } from "../../utils/sendRequest.js"
import { authHeaders } from "../../middlewares/util.js"
import { CityCodeData } from "../../static/citylist.js"
import { BusBooking } from "../../models/BusBooking.models.js"

//complete
const SearchBus = AsnycHandler(async (req, res) => {
    const { From_City, To_City, TravelDate } = req.body;

    if (isNull([From_City, To_City])) {
        return res.status(400)
            .json(
                new ApiResponse(400, { success: false }, "Please Enter All Feild")
            )
    }
    //mm/dd/yyyy
    if (!TravelDate) {
        let MakeADate = new Date();
        TravelDate = MakeADate.toLocaleDateString();
    }
    console.log(TravelDate)
    if (isNull([From_City, To_City, TravelDate])) {
        return res.status(400)
            .json(
                new ApiResponse(400, { success: false }, "All Feild is compalsary")
            )
    }



    const SendRequest = await sendPostRequest("http://uat.etrav.in/BusHost/BusAPIService.svc/JSONService/Bus_Search", {},
        {
            Auth_Header: authHeaders(),
            From_City,
            To_City,
            TravelDate

        }
    )

    if (SendRequest.data.Response_Header.Error_InnerException) {
        return res.status(200)
            .json(
                new ApiResponse(200, { success: true, data: SendRequest.data.Response_Header.Error_InnerException }, SendRequest.data.Response_Header.Error_InnerException)
            )
    }
    if (!SendRequest) {
        return res.status(200)
            .json(
                new ApiResponse(200, { success: true, data: "No Bus Sd on this rute" }, "No Bus Sd on this rute")
            )
    }

    return res.status(200)
        .json(
            new ApiResponse(200, { success: true, data: SendRequest.data }, "Bus Search")
        )


})

//complete
const BusSeatMap = AsnycHandler(async (req, res) => {

    const { Boarding_Id, Dropping_Id, Bus_Key, Search_Key } = req.body;

    if (isNull([Boarding_Id, Dropping_Id, Bus_Key, Search_Key])) {
        return res.status(400)
            .json(
                new ApiResponse(400, { success: false }, "please Enter All feild Compalsary")
            )
    }
    const SeatMap = await sendPostRequest('http://uat.etrav.in/BusHost/BusAPIService.svc/JSONService/Bus_SeatMap', {}, {
        Auth_Header: authHeaders(),
        Boarding_Id,
        Dropping_Id,
        Bus_Key,
        Search_Key
    })

    if (SeatMap.data.Response_Header.Error_InnerException) {
        return res.status(200)
            .json(new ApiResponse(200, { success: false, data: SeatMap.data.Response_Header.Error_InnerException }, SeatMap.data.Response_Header.Error_InnerException))
    }

    if (!SeatMap) {
        return res.status(400)
            .json(
                new ApiResponse(400, { success: false }, "Something Wrong while fecthing details")
            )
    }
    return res.status(200)
        .json(
            new ApiResponse(200, { success: true, data: SeatMap.data }, "SuccessFully Fetached")
        )


})

//incomplete
const TempBooking = AsnycHandler(async (req, res) => {

    const busDetails = req.body
    if (!busDetails) {
        return res.status(400)
            .json(
                new ApiResponse(400, { success: false, data: "Please Enter All Data" }, "Please Enter All the Data")
            )
    }
    const Booking = await sendPostRequest('http://uat.etrav.in/BusHost/BusAPIService.svc/JSONService/Bus_TempBooking', {},
        {
            Auth_Header: authHeaders(),
            ...busDetails
        }
    )
    if (!Booking) {
        return res.status(400)
            .json(
                new ApiResponse(400, { success: false, data: "Something wrong while fechting data" }, "Something wrong while fetching Data")
            )
    }

    return res.status(200)
        .json(
            new ApiResponse(200, { success: true, data: Booking.data }, "FetchSuccessFully")
        )
})

//After Booking-----comeplete
const GetBookingDetails = AsnycHandler(async (req, res) => {

    const { Booking_RefNo } = req.body;
    if (!Booking_RefNo) {
        return res.status(400)
            .json(
                new ApiResponse(400, { success: false }, "Please Enter the Booking RefNo")
            )
    }

    const BookingData = await sendPostRequest('http://uat.etrav.in/BusHost/BusAPIService.svc/JSONService/Bus_Requery', {},
        {
            Auth_Header: authHeaders(),
            Booking_RefNo
        }
    )
    if (!BookingData) {
        return res.status(400)
            .json(
                new ApiResponse(400, { success: false }, "Please Enter Correct Booking Ref No")
            )
    }

    return res.status(200)
        .json(
            new ApiResponse(200, { success: true, data: BookingData.data }, "Data fetch SuccessFully")
        )

})

const ConfirmBooking = AsnycHandler(async (req, res) => {
    const { Booking_RefNo } = req.body;

    const GetPNR1 = await sendPostRequest('http://uat.etrav.in/BusHost/BusAPIService.svc/JSONService/Bus_Ticketing', {}, {
        Auth_Header: authHeaders(),
        Booking_RefNo
    })

    if (!GetPNR1.data.Transport_PNR) {
        return res.status(400)
            .json(400, { success: false }, "Booking is pending")
    }

    
    return res.status(200)
        .json(
            new ApiResponse(200, { success: true, data: GetPNR1.data }, "fetched")
        )

})

//complete
const GetBookingCancellationDetails = AsnycHandler(async (req, res) => {

    const { Booking_RefNo, Seat_Number, Ticket_Number } = req.body;
    if (isNull([Booking_RefNo, Seat_Number, Ticket_Number])) {
        return res.status(400)
            .json(
                new ApiResponse(400, { success: false, data: "Please Enter All feild" }, "Pleas Enter All Feild")
            )
    }

    const GetPNR = await sendPostRequest('http://uat.etrav.in/BusHost/BusAPIService.svc/JSONService/Bus_Ticketing', {}, {
        Auth_Header: authHeaders(),
        Booking_RefNo
    })

    if (!GetPNR.data) {
        return res.status(400)
            .json(400, { success: false }, "Please Enter Valid Details")
    }

    const CancellationDetails = await sendPostRequest('http://uat.etrav.in/BusHost/BusAPIService.svc/JSONService/Bus_CancellationCharge', {}, {
        Auth_Header: authHeaders(),
        Booking_RefNo,
        CancelTicket_Details: [
            {
                Seat_Number,
                Ticket_Number,
                Transport_PNR: GetPNR
            }
        ]

    })

    console.log(CancellationDetails)


    if (!CancellationDetails) {
        return res.status(400)
            .json(
                new ApiResponse(400, { success: false }, "Invalid Cancellation")
            )
    }

    return res.status(200)
        .json(
            new ApiResponse(200, { success: true, data: CancellationDetails.data }, "All Cancellation details")
        )



})

//complete
const CancelBooking = AsnycHandler(async (req, res) => {

    const { Booking_RefNo, Seat_Number, CancellationCharge_Key, Ticket_Number } = req.body;

    if (isNull([Booking_RefNo, Seat_Number, CancellationCharge_Key, Ticket_Number])) {
        return res.status(400)
            .json(
                new ApiResponse(400, { success: false }, "Please Enter All The Feild")
            )
    }
    const GetPNR = await sendPostRequest('http://uat.etrav.in/BusHost/BusAPIService.svc/JSONService/Bus_Ticketing', {}, {
        Auth_Header: authHeaders(),
        Booking_RefNo
    })

    if (!GetPNR) {
        return res.status(400)
            .json(400, { success: false }, "Please Enter Valid Details")
    }

    const Transport_PNR = GetPNR?.data?.Transport_PNR;

    if (!Transport_PNR) {
        return res.status(400)
            .json(
                new ApiResponse(400, { success: false }, "Invalid Booking details")
            )
    }

    const TicketCancellation = await sendPostRequest('http://uat.etrav.in/BusHost/BusAPIService.svc/JSONService/Bus_Cancellation', {}, {
        Auth_Header: authHeaders(),
        Booking_RefNo,
        BusTicketstoCancel: [{
            Seat_Number,
            Ticket_Number,
            Transport_PNR
        }],
        CancellationCharge_Key
    })
    if (!TicketCancellation) {
        return res.status(500)
            .json(
                new ApiResponse(500, { success: false }, "Something Went wrong while fetching details")
            )
    }

    return res.status(200)
        .json(
            new ApiResponse(200, { success: true, data: TicketCancellation }, "Tickit Cancel SuccessFully")
        )
})

//complete
const Citycode = AsnycHandler(async (req, res) => {
    const { cityName } = req.body;

    if (!cityName) {
        return res.status(400)
            .json(
                new ApiResponse(400, { success: false, data: "Please Enter CityName" }, "Please Enter Cityname")
            )
    }


    for (let i = 0; i < CityCodeData.length - 1; i++) {
        if (CityCodeData[i]["CityName"] == cityName) {

            return res.status(200)
                .json(
                    new ApiResponse(200, { success: true, data: CityCodeData[i]["CityID"] }, `code is ${CityCodeData[i]["CityID"]}`)
                )
        }
    }
    return res.status(200)
        .json(
            new ApiResponse(200, { success: false, data: "City Code is not found" }, "City Code is not found")
        )

})

//complete
const getCitylist = AsnycHandler(async (req, res) => {
    const get = await sendPostRequest('http://uat.etrav.in/BusHost/BusAPIService.svc/JSONService/Bus_CityList', {}, {
        Auth_Header: authHeaders()



    })
    return res.status(200)
        .json(new ApiResponse(200, { success: true, data: get.data }, "citylist"))
})
//Some new feture Added Sone

const AddBalance = AsnycHandler(async (req, res) => {
    const {RefNo} = req.body
    const addbalance = await sendPostRequest(`http://uat.etrav.in/tradehost/TradeAPIService.svc/JSONService/AddPayment`, {}, {
        Auth_Header: authHeaders(),
        "ClientRefNo": "Testing Team",
        "RefNo": RefNo,
        "TransactionType": 0,
        "ProductId": "2"
    })

    return res.status(200)
    .json(
        new ApiResponse(201,{success:true , data:addbalance.data},"balance added successfully")
    )
})



export {
    ConfirmBooking,
    SearchBus,
    BusSeatMap,
    TempBooking,
    GetBookingDetails,
    GetBookingCancellationDetails,
    CancelBooking,
    getCitylist,
    Citycode,
    AddBalance
}
