/** @format */

import express from 'express';
import AuthController from '../controllers/auth.controller.js';
import UserController from '../controllers/user.controller.js';
import multer from 'multer';
import {UserVerify} from "../middlewares/Uservrfy.js"


const storage = multer.memoryStorage({
	destination(req, file, callback) {
		callback(null, '');
	},
});

const uploadMedia = multer({ storage });

const router = express.Router();

router.route('/login').post(AuthController.login);
router.route('/verify').post(AuthController.verifyOTP);
router.route('/resend').post(AuthController.resendOTP);
router.route('/socialLogin').post(AuthController.socialLogin);
router.route('/disableaccount').post(AuthController.disableAccount);
router.route('/deleteaccountotpsend').post(UserVerify , AuthController.deleteAccountOtpsend);
router.route('/verifyotpfordelete').post(UserVerify , AuthController.verifyOtpForDelete)
router.route('/presignedurl').post(UserController.getPreSignedUrl);
router.route('/visaqr').post(UserVerify , UserController.VisaQuiryGenrate)
router
	.route('/profile')
	.get(UserVerify, UserController.getProfile)
	.patch(UserVerify, UserController.updateProfile);

router.route('/countries/all').get(UserController.AllCountries);
router.route('/visa/all').get(UserVerify, UserController.UserVisaBookings);
router.route('/visa/save').post(UserVerify, UserController.visaBooking);
router
	.route('/visa/upload')
	.post(UserVerify, uploadMedia.single('file'), UserController.UploadVisaFile);
router
	.route('/visa/:id')
	.get(UserVerify, UserController.VisaBookingById)
	.patch(UserVerify, UserController.UpdateVisaBooking)
	.delete(UserVerify, UserController.DeleteVisaBooking);

router.route('/makePayment').post(UserVerify,UserController.payUPayment);


router.route('/addbalance').post(UserVerify,UserController.AddVolate);
router.route('/withdrawbalance').post(UserVerify,UserController.WithdrawVolate);

router.route('/forgetpassword').post(UserVerify,AuthController.ForgetPassword)
router.route('/changeforgerpassword').post(UserVerify , AuthController.ChangeForgetPassword)
router.route('/logoutforgerpassword').post(AuthController.GetOtpOfLogoutPasswordForget)
router.route('/logoutchangepassword').post(AuthController.VeriFyLogOutOtpAndChangePassword)

router.route('/transactions').get(UserVerify,UserController.GetAllTrasactions)
router.route('/getflightbookingdetails').post(UserVerify,UserController.GetFlightBookingHistroy)

export const UserRouter = router;
