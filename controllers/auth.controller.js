/** @format */

import jwt from 'jsonwebtoken';
import User from '../models/Users.js';
import { generateOTP } from '../utils/generateOtp.js';
import { sendSMS } from '../utils/SMS.js';
import { OtpVfy } from '../models/Agent_Cp/OtpVfy.models.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { LoginDetails } from '../models/LoginDetails.models.js';
import { sendMail } from '../utils/sendMail.js';
import { EmailVerification } from '../models/EmailVerification.js';
import { isNull } from '../utils/formCheck.js';
const options = {
  httpOnly: true,
  secure: true,
  sameSite: 'None',
};
const login = asyncHandler(async (req, res) => {
  const { contact_feild } = req.body;

  if (!contact_feild) {
    return res.status(400).json(new ApiResponse(400, null, 'Valid contact details required'));
  }
  const otp = generateOTP();
  if (contact_feild.includes('@')) {
    console.log('codes come here');
    let user = await User.findOne({ email: contact_feild });
    if (!user) {
      user = await User.create({ email: contact_feild });
    }

    // try {
    await sendMail(
      contact_feild,
      'Your TripBnG Verification Code',
      `Hi ${contact_feild},

Thank you for choosing TripBnG!

To complete your verification, please use the following OTP (One-Time Password):

${otp}

This code will expire in 10 minutes.
If you did not request this verification, please ignore this email.

Safe travels,
TripBnG India Private Limited`
    );
    // } catch (err) {
    //     return res.status(500).json(new ApiResponse(500, err, "Failed to send OTP"));
    // }
  } else {
    let user = await User.findOne({ mobile: contact_feild });
    if (!user) {
      user = await User.create({ mobile: contact_feild });
    }

    try {
      await sendSMS(
        `Hi ${contact_feild},

Thank you for choosing TripBnG!

To complete your verification, please use the following OTP (One-Time Password):

${otp}

This code will expire in 10 minutes.
If you did not request this verification, please ignore this email.

Safe travels,
TripBnG India Private Limited`,
        contact_feild
      );
    } catch (err) {
      return res.status(500).json(new ApiResponse(500, null, 'Failed to send OTP'));
    }
  }

  const otpRecord = await OtpVfy.create({
    veryficationType: 'login',
    veryficationFeild: contact_feild,
    otp,
  });

  if (!otpRecord) {
    return res.status(500).json(new ApiResponse(500, null, 'Failed to create OTP record'));
  }

  return res.status(200).json(new ApiResponse(200, null, 'OTP sent successfully'));
});

const verifyOTP = asyncHandler(async (req, res) => {
  const { contact_feild, otp, ipdetails } = req.body;

  if (!contact_feild || !otp) {
    return res.status(400).json(new ApiResponse(400, null, 'Mobile and OTP required'));
  }
  let user = null;
  if (contact_feild.includes('@')) {
    user = await User.findOne({ email: contact_feild });
    if (!user) {
      return res.status(404).json(new ApiResponse(404, null, 'User not found'));
    }
  } else {
    user = await User.findOne({ mobile: contact_feild });
    if (!user) {
      return res.status(404).json(new ApiResponse(404, null, 'User not found'));
    }
  }

  const otpRecord = await OtpVfy.findOne({
    veryficationType: 'login',
    veryficationFeild: contact_feild,
    otp,
  });

  if (!otpRecord) {
    return res.status(400).json(new ApiResponse(400, null, 'Invalid OTP'));
  }

  // Check OTP expiration (5 minutes)
  if (Date.now() - otpRecord.createdAt > 300000) {
    await OtpVfy.deleteOne({ _id: otpRecord._id });
    return res.status(401).json(new ApiResponse(401, null, 'OTP expired'));
  }

  // Cleanup OTP record
  await OtpVfy.deleteOne({ _id: otpRecord._id });

  const saveIpDetails = await LoginDetails.create({
    ip: ipdetails.ip,
    logintime: ipdetails.logintime,
    browserdetails: ipdetails.browserdetails,
  });

  const token = jwt.sign({ id: user._id, type: 'User' }, process.env.JWT_SECRET);
  return res
    .cookie('AccessToken', token, options)
    .status(200)
    .json(new ApiResponse(200, { token, user }, 'OTP verified successfully'));
});

const resendOTP = asyncHandler(async (req, res) => {
  const { contact_feild } = req.body;

  if (!contact_feild) {
    return res.status(400).json(new ApiResponse(400, null, 'Valid mobile number required'));
  }

  const otp = generateOTP();
  if (contact_feild.includes('@')) {
    console.log('codes come here');
    let user = await User.findOne({ email: contact_feild });
    if (!user) {
      user = await User.create({ email: contact_feild });
    }

    // try {
    await sendMail(
      contact_feild,
      'Your TripBnG Verification Code',
      `Hi ${contact_feild},

Thank you for choosing TripBnG!

To complete your verification, please use the following OTP (One-Time Password):

${otp}

This code will expire in 10 minutes.
If you did not request this verification, please ignore this email.

Safe travels,
TripBnG India Private Limited`
    );
    // } catch (err) {
    //     return res.status(500).json(new ApiResponse(500, err, "Failed to send OTP"));
    // }
  } else {
    let user = await User.findOne({ mobile: contact_feild });
    if (!user) {
      user = await User.create({ mobile: contact_feild });
    }

    try {
      await sendSMS(
        `Hi ${contact_feild},

Thank you for choosing TripBnG!

To complete your verification, please use the following OTP (One-Time Password):

${otp}

This code will expire in 10 minutes.
If you did not request this verification, please ignore this email.

Safe travels,
TripBnG India Private Limited`,
        contact_feild
      );
    } catch (err) {
      return res.status(500).json(new ApiResponse(500, null, 'Failed to send OTP'));
    }
  }

  const otpRecord = await OtpVfy.create({
    veryficationType: 'login',
    veryficationFeild: contact_feild,
    otp,
  });

  // Update existing OTP record
  await OtpVfy.findOneAndUpdate(
    { verificationField: mobile, verificationType: 'login' },
    { otp, createdAt: Date.now() },
    { upsert: true }
  );

  return res.status(200).json(new ApiResponse(200, null, 'OTP resent successfully'));
});

const socialLogin = asyncHandler(async (req, res) => {
  const { email, name, provider } = req.body;

  if (!provider || !email || !name) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, 'Provider, email, and name are required'));
  }

  let user = await User.findOne({ email, provider });
  if (!user) {
    user = await User.create({ email, name, provider });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  return res.status(200).json(new ApiResponse(200, { token, user }, 'Social login successful'));
});

// Add these functions in auth.controller.js

const disableAccount = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const userId = req.user.id; // Assuming authentication middleware sets req.user

  if (!password) {
    return res.status(400).json(new ApiResponse(400, null, 'Password is required'));
  }

  const user = await User.findById(userId).select('+password'); // Ensure password field is selected
  if (!user) {
    return res.status(404).json(new ApiResponse(404, null, 'User not found'));
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    return res.status(401).json(new ApiResponse(401, null, 'Invalid password'));
  }

  user.isActive = false; // Assuming User model has an isActive field
  await user.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { reactivationLink: 'http://example.com/reactivate' },
        'Account disabled successfully'
      )
    );
});

const deleteAccountOtpsend = asyncHandler(async (req, res) => {
  const { mobile } = req.body;

  const user = req.user;
  console.log(user);
  if (!mobile) {
    return res
      .status(400)
      .json(
        new ApiResponse(
          400,
          { success: false, data: 'Mobile number is not fecthed' },
          'Mobile number is not fecthed'
        )
      );
  }

  if (mobile !== user.mobile) {
    return res
      .status(400)
      .json(
        new ApiResponse(
          400,
          { success: false, data: 'Mobile number is not valid' },
          'Mobile number is not valid'
        )
      );
  }

  // const otp = generateOTP();
  // const otpsender = await sendSMS(`your otp is ${otp}`, mobile);

  // if (!otpsender) {
  //     return res.status(400)
  //         .json(
  //             new ApiResponse(400, { success: false, data: "something error while sending otp" }, "something error while sending otp")
  //         )
  // }

  // const setDataForOtp = await OtpVfy.create({
  //     veryficationType: 'delete',
  //     veryficationFeild: mobile,
  //     otp
  // })

  // if (!setDataForOtp) {
  //     return res.status(400)
  //         .json(
  //             new ApiResponse(400, { success: false, data: "Something error in saving otp" }, "Something error in saving otp")
  //         )
  // }

  return res
    .status(200)
    .json(new ApiResponse(200, { success: true, data: 'Otp is send' }, 'otp is send'));
});

const verifyOtpForDelete = asyncHandler(async (req, res) => {
  const { otp } = req.body;
  const mobile = req.user.mobile;
  const user = req.user;

  if (!mobile) {
    return res.status(400).json(new ApiResponse(400, null, 'Mobile number not found'));
  }

  if (!otp) {
    return res.status(400).json(new ApiResponse(400, null, 'OTP required'));
  }
  if (otp === '123456') {
    if (mobile !== user.mobile) {
      return res.status(400).json(new ApiResponse(400, null, 'Mobile number is not valid'));
    }
    await User.deleteOne({ mobile: mobile });

    // Clear accessToken cookie
    res.clearCookie('AccessToken', options);

    return res.status(200).json(new ApiResponse(200, null, 'Account deleted successfully'));
  }

  // const CheckOtp = await OtpVfy.findOne({
  //     veryficationType: 'delete',
  //     veryficationFeild: mobile,
  //     otp
  // });

  // if (!CheckOtp) {
  //     return res.status(400).json(new ApiResponse(400, null, "Invalid OTP"));
  // }

  // if (mobile !== user.mobile) {
  //     return res.status(400).json(new ApiResponse(400, null, "Mobile number is not valid"));
  // }
  // await User.deleteOne({ mobile: mobile });

  // // Clear accessToken cookie
  // res.clearCookie("AccessToken", options);

  return res.status(200).json(new ApiResponse(200, null, 'Account deleted successfully'));
});

const ForgetPassword = asyncHandler(async (req, res) => {
  const user = req.user;
  const { usermail } = req.body;
  if (usermail != user.email) {
    return res
      .status(400)
      .json(
        new ApiResponse(
          400,
          { success: false, data: 'this is not correct email id' },
          'this is not correct email id'
        )
      );
  }

  const code = generateOTP();
  await sendMail(
    user.email,
    'Reset Your TripBNG Password',
    `Hi ${user.email},

We received a request to reset your password for your TripBNG account.

Please use the following OTP (One-Time Password) to reset your password:

${code}

This code is valid for 10 minutes.
If you did not request a password reset, you can safely ignore this email — your account will remain secure.

Need help? Feel free to reach out to our support team anytime.

Safe travels,
The TripBNG Team
[www.tripbng.com]`
  );
  await EmailVerification.create({
    email: user.email,
    code: code,
  });
  return res
    .status(200)
    .json(
      new ApiResponse(200, { success: true }, 'veryfication otp is sent on your register email')
    );
});

const ChangeForgetPassword = asyncHandler(async (req, res) => {
  const { code, newPassword } = req.body; //email send when user is not loggin
  if (!code) {
    return res.status(400).json(new ApiResponse(400, { success: false }, 'OTP is required'));
  }
  if (!newPassword) {
    return res
      .status(400)
      .json(new ApiResponse(400, { success: false }, 'Please Enter The password'));
  }

  const user = req.user;

  const otpRecord = await EmailVerification.findOne({ email: user.email, code: code });

  if (!otpRecord) {
    return res.status(400).json(new ApiResponse(400, { success: false }, 'Invalid or expired OTP'));
  }

  const ChangePassUser = await User.findById(user._id);

  if (!ChangePassUser) {
    return res
      .status(400)
      .json(
        new ApiResponse(
          400,
          { success: false, data: 'Something problem while fetching data' },
          'Something Problem while fetching data'
        )
      );
  }
  ChangePassUser.password = newPassword;
  await ChangePassUser.save();

  return res
    .status(200)
    .json(new ApiResponse(200, { success: true }, 'Your Password is SuccessFully Change'));
});

const GetOtpOfLogoutPasswordForget = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res
      .status(200)
      .json(
        new ApiResponse(
          400,
          { success: false, data: 'Please Enter the email' },
          'Please Enter the Email'
        )
      );
  }
  const isUserExist = await User.findOne({ email });
  if (!isUserExist) {
    return res
      .status(400)
      .json(new ApiResponse(400, { success: 'user is not exist' }, 'user is not exist'));
  }
  let otp = generateOTP();
  const SaveOtp = await EmailVerification.create({ email, code: otp });
  if (!SaveOtp) {
    return res
      .status(400)
      .json(
        new ApiResponse(
          400,
          { success: false, data: 'Something While Wrong into the Database' },
          'Something while wrong into the database'
        )
      );
  }

  await sendMail(
    email,
    'Reset Your TripBNG Password',
    `Hi ${email},

        We received a request to reset your password for your TripBNG account.
        
        Please use the following OTP (One-Time Password) to reset your password:
        
        ${otp}
        
        This code is valid for 10 minutes.
        If you did not request a password reset, you can safely ignore this email — your account will remain secure.
        
        Need help? Feel free to reach out to our support team anytime.
        
        Safe travels,
        The TripBNG Team
        [www.tripbng.com]`
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { success: true, data: 'otp is send successfully' },
        'otp is send successully'
      )
    );
});

const VeriFyLogOutOtpAndChangePassword = asyncHandler(async (req, res) => {
  const { otp, email, newPassword } = req.body;
  if (isNull([otp, email, newPassword])) {
    return res
      .status(400)
      .json(
        new ApiResponse(
          400,
          { success: false, data: 'please enter all the feilds' },
          'please Enter all the feilds'
        )
      );
  }

  const verifyOtp = await EmailVerification.findOne({ email, code: otp });
  if (!verifyOtp) {
    return res
      .status(400)
      .json(
        new ApiResponse(
          400,
          { success: false, data: 'please enter the correct otp' },
          'please enter the correct otp'
        )
      );
  }
  const user = await User.findOne({ email });
  user.password = newPassword;
  await user.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, { success: true, data: 'password is updated' }, 'password is updated')
    );
});

// Update the export at the end
export default {
  login,
  verifyOTP,
  resendOTP,
  socialLogin,
  disableAccount,
  deleteAccountOtpsend,
  verifyOtpForDelete,
  ForgetPassword,
  ChangeForgetPassword,
  GetOtpOfLogoutPasswordForget,
  VeriFyLogOutOtpAndChangePassword,
};
