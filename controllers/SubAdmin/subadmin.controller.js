import { SubAdmin } from '../../models/SubAdmin.models.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
// import { Flight } from "../../models/Flight"

const loginSubAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.data;
  if (!email || !password) {
    return res
      .status(400)
      .json(
        new ApiResponse(
          400,
          { success: false, data: 'Please Enter All the feild' },
          'Please Enter the all the feilds'
        )
      );
  }

  const isExist = await SubAdmin.findOne({ email });

  if (!isExist) {
    return res
      .status(400)
      .json(
        new ApiResponse(
          400,
          { success: false, data: 'This Account is not exist' },
          'This Account is not exist'
        )
      );
  }

  const isPasswordCorrect = await SubAdmin.PassCompare(password);
  if (!isPasswordCorrect) {
    return res
      .status(400)
      .json(
        new ApiResponse(
          400,
          { success: false, data: 'Password is incorrect' },
          'Password is incorrect'
        )
      );
  }

  let accessToken = await SubAdmin.GenrateAccessTocken();

  if (!accessToken) {
    accessToken = await SubAdmin.GenrateAccessTocken();
    if (!accessToken) {
      return res
        .status(400)
        .json(
          new ApiResponse(
            400,
            { success: false, data: 'something problem into the server' },
            'something problem in the server'
          )
        );
    }
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { success: true, data: { user: isExist, token: accessToken } }));
});

export { loginSubAdmin };
