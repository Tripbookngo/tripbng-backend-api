import { ApiResponse } from '../../utils/ApiResponse.js';
import { generateOTP } from '../../utils/generateOtp.js';
import { sendMail } from '../../utils/sendMail.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { OtpVfy } from '../../models/Agent/OtpVfy.models.js';
import { isNull } from '../../utils/formCheck.js';
import { Cp } from '../../models/Agent_Cp/Cp.models.js';
import { sendSMS } from '../../utils/SMS.js';

const GetCpProfile = asyncHandler(async (req, res) => {
  const cp = req.user;
  if (!cp) {
    return res
      .status(400)
      .json(
        new ApiResponse(400, { success: false, data: 'agent is not found' }, 'agent is not found')
      );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { success: true, data: cp }, 'Agent fetch successfully'));
});

const GetCpUrl = asyncHandler(async (req, res) => {
  const user = req.user;
  const id = req.params.id;
  if (!id) {
    return res
      .status(400)
      .json(new ApiResponse(400, { success: false, data: 'invalid url' }, 'Invalid url'));
  }
  let cp = null;
  if (user.Usertype == 'Admin') {
    cp = await Cp.findById(id).select('-password');
  } else {
    cp = await Cp.findById(id).select('-password -aprove');
  }

  return res
    .status(400)
    .json(new ApiResponse(400, { success: true, data: cp }, 'Data Fetch Successfully'));
});

export { GetCpProfile, GetCpUrl };
