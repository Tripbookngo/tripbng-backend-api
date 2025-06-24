import {
  CreateCoupne,
  UseCoupne,
  DisableCoupen,
  GetAllCoupenCode,
} from '../controllers/Payment/coupne.controller.js';
import { Router } from 'express';
import { UserVerify } from '../middlewares/Uservrfy.js';

const router = Router();

router.route('/createcoupen').post(UserVerify, CreateCoupne);
router.route('/usecoupen').post(UserVerify, UseCoupne);
router.route('/disablecoupen').post(UserVerify, DisableCoupen);
router.route('/getallcoupen').post(UserVerify, GetAllCoupenCode);

export const CoupenRoute = router;
