import {
        GetAllBestFlight,
        SearchAirLine,
        GetAirlinePolicy,
        GetFlightSeat,
        GetFlightSSR,
        FlightBooking,
        GetBookingDetails,
        CancelFlightBooking,
        ReviewSection,
        Reprice,
        MakrupData,
        AddBalace,
        Tickting
} from "../controllers/Flight/flight.controller.js"
import {UserVerify} from "../middlewares/Uservrfy.js"
import { Router } from "express"

const router = Router();

router.route('/getFlights').post(GetAllBestFlight)
router.route('/GetAirPolicy').post(GetAirlinePolicy)
router.route('/SearchAirLine').get(SearchAirLine)
router.route('/seatmap').post(GetFlightSeat)
router.route('/getflightssr').post(GetFlightSSR)
router.route('/flightbooking').post(UserVerify,FlightBooking)
router.route('/getbookingdetails').post(GetBookingDetails)
router.route('/cancelflightbooking').delete(CancelFlightBooking)
router.route('/reviewdata').get(ReviewSection)
router.route('/reprice').post(Reprice);
router.route('/markupamount').post(MakrupData)
router.route('/addbalance').post(AddBalace)
router.route('/tickt').post(Tickting)

const Flight = router
export { Flight };
