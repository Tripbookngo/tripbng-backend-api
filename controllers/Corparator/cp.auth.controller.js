import { ApiResponse } from '../../utils/ApiResponse.js';
import { generateOTP } from '../../utils/generateOtp.js';
import { sendMail } from '../../utils/sendMail.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { OtpVfy } from '../../models/Agent_Cp/OtpVfy.models.js';
import { isNull } from '../../utils/formCheck.js';
import { Cp } from '../../models/Agent_Cp/Cp.models.js';
import { sendSMS } from '../../utils/SMS.js';

const options = {
  httpOnly: true,
  secure: true,
};

//This controller Send User To Otp for a email veryfication
const SendMail = asyncHandler(async (req, res) => {
  const Mail = req.body;

  if (!Mail) {
    return res.status(400).json(new ApiResponse(400, { success: false }, 'Please Enter The Email'));
  }

  const otp = generateOTP();
  await sendMail(Mail, 'Your Validation otp', `Your Otp is ${otp}`);

  const EmailVrf = await OtpVfy.create({
    veryficationType: 'email',
    veryficationFeild: Mail,
    otp: otp,
  });

  if (!EmailVrf) {
    return res
      .status(400)
      .json(
        new ApiResponse(
          400,
          { success: false },
          'Something went wrong while proceesing the DataBase'
        )
      );
  }

  return res.status(200).json(new ApiResponse(200, { success: true }, 'Otp Send SuccessFully'));
});
//This controller Send user to otp on the sms
const SendSmsOtp = asyncHandler(async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json(400, { success: false }, 'Please Enter The Phone Number');
  }

  const otp = generateOTP();
  const SMS = await sendSMS(`your otp is ${otp}`, phone);
  if (!SMS) {
    return res
      .status(400)
      .json(
        new ApiResponse(400, { success: false }, 'Something Went Wrong while sending OTP message')
      );
  }

  const setDataBase = await OtpVfy.create({
    veryficationType: 'phone',
    veryficationFeild: phone,
    otp: otp,
  });
  res.status(200).json(new ApiResponse(200, { success: true }, 'Otp Sent SuccessFully'));
});
//this controller The veryfie the otp which is send to the user
const CheckOtp = asyncHandler(async (req, res) => {
  const { type, filed, otp } = req.body;
  if (isNull[(type, filed, otp)]) {
    return res.status(400).json(400, { success: false }, 'Please Enter the All Filed ');
  }

  console.log(type, filed, otp);

  const isVerificationExist = await OtpVfy.findOne({
    veryficationType: type,
    veryficationFeild: filed,
    otp: otp,
  });
  console.log(isVerificationExist);

  if (!isVerificationExist) {
    return res.status(400).json(new ApiResponse(400, { success: false }, 'Please Enter Valid Otp'));
  }
  const delteEmail = await EmailVerification.findByIdAndDelete(isVerificationExist._id);

  return res.status(200).json(new ApiResponse(200, { success: true }, 'Otp is Valid'));
});

//Adhar and pan vrfication leter........

const Register = asyncHandler(async (req, res) => {
  const {
    cpName,
    mobile,
    email,
    country,
    state,
    city,
    pincode,
    address1,
    address2,
    address3,
    adharNumber,
    gstNumber,
    condition,
  } = req.body;

  if (
    isNull([
      cpName,
      mobile,
      email,
      country,
      state,
      city,
      pincode,
      address1,
      address2,
      address3,
      adharNumber,
      gstNumber,
    ])
  ) {
    return res
      .status(400)
      .json(new ApiResponse(400, { success: false }, 'Please Enter All The feilds'));
  }

  const cpr = await Cp.create({
    cpName,
    mobile,
    email,
    country,
    state,
    city,
    pincode,
    address1,
    address2,
    address3,
    adharNumber,
    gstNumber,
    condition,
  });

  if (!cpr) {
    return res
      .status(400)
      .jaon(
        new ApiResponse(
          400,
          { success: false },
          'Something Went Wrong While saving details Please try again'
        )
      );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { success: true, data: cpr },
        'Your Request is sent to Admin We inform All the updates through SMS/email/whatsapp'
      )
    );
});

const Login = asyncHandler(async (req, res) => {
  const { contactFeild, password } = req.body;
  let CpFromDataBase = null;
  if (contactFeild.includes('@')) {
    CpFromDataBase = await Cp.find({ email: contactFeild });
  } else {
    CpFromDataBase = await Cp.find({ mobile: contactFeild });
  }

  const isPasswordCorrect = CpFromDataBase.PassCompare(password);

  if (!isPasswordCorrect) {
    return res
      .status(400)
      .json(new ApiResponse(400, { success: false }, 'Please Enter the correct Password'));
  }

  if (contactFeild.includes('@')) {
    const otp = generateOTP();
    await sendMail(contactFeild, 'Login Verification mail', `Your Otp is ${otp}`);
    const sendEmailObject = await OtpVfy.create({
      veryficationType: 'login',
      veryficationFeild: contactFeild,
      otp: otp,
    });
    if (!sendEmailObject) {
      return res
        .status(400)
        .json(
          new ApiResponse(400, { success: false }, 'Seomthing Went wrong while creating object')
        );
    }

    return res
      .status(200)
      .json(new ApiResponse(200, { success: true }, 'Otp is send on your contact details'));
  } else {
    const otp = generateOTP();
    await sendSMS(`Your OTP is ${otp}`, contactFeild);
    const sendSMSObject = await OtpVfy.create({
      veryficationType: 'login',
      veryficationFeild: contactFeild,
      otp: otp,
    });
    if (!sendSMSObject) {
      return res
        .status(400)
        .json(
          new ApiResponse(400, { success: false }, 'Seomthing Went wrong while creating object')
        );
    }
    return res
      .status(200)
      .json(new ApiResponse(200, { success: true }, 'Otp is send on your contact details'));
  }
});

const LoginVrfy = asyncHandler(async (req, res) => {
  const { type, filed, otp } = req.body;
  if (isNull[(type, filed, otp)]) {
    return res.status(400).json(400, { success: false }, 'Please Enter the All Filed ');
  }

  if (filed.includes('@')) {
    const isOtpValid = await OtpVfy.findOne({
      veryficationType: type,
      veryficationFeild: filed,
      otp: otp,
    });

    if (!isOtpValid) {
      return res
        .status(200)
        .json(new ApiResponse(200, { success: false }, 'Please Enter Valid Otp'));
    }
    const delteEmail = await isOtpValid.findByIdAndDelete(isOtpValid._id);

    const AgentUser = await Agent.findOne({ email: filed });

    const AccessToken = AgentUser.GenrateAccessTocken();
    if (AgentUser.aprove == true) {
      return res
        .status(200)
        .cookie('AccessToken', AccessToken, options)
        .json(new ApiResponse(200, { success: true }, 'Loggin'));
    } else {
      return res
        .status(200)
        .json(
          new ApiResponse(200, { success: true }, "You Can't Login until Admin Aprove Your Request")
        );
    }
  } else {
    const isOtpValid = OtpVfy.findOne({
      veryficationType: type,
      veryficationFeild: filed,
      otp: otp,
    });

    if (!isOtpValid) {
      return res
        .status(200)
        .json(new ApiResponse(200, { success: false }, 'Please Enter Valid Otp'));
    }

    const CpUser = await Cp.findOne({ mobile: filed });
    console.log(Cp);
    const AccessToken = CpUser.GenrateAccessTocken();
    if (CpUser.aprove == true) {
      return res
        .status(200)
        .cookie('AccessToken', AccessToken, options)
        .json(new ApiResponse(200, { success: true }, 'Loggin'));
    } else {
      return res
        .status(200)
        .json(
          new ApiResponse(200, { success: true }, "You Can't Login until Admin Aprove Your Request")
        );
    }
  }
});

export { SendMail, SendSmsOtp, CheckOtp, Register, Login, LoginVrfy };
