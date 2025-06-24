import { createPackages, searchPackages } from '../controllers/Holiday/holiday.controller.js';
import { Router } from 'express';
import { UserVerify } from '../middlewares/Uservrfy.js';

const router = Router();

router.route('/createuserpackage').post(createPackages);
router.route('/searchpackage').post(UserVerify, searchPackages);

export const HolidayRoute = router;
