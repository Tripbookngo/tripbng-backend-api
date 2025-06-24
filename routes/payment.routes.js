import { payUPayment, payUsuccess } from '../controllers/Payment/pay.payment.controller.js';
import { UserVerify } from '../middlewares/Uservrfy.js';
import { Router } from 'express';

const router = Router();

router.route('/paymentinti').post(payUPayment);
router.route('/verify/:txnid').post(UserVerify, payUsuccess);

export const PymentRoute = router;
