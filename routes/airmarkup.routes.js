import express from 'express';
import {
  createAirlineMarkup,
  getAllAirlineMarkups,
  getAirlineMarkupById,
  updateAirlineMarkup,
} from '../controllers/B2C/Flight/airlineMarkup.controller.js';
import {
  createAmMarkupDom,
  getAllAmMarkupDom,
  getAmMarkupDomById,
  updateAmMarkupDom,
} from '../controllers/B2C/Flight/ammarkupdomestic.controller.js';
import {
  createAmMarkupINT,
  getAllAmMarkupINT,
  getAmMarkupINTById,
  updateAmMarkupINT,
} from '../controllers/B2C/Flight/amMarkupInt.controller.js';

import {
  createFlightMarkup,
  getAllFlightMarkups,
  getFlightMarkupById,
  updateFlightMarkup,
  deleteFlightMarkup,
} from '../controllers/B2C/Flight/flightMarkup.controller.js';

import {
  createGroupInquiryMarkup,
  getAllGroupInquiryMarkup,
  getGroupInquiryMarkupById,
  updateGroupInquiryMarkup,
} from '../controllers/B2C/Flight/groupInquiryMarkup.controller.js';

const router = express.Router();

router.post('/airlinewise-create', createAirlineMarkup);
router.get('/airlinewise', getAllAirlineMarkups);
router.get('/airlinewise/:id', getAirlineMarkupById);
router.put('/airlinewise-update/:id', updateAirlineMarkup);

router.post('/amdom-create', createAmMarkupDom);
router.get('/amdom', getAllAmMarkupDom);
router.get('/amdom/:id', getAmMarkupDomById);
router.put('/amDom-update/:id', updateAmMarkupDom);

router.post('/ammarkupint-create', createAmMarkupINT);
router.get('/ammarkupint', getAllAmMarkupINT);
router.get('/ammarkupint/:id', getAmMarkupINTById);
router.put('/ammarkupint-update/:id', updateAmMarkupINT);

router.post('/flightMarkup-create', createFlightMarkup);
router.get('/flightMarkup', getAllFlightMarkups);
router.get('/flightMarkup/:id', getFlightMarkupById);
router.put('/flightMarkup-update/:id', updateFlightMarkup);
router.post('/flightmarkup-delete/:id', deleteFlightMarkup);

router.post('/groupInquiryMarkup-create', createGroupInquiryMarkup);
router.get('/groupInquiryMarkup', getAllGroupInquiryMarkup);
router.get('/groupInquiryMarkup/:id', getGroupInquiryMarkupById);
router.put('/groupInquiryMarkup-update/:id', updateGroupInquiryMarkup);

const AirlinemarkupRoute = router;
export { AirlinemarkupRoute };
