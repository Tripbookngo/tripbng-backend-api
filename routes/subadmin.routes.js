import {
    GetBusBookingDetails,
    GetQuiryBus,
    ReplayQuiryBus
} from "../controllers/SubAdmin/bus.subadmin.controller.js"

import {
       GetFlightBookingDetails,
        GetQuiryFlight,
        ReplayQuiryFlight
} from "../controllers/SubAdmin/flight.subadmin.controller.js"

import {
    GetHolidayBookingDetails,
    GetQuiryHoliday,
    ReplayQuiryHoliday
} from "../controllers/SubAdmin/holiday.subadmin.controller.js";

import {
    GetVisaBookingDetails,
    GetQuiryVisa,
    ReplayQuiryVisa
} from "../controllers/SubAdmin/visa.subadmin.controller.js";
import {loginSubAdmin} from "../controllers/SubAdmin/subadmin.controller.js"
import {UserVerify} from "../middlewares/Uservrfy.js"
import {Router} from "express";

const router = Router();

//subadmin-auth                                            
router.route('/login').post(loginSubAdmin);

//bus-subadmin-controller
router.route('/bussubadmin/busbookingdetails').get(GetBusBookingDetails);
router.route('/bussubadmin/busquery').get(GetQuiryBus);
router.route('/bussubadmin/replyquirybus').post(ReplayQuiryBus);

//flight-subadmin-controller
router.route('/flightsubadmin/flightbookingdetails').get(GetFlightBookingDetails);
router.route('/flightsubadmin/flightquery').get(GetQuiryFlight);
router.route('/flightsubadmin/replyquiryflight').post(ReplayQuiryFlight);

//holiday-subadmin-controller
router.route('/holidaysubadmin/holidaybookingdetails').get(GetHolidayBookingDetails);
router.route('/holidaysubadmin/holidayquery').get(GetQuiryHoliday);
router.route('/holidaysubadmin/replyquiryholiday').post(ReplayQuiryHoliday);

//visa-subadmin-controller
router.route('/visasubadmin/visabookingdetails').get(GetVisaBookingDetails);
router.route('/visasubadmin/visaquery').get(GetQuiryVisa);
router.route('/visasubadmin/replyquiryvisa').post(ReplayQuiryVisa);

const SubAdminRoute = router;
export {SubAdminRoute}