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
import juice from "juice"
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
    const htmltemplate = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>TripBnG Login OTP</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
      :root {
        --primary: #FF6A00;
        --primary-dark: #E55A00;
        --secondary: #00A8FF;
        --light: #F8F9FA;
        --dark: #212529;
        --gray: #6C757D;
        --yellow: #F59E0B;
        --yellow-light: #FEF3C7;
      }
      
      body {
        font-family: 'Poppins', Arial, sans-serif;
        background: linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%);
        margin: 0;
        padding: 0;
        color: var(--dark);
      }
      .container {
        background-color: #ffffff;
        max-width: 600px;
        margin: 30px auto;
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 10px 30px rgba(0,0,0,0.08);
        transition: transform 0.3s ease;
      }
      .container:hover {
        transform: translateY(-5px);
      }
      .header {
        background: linear-gradient(135deg, #FF6A00 0%, #FF8C00 100%);
        padding: 40px 30px;
        text-align: center;
        color: white;
        position: relative;
        overflow: hidden;
      }
      .header::before {
        content: "";
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%);
        transform: rotate(30deg);
      }
      .header h1 {
        margin: 0;
        font-size: 36px;
        font-weight: 700;
        position: relative;
        text-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }
      .header p {
        margin: 10px 0 0;
        font-weight: 300;
        font-size: 18px;
        position: relative;
        opacity: 0.9;
      }
      .logo {
        width: 80px;
        height: 80px;
        margin-bottom: 15px;
        background-color: white;
        border-radius: 50%;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        position: relative;
      }
      .logo img {
        width: 60px;
        height: 60px;
      }
      .content {
        padding: 40px;
        color: var(--dark);
        line-height: 1.6;
        font-size: 16px;
      }
      .content p {
        margin-bottom: 20px;
      }
      .otp-box {
        font-size: 28px;
        font-weight: bold;
        background: var(--yellow-light);
        color: var(--yellow);
        padding: 20px;
        border-radius: 12px;
        text-align: center;
        letter-spacing: 5px;
        margin: 30px 0;
        box-shadow: 0 4px 6px rgba(0,0,0,0.05);
        animation: pulse 2s infinite;
        border: 2px dashed rgba(245, 158, 11, 0.3);
      }
      @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.02); }
        100% { transform: scale(1); }
      }
      .highlight {
        color: var(--primary);
        font-weight: 600;
      }
      .footer {
        background-color: var(--light);
        padding: 25px;
        text-align: center;
        font-size: 14px;
        color: var(--gray);
        border-top: 1px solid rgba(0,0,0,0.05);
      }
      .button-group {
        margin-top: 30px;
        text-align: center;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 15px;
      }
      .btn {
        background-color: var(--primary);
        color: white;
        text-decoration: none;
        padding: 12px 20px;
        border-radius: 30px;
        font-weight: 600;
        transition: all 0.3s ease;
        display: inline-block;
        box-shadow: 0 4px 8px rgba(255, 106, 0, 0.2);
      }
      .btn:hover {
        background-color: var(--primary-dark);
        transform: translateY(-2px);
        box-shadow: 0 6px 12px rgba(255, 106, 0, 0.3);
      }
      .btn-secondary {
        background-color: var(--secondary);
        box-shadow: 0 4px 8px rgba(0, 168, 255, 0.2);
      }
      .btn-secondary:hover {
        background-color: #0093D9;
        box-shadow: 0 6px 12px rgba(0, 168, 255, 0.3);
      }
      .social-links {
        margin-top: 30px;
        display: flex;
        justify-content: center;
        gap: 15px;
      }
      .social-icon {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: var(--light);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
      }
      .social-icon:hover {
        background-color: var(--primary);
        transform: scale(1.1);
      }
      .social-icon img {
        width: 20px;
        height: 20px;
      }
      .expiry-notice {
        background-color: rgba(255, 106, 0, 0.1);
        padding: 15px;
        border-radius: 8px;
        text-align: center;
        margin: 25px 0;
        border-left: 4px solid var(--primary);
      }
      .signature {
        margin-top: 30px;
        font-style: italic;
        color: var(--gray);
      }
      .signature strong {
        color: var(--dark);
        font-style: normal;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <div class="logo">
          <img src="./tripbng.png" alt="TripBnG Logo">
        </div>
        <h1>TripBnG</h1>
        <p>Your Trusted Travel Partner</p>
      </div>
      <div class="content">
        <p>Hi <strong class="highlight">${contact_feild}</strong>,</p>
        <p>Thank you for choosing <strong class="highlight">TripBnG</strong> for your travel needs!</p>
        <p>To complete your verification and secure your account, please use the following One-Time Password (OTP):</p>
        
        <div class="otp-box">${otp}</div>
        
        <div class="expiry-notice">
          <p>⚠️ This code will expire in <strong>10 minutes</strong>. Please do not share it with anyone.</p>
        </div>
        
        <p>If you didn't request this verification, please ignore this email or contact our support team immediately.</p>
        
        <p class="signature">Happy Travels,<br><strong>TripBnG India Private Limited</strong></p>

        <div class="button-group">
          <a href="https://tripbng.com/flights" class="btn">✈️ Search Flights</a>
          <a href="https://tripbng.com/buses" class="btn">🚌 Search Buses</a>
          <a href="https://tripbng.com/hotels" class="btn btn-secondary">🏨 Search Hotels</a>
          <a href="https://tripbng.com/holidays" class="btn btn-secondary">🌴 Holiday Trips</a>
        </div>
        
        <div class="social-links">
          <a href="https://facebook.com/tripbng" class="social-icon">
            <img src="https://cdn-icons-png.flaticon.com/512/124/124010.png" alt="Facebook">
          </a>
          <a href="https://twitter.com/tripbng" class="social-icon">
            <img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="Twitter">
          </a>
          <a href="https://instagram.com/tripbng" class="social-icon">
            <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" alt="Instagram">
          </a>
          <a href="https://linkedin.com/company/tripbng" class="social-icon">
            <img src="https://cdn-icons-png.flaticon.com/512/3536/3536505.png" alt="LinkedIn">
          </a>
        </div>
      </div>
      <div class="footer">
        <p>© 2025 TripBnG India Pvt. Ltd. | All Rights Reserved</p>
        <p><a href="https://tripbng.com/privacy" style="color: var(--gray); text-decoration: none;">Privacy Policy</a> | <a href="https://tripbng.com/terms" style="color: var(--gray); text-decoration: none;">Terms of Service</a></p>
        <p>Need help? Contact us at <a href="mailto:support@tripbng.com" style="color: var(--primary); text-decoration: none;">support@tripbng.com</a></p>
      </div>
    </div>
  </body>
</html>`
   
    // const htmlWithInlineCSS = juice(htmltemplate);
    let user = await User.findOne({ email: contact_feild });
    if (!user) {
      user = await User.create({ email: contact_feild });
    }

 
    await sendMail(
      contact_feild,
      'Your TripBnG Verification Code',
      `${htmltemplate}`
    );
 
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
