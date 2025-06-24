import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { FormateForApi2 } from "../../utils/wrapper/Formate2.util.js";
import { FormateForApi1 } from "../../utils/wrapper/Formate1.util.js";
import { ResponseAdder } from "../../utils/FlightResponse/FormateSearch.js";
import { sendGetRequest, sendPostRequest } from "../../utils/sendRequest.js";
import { isNull } from "../../utils/formCheck.js";
import { authHeaders } from "../../middlewares/util.js";
import AirlineCodes from "../../models/AirlineCodes.js";
import {
  Api1BookingConverter,
  Api2BookingConverter,
} from "../../utils/FlightBookingwrapper/BookingWraaper.js";
import { flightbookingdata } from "../../models/FlightBooking.model.js";
import axios from "axios"
import { generateMarkup } from "../../utils/calculatemarkup.js";
import { ApiFlight } from "../../models/ApiFlights.models.js";

const head = {
  "Content-Type": "application/json",
  apikey: process.env.KEY_API
};
const headers = {
  "Content-Type": "application/json",
  apikey: process.env.KEY_API, // or use process.env.KEY_API if you're using environment variables
};
//complete
const GetBookingId = async (Id) => {
  let FunctionResponse = 0;
  const data = await sendPostRequest(
    "https://apitest.tripjack.com/fms/v1/review",
    head,
    {
      priceIds: [Id],
    }
  );
  console.log(data.data)
  if (data.errors) {
    if (data.errors[0].id) {
      FunctionResponse = data.errors[0].id;
      return FunctionResponse;
    } else {
      FunctionResponse = data.errors[0].message;
      return FunctionResponse;
    }
  }

  FunctionResponse = data.data.bookingId;
  return FunctionResponse;
};

//search -optimal
const GetAllBestFlight = asyncHandler(async (req, res) => {
  //fetch the data from the request body
  const Data = req.body;
       
       //Check the data is present or not
       if (!Data) {
         return res.status(400).json(
           new ApiResponse(
             400,
             { success: false, data: "Please Enter all the data" },
             "Please enter all the data"
           )
         );
       }
     
       //Formate the data for api1 and api2
       const Api1DataFormate = FormateForApi1(Data);
       const Api2DataFromate = FormateForApi2(Data);
       
       //Check the data is formated or not
       if (!(Api1DataFormate || Api2DataFromate)) {
         return res.status(500).json(
           new ApiResponse(
             500,
             { success: false, data: "Something issue in the backend" },
             "Maybe something wrong in the backend"
           )
         );
       }
     
       //fetch the data from the api1 and api2
       const Api1Data = await axios.post(
         `${process.env.LIVE_URL_ETRAV_FLIGHT}/AirAPIService.svc/JSONService/Air_Search`,
         Api1DataFormate,
         {}
       );
       
       
      
       console.log("Data Fetched From the Api1 successfully")
       
       //fetch the data from the api2
       const Api2Data = await axios.post(
         "https://apitest.tripjack.com/fms/v1/air-search-all",
        Api2DataFromate
         ,
         {
           headers: {
             "Content-Type": "application/json",
             apikey: process.env.KEY_API
           }
         }
       );
       
       console.log("Data Fetched from the Api2")

       //get all disable flights api
       console.log("Data come from db...")
       const AllFlightDisableData  = await ApiFlight.find({status:false})
       console.log(AllFlightDisableData)
       //Data holder holds the details of the apis
       const DataHolder = [(Api1Data?.data?.TripDetails) ?? null,(Api2Data?.data?.searchResult?.tripInfos) ?? null]
       console.log(DataHolder[0])
        
       //check which flight api disabled, if it is disabled then set the data to null
        for(let i=0; i<AllFlightDisableData.length; i++)
        {
          DataHolder[AllFlightDisableData[i].apiid] = null;
        }

        
     
        //fromate response the data if travel type is rounded trip
       if (Data.isReturn) {

         //formate for the Flightonward and FlightReturn
         const FlightOnward = ResponseAdder(
          DataHolder[0]?.[0]?.Flights ? DataHolder[0][0].Flights : null,
          DataHolder[1]?.ONWARD ?  DataHolder[1].ONWARD :null
         );
         const FlightReturn = ResponseAdder(
          DataHolder[0]?.[1].Flights ? DataHolder[0][1].Flights : null,
           DataHolder[1]?.RETURN ? DataHolder[1].RETURN : null
         );
        
         
         //check the flight response is empty or not
         if (!FlightOnward && !FlightReturn) {
           return res.status(200).json(
             new ApiResponse(
               200,
               { success: true, data: "No flight data found" },
               "No flights found"
             )
           );
         }
     
         //send the response to the client
         return res.status(200).json(
           new ApiResponse(
             200,
             {
               success: true,
               data: { FlightOnward, FlightReturn },
               searchkey: Api1Data?.data?.Search_Key,
             },
             "Data fetched successfully"
           )
         );
       } else {
     
          //formate the response for the one way flight
         const response = ResponseAdder(
          DataHolder[0]?.[0]?.Flights ? DataHolder[0][0].Flights : null,
          DataHolder[1]?.ONWARD ? DataHolder[1].ONWARD :null
         );
        
          //check the response is empty or not
         if (!response) {
           return res.status(200).json(
             new ApiResponse(
               200,
               { success: false, data: "No flights found" },
               "No flights found"
             )
           );
         }
          //send the response to the client
         return res.status(200).json(
           new ApiResponse(
             200,
             {
               success: true,
               OneWay: response,
               searchkey: Api1Data?.data?.Search_Key
             },
             "Data fetched successfully"
           )
         );
       }
    

 
});

//Airline--complete
const SearchAirLine = asyncHandler(async (req, res) => {
  try {
    const { searchTerm } = req.body;
    const query = searchTerm
      ? {
        $or: [
          { name: { $regex: searchTerm, $options: "i" } },
          { iata_code: { $regex: searchTerm, $options: "i" } },
        ],
      }
      : {};

    const data = await AirlineCodes.find(query);

    return res
      .status(200)
      .json(new ApiResponse(200, { success: true, data }, "Data Fetch"));
  } catch (err) {
    return res
      .status(500)
      .json(new ApiResponse(500, { success: false }, "Fail to fetch AirLine"));
  }
});

//Fair policy--complete
const GetAirlinePolicy = asyncHandler(async (req, res) => {
  const { FareId, SearchKey, FlightKey, ApiNo, id } = req.body;

  //fetch airline policy from the api 1
  if (ApiNo == 1) {
    try {
      if (isNull([FareId, SearchKey, FlightKey, ApiNo])) {
        return res
          .status(400)
          .json(
            new ApiResponse(
              400,
              { success: false },
              "please Enter All the Feild Compalsary"
            )
          );
      }
      //fetch the data from the api
      const AirPolicy = await sendPostRequest(
        `${process.env.LIVE_URL_ETRAV_FLIGHT}/AirAPIService.svc/JSONService/Air_FareRule`,
        { "Content-Type": "application/json" },
        {
          Auth_Header: authHeaders(),
          Search_Key: SearchKey,
          Flight_Key: FlightKey,
          Fare_Id: FareId,
        }
      );

      //check the data is empty or not
      if (!AirPolicy) {
        return res
          .status(400)
          .json(
            new ApiResponse(
              400,
              {
                success: false,
                data: "some error ocuure while fetching aipolicy data",
              },
              "something problem occure while fetching data of air policy"
            )
          );
      }
       //send the response to the client
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { success: true, data: AirPolicy?.data?.FareRules[0].FareRuleDesc },
            "Fetch SuccessFully"
          )
        );
    } catch (error) {
      console.log(error);
      return res
        .status(400)
        .json(new ApiResponse(400, { success: false, data: error }, error));
    }
  }
  //fetch airline policy from the api 2
  if (ApiNo == 2) {
    const AirLinePolicy = await sendPostRequest(
      "https://apitest.tripjack.com/fms/v2/farerule",
      head,
      {
        id,
        flowType: "SEARCH",
      }
    );

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { success: true, data: AirLinePolicy.data },
          "Fetch SuccessFully"
        )
      );
  }
});

//Getseat
const GetFlightSeat = asyncHandler(async (req, res) => {
  const { Id, ApiNo, Api1Data } = req.body;
  // const {username} = req.user;

  if (ApiNo == "1") {
    if (!Api1Data) {
      return res
        .status(400)
        .json(
          new ApiResponse(
            400,
            { success: false },
            "Please Enter the Api 1 request Data"
          )
        );
    }

    const { data } = await sendPostRequest(
      `${process.env.LIVE_URL_ETRAV_FLIGHT}/AirAPIService.svc/JSONService/Air_GetSeatMap`,
      {},
      {
        Auth_Header: authHeaders(),
        ...Api1Data,
      }
    );

    if (data.Response_Header.Error_InnerException) {
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { success: true, data: data.Response_Header.Error_InnerException },
            data.Error_InnerException
          )
        );
    }

    return res
      .status(200)
      .json(new ApiResponse(200, { success: true, data }, "Data Fetch"));
  }
  if (ApiNo == "2") {
    const bookingid = await GetBookingId(Id);
    //This is Run While id is Exired
    if (
      bookingid ==
      "Keys Passed in the request is already expired. Please pass valid keys"
    ) {
      return res
        .status(400)
        .json(new ApiResponse(400, { success: false }, bookingid));
    }

    //if we get the Booking Id then get the SeatMap using bookingId
    const seatMap = await sendPostRequest(
      "https://apitest.tripjack.com/fms/v1/seat",
      head,
      { bookingId: bookingid }
    );

    //if seat selection is not Applicable for the flight
    if (seatMap.errors) {
      return res
        .status(200)
        .json(
          new ApiResponse(200, { success: false }, seatMap.errors[0].message)
        );
    }

    //This return seatMap if seatMaping is avble
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { success: true, data: seatMap.data },
          "Data SuccessFully Fetched"
        )
      );
  }

  return res
    .status(400)
    .json(
      new ApiResponse(
        400,
        { success: false, data: "Please Enter ApiNo" },
        "Please Enter ApiNo"
      )
    );
});

//Flight ssr
const GetFlightSSR = asyncHandler(async (req, res) => {
  const { ApiNo, Search_Key, Flight_Key } = req.body;

  if (ApiNo == "1") {
    const SSRDetails = await sendPostRequest(
      "",
      {},
      {
        Auth_Header: authHeaders(),
        Search_Key,
        AirSSRRequestDetails: [
          {
            Flight_Key,
          },
        ],
      }
    );

    if (!SSRDetails) {
      return res
        .status(400)
        .json(
          new ApiResponse(
            400,
            { success: false, data: "Did't fetch SSRdetails" },
            "Did't fetch SSrdeatils"
          )
        );
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { success: true, data: SSRDetails },
          "Successfully fetched"
        )
      );
  }
  if (ApiNo == "2") {
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { success: false, data: "SSR details is not avalbl" },
          "SSR details is not avalbl"
        )
      );
  }
});

const ReviewSection = asyncHandler(async (req, res) => {
  const { id } = req.body;
  const reviewData = await sendPostRequest(
    `https://apitest.tripjack.com/fms/v1/review`,
    head,
    { priceIds: [id] }
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { success: true, data: reviewData },
        ` data is ${reviewData}`
      )
    );
});

const GetCanellationCharges = asyncHandler(async (req, res) => {
  const { ApiNo, Api1Data, Api2Data } = req.data;

  if (ApiNo == 1) {
    const charges = await sendPostRequest(
      ``,
      {},
      {
        Auth_Header: authHeaders(),
        ...Api1Data,
      }
    );
    if (!charges.data) {
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { success: false, data: "charges not found" },
            "charges not found"
          )
        );
    }
    return res
      .status(200)
      .json(new ApiResponse(200, { success: true, data: "" }, ""));
  } else if (ApiNo == 2) {
    const charges = await sendPostRequest(``, head, Api2Data);
    if (!charges.data) {
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { success: false, data: "charges not found" },
            "charges not found"
          )
        );
    }
    return res
      .status(200)
      .json(new ApiResponse(200, { success: true, data: "" }, ""));
  }
});
//Flight Booking
const FlightBooking = asyncHandler(async (req, res) => {
  const { type,body, bookingDetails } = req.body;

  if (!body) {
    return res
      .status(400)
      .json(
        new ApiResponse(
          400,
          { success: false, data: "Please enter All the Data" },
          "please enter the data"
        )
      );
  }

  if (!body.ApiNo) {
    return res
      .status(400)
      .json(
        new ApiResponse(
          400,
          { success: false, data: "please Enter Apino" },
          "please Enter Apino"
        )
      );
  }

  if (body.ApiNo == "1") {
    const FormateApi1Data = Api1BookingConverter(body);
    const { data } = await sendPostRequest(
      `${process.env.LIVE_URL_ETRAV_FLIGHT}/AirAPIService.svc/JSONService/Air_TempBooking`,
      {},
      {
        Auth_Header: authHeaders(),
        ...FormateApi1Data,
      }
    );
    console.log(data);
    if (!data) {
      return res
        .status(500)
        .json(
          new ApiResponse(
            500,
            {
              success: false,
              data: "Something went wrong while booking flight",
            },
            "Something went wrong while booking flight"
          )
        );
    }

    const saveData = await flightbookingdata.create({
      UserId:req.user._id,
      ContactDetails: req.user.email ||  req.user.mobile,
      UserType: "User",
      BookingRefNum: data.Booking_RefNo,
      Flight: bookingDetails.flight || " example",
      Pax: bookingDetails.pax || "2 adult 2 child 0 infants",
      BookingStatus: false,
      TravelDate: bookingDetails.TDate || "09/09/0909",
      Pnr: "",
    });

    if (!saveData) {
      return res.status(
        200,
        {
          success: false,
          data: "Something problem in save the data in database",
        },
        "something problem in save data in the database"
      );
    }

    return res
      .status(200)
      .json(new ApiResponse(200, { success: true, data }, "Success"));
  }
  else if (body.ApiNo == "2") {
    const FormateApi2Data = Api2BookingConverter(body);

    FormateApi2Data.bookingId = body.bookingId;

    const data = await sendPostRequest(
      "https://apitest.tripjack.com/oms/v1/air/book",
      head,
      FormateApi2Data
    );
   
    if (!data) {
      return res
        .status(400)
        .json(
          new ApiResponse(
            400,
            { success: false, data: "Something went wrong while booking" },
            "Something went wrong while booking"
          )
        );
    }

    const PNR = await sendPostRequest(
      `https://apitest.tripjack.com/oms/v1/booking-details`,
      head,
      {
        "bookingId": data.data.bookingId,
        "requirePaxPricing": true
      }
    );
    console.log(PNR.data)
    let pnr =""
    if(PNR.data.order.status == "SUCCESS")
    {
      console.log(PNR.data.itemInfos.AIR.travellerInfos[0].pnrDetails)
      pnr =  JSON.stringify(PNR.data.itemInfos.AIR.travellerInfos[0].pnrDetails)
      console.log(pnr)
    }

    const saveData = await flightbookingdata.create({
      UserId:req.user._id,
      ContactDetails: req.user.email || req.user.mobile ,
      UserType: "User",
      BookingRefNum: body.bookingId,
      Flight: bookingDetails.flight || " example",
      Pax: bookingDetails.pax || "2 adult 2 child 0 infants",
      BookingStatus: false,
      TravelDate: bookingDetails.TDate || "09/09/0909",
      Pnr: pnr,
    });
    console.log(saveData)

    return res
      .status(200)
      .json(
        new ApiResponse(200, { success: true, data: data.data || data }, "Booking Done")
      );
  }
});


const GetBookingDetails = asyncHandler(async (req, res) => {
  const { ApiNo, Api1Data, Api2Data } = req.body;

  if (!ApiNo) {
    return res
      .status(400)
      .json(
        new ApiResponse(400, { success: false, data: "Please Enter the ApiNo" })
      );
  }

  if (ApiNo == "1") {
    const bookingDetails = await sendPostRequest(
      `http://uat.etrav.in/airlinehost/AirAPIService.svc/JSONService/Air_Reprint`,
      {},
      {
        Auth_Header: authHeaders(),
        Booking_RefNo: Api1Data.Booking_RefNo,
        Airline_PNR: "",
      }
    );

    if (!bookingDetails.data) {
      return res
        .status(400)
        .json(
          new ApiResponse(
            400,
            { success: false, data: "Please Enter the correct booking ref no" },
            "Please Enter the correct booking ref no"
          )
        );
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { success: true, data: bookingDetails.data },
          "Booking SuccessFull"
        )
      );
  } else if (ApiNo == "2") {
    try {
      const Bookingdetails = await sendPostRequest(
        `https://apitest.tripjack.com/oms/v1/booking-details`,
        head,
        Api2Data
      );

      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { success: true, data: Bookingdetails.data },
            "Booking data is fetch "
          )
        );
    } catch (error) {
      return res
        .status(400)
        .json(
          new ApiResponse(
            400,
            { success: false, data: error },
            `error is come ${error}`
          )
        );
    }
  }
});

//complete for api1
const CancelFlightBooking = asyncHandler(async (req, res) => {
  const { ApiNo, Api1Data, Api2Data } = req.body;
  if (!ApiNo) {
    return res
      .status(400)
      .json(
        new ApiResponse(
          400,
          { success: false, data: "Please Enter the All the details" },
          "Plese Enter all the details"
        )
      );
  }

  if (ApiNo == "1") {
    try {
      const CancelApi1Tickit = await sendPostRequest(
        `${process.env.LIVE_URL_ETRAV_FLIGHT}/AirAPIService.svc/JSONService/Air_TicketCancellation`,
        {},
        {
          Auth_Header: authHeaders(),
          ...Api1Data,
        }
      );
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { success: true, data: CancelApi1Tickit.data },
            "Booking Cancellation Successfull"
          )
        );
    } catch (error) {
      return res
        .status(400)
        .json(
          new ApiResponse(
            400,
            { success: false, data: error },
            `error is occure ${error}`
          )
        );
    }
  }
  if (ApiNo == "2") {
    const { id } = Api2Data;
    console.log(id)
    if (!id) {
      return res.status(400)
        .json(
          new ApiResponse(400, { success: false, data: "please enter id" }, "please Enter Id")
        )
    }

    const cancelFlightApi2 = await sendPostRequest(`https://apitest.tripjack.com/oms/v1/hotel/cancel-booking/${id}`, head)
    console.log(cancelFlightApi2)
    if (cancelFlightApi2.data.errors) {
      return res.status(400)
        .json(
          new ApiResponse(400, { success: true, data: cancelFlightApi2.data }, "Booking unCancelSuccessfully")
        )
    }

    return res.status(200)
      .json(
        new ApiResponse(200, { success: true, data: cancelFlightApi2.data }, "Booking CancelSuccessfully")
      )
  }

});

const Reprice = asyncHandler(async (req, res) => {
  const { ApiNo, Api1Data, Api2Data } = req.body;
  if (!ApiNo) {
    return res
      .status(400)
      .json(new ApiResponse(400, { success: false, data: "no api no" }, ""));
  }

  if (ApiNo == "1") {
    const { data } = await sendPostRequest(
      `${process.env.LIVE_URL_ETRAV_FLIGHT}/AirAPIService.svc/JSONService/Air_Reprice`,
      {},
      {
        Auth_Header: authHeaders(),
        ...Api1Data,
      }
    );
    console.log(data);
    if (!data) {
      return res
        .status(400)
        .json(
          new ApiResponse(400, { success: false, data: "not come data" }, "")
        );
    }

    return res
      .status(200)
      .json(new ApiResponse(200, { success: true, data: data }, "success"));
  }
  else if (ApiNo == 2) {

    const data = await sendPostRequest(
      "https://apitest.tripjack.com/fms/v1/review",
      headers,
      {
        priceIds: Api2Data.id,
      }



    );

    if (data.errors) {
      return res
        .status(400)
        .json(
          new ApiResponse(
            400,
            { success: false, data: data.errors },
            "something while wrong fetching data"
          )
        );
    }
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { success: true, data: data.data },
          "data fetch successfully!"
        )
      );
  }
});

const MakrupData = asyncHandler(async (req,res)=>{
  const {amount , airline , is_return , travel_type , pax_number} = req.body

  const markup = await generateMarkup(amount , airline , is_return , travel_type , pax_number);

  return res.status(200)
  .json(
    new ApiResponse(200,{success:true , data:markup} , "markup amount")
  )
})

const AddBalace = asyncHandler(async(req,res)=>{
  const {RefNo} = req.body
  const add = await sendPostRequest("https://api.etrav.in/Trade/TradeAPIService.svc/JSONService/AddPayment" ,{},{
    Auth_Header:authHeaders(),
    "ClientRefNo":"Testing Team",
    "RefNo":RefNo ,
    "TransactionType":0,
    "ProductId": "1"
  })

  return res.status(200)
  .json(
    new ApiResponse(200,{success:true , data:add.data},"success")
  )
})

const Tickting = asyncHandler(async(req,res)=>{
  const {Booking_RefNo,Ticketing_Type} = req.body

  try {
    const tick = await sendPostRequest(`${process.env.LIVE_URL_ETRAV_FLIGHT}/AirAPIService.svc/JSONService/Air_Ticketing`,{},{
      Auth_Header:authHeaders(),
       "Booking_RefNo":Booking_RefNo ,
      "Ticketing_Type": Ticketing_Type
    })
  
    if(tick.data.AirlinePNRDetails.AirlinePNRs)
    {
       const getFlightData = await FlightBooking.findOne({UserId:req.user._id , BookingRefNum:Booking_RefNo})
       getFlightData.Pnr = tick.data.AirlinePNRDetails.AirlinePNRs;
       getFlightData.save();
    }
    return res.status(200)
    .json(
      new ApiResponse(200,{success:true , data:tick.data},"success")
    )
  } catch (error) {
    return res.status(400)
    .json(
      new ApiResponse(400,{success:false , data:error} , "somthing error is coming")
    )
  }

  
})




export {
  GetAllBestFlight, //complete
  SearchAirLine, //complete
  GetAirlinePolicy, //complete
  GetFlightSeat, //complete
  GetFlightSSR, //complete
  FlightBooking, //complete
  GetBookingDetails, //complete 
  CancelFlightBooking, //complete 
  ReviewSection, //complete
  Reprice,// complete
  MakrupData,//complete
  AddBalace,//complete
  Tickting//complete
};


