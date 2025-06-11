import {
    HotelBooking,
    GetHotelDetails
     } from "../controllers/Hotel/hotel.controller.js";
import { Router } from "express";

const router = Router();

router.route('/booking').post(HotelBooking);
router.route('/getHotelDetails').get(GetHotelDetails);
const HotelRoutes = router;

export {HotelRoutes};