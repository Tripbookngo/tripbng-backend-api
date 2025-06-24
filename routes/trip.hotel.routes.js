import { Router } from 'express';
import {
  searchHotel,
  detailSearch,
  cancellation,
  review,
  booking,
  bookingDetails,
  bookingCancellation,
  confirmHoldBooking,
} from '../controllers/Hotel/tripjack/tripjack.hotel.controller.js';
const router = Router();

router.route('/tripjack/hotelsearch').post(searchHotel);
router.route('/tripjack/detailsearch').post(detailSearch);
router.route('/tripjack/cancellation').post(cancellation);
router.route('/tripjack/review').post(review);
router.route('/tripjack/booking').post(booking);
router.route('/tripjack/confirm_hold_booking').post(confirmHoldBooking);
router.route('/tripjack/booking_details').post(bookingDetails);
router.route('/tripjack/booking_cancellation').post(bookingCancellation);

export const hotel_router = router;
