import {
  SearchBus,
  BusSeatMap,
  TempBooking,
  GetBookingDetails,
  GetBookingCancellationDetails,
  CancelBooking,
  getCitylist,
  Citycode,
  ConfirmBooking,
  AddBalance,
} from '../controllers/Bus/bus.controller.js';
import { Router } from 'express';

const router = Router();

router.route('/searchbus').post(SearchBus);
router.route('/seatmap').post(BusSeatMap);
router.route('/tempbooking').post(TempBooking);
router.route('/getbookingdetails').post(GetBookingDetails);
router.route('/getbookingcancellationdetails').post(GetBookingCancellationDetails);
router.route('cancelbooking').post(CancelBooking);
router.route('/getcitylist').get(getCitylist);
router.route('/getcitycode').get(Citycode);
router.route('/confirmbooking').post(ConfirmBooking);
router.route('/addblance').post(AddBalance);

const BusRoutes = router;

export { BusRoutes };
