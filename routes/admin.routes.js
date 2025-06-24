import express from 'express';
import {
  LoginAdmin,
  CreateSubAdmin,
  CreateSuperAdmin,
  ChangePassword,
  AdminLogout,
  ChangeForgetPassword,
  ForgetPassword,
  veryfyOTPLogin,
  GetAllUser,
  GetAllAgents,
  GetAllCp,
  GiveAgentAprove,
  GetAllBookedFlights,
  GetAllBusBooking,
  BlockAgent,
  BlockCp,
  inActiveAgent,
  inActiveCp,
  GetAdminProflile,
  GetAllTravQuery,
  GetAllVisaQuery,
  GetAllSubAdmin,
  DeleteSubAdmin,
  GetOtpOfLogoutPasswordForget,
  VeriFyLogOutOtpAndChangePassword,
  GetLoginIpDetails,
  CreateApiFlights,
  UpdateApiFlight,
  DeleteApiFlight,
  GetAllApiFlight,
} from '../controllers/Admin/admin.controller.js';
import { GetBalance } from '../controllers/Admin/admin.pyment.controller.js';
import { UserVerify } from '../middlewares/Uservrfy.js';

const router = express.Router();

router.route('/testCreate').post(CreateSuperAdmin);
router.route('/login').post(LoginAdmin);
router.route('/vfyOTPLogin').post(veryfyOTPLogin);
router.route('/getdminprofile').get(UserVerify, GetAdminProflile);
router.route('/createSubAdmin').post(UserVerify, CreateSubAdmin);
router.route('/changePass').post(UserVerify, ChangePassword);
router.route('/forgetPass').post(UserVerify, ForgetPassword);
router.route('/ChangeForgetPass').post(UserVerify, ChangeForgetPassword);
router.route('/getalluser').get(UserVerify, GetAllUser);
router.route('/logout').post(UserVerify, AdminLogout);
router.route('/getallagent').get(UserVerify, GetAllAgents);
router.route('/getallcp').get(UserVerify, GetAllCp);
router.route('/Aprove').post(UserVerify, GiveAgentAprove);
router.route('/deleteagent/:id').post(UserVerify, BlockAgent);
router.route('/deletecp/:id').post(UserVerify, BlockCp);
router.route('/inactivecp').post(UserVerify, inActiveCp);
router.route('/inactiveagent').post(UserVerify, inActiveAgent);
router.route('/getallflightbooking').get(UserVerify, GetAllBookedFlights);
router.route('/getallbusbooking').get(UserVerify, GetAllBusBooking);
router.route('/getallvisabooking').get(UserVerify, GetAllVisaQuery);
router.route('/getalltravquery').get(UserVerify, GetAllTravQuery);
router.route('/getallsubadmin').get(UserVerify, GetAllSubAdmin);
router.route('/deletesubadmin').delete(UserVerify, DeleteSubAdmin);
router.route('/sendotpforforgetpasswordlogout').post(GetOtpOfLogoutPasswordForget);
router.route('/changeforgetpasswordlogout').post(VeriFyLogOutOtpAndChangePassword);
router.route('/getallloginip').get(UserVerify, GetLoginIpDetails);
router.route('/createapiflight').post(UserVerify, CreateApiFlights);
router.route('/updateapiflight').post(UserVerify, UpdateApiFlight);
router.route('/deleteapiflight').post(UserVerify, DeleteApiFlight);
router.route('/allapiflight').get(UserVerify, GetAllApiFlight);

router.route('/getbalance').post(GetBalance);
export const AdminRouter = router;
