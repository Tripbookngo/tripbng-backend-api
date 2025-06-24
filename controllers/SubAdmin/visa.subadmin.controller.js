import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { Query } from '../../models/query.model.js';
import { Tempvisas } from '../../models/TempVisa.js';

const GetVisaBookingDetails = asyncHandler(async (req, res) => {
  const allVisaQuery = await Tempvisas.find({});

  if (allVisaQuery.length <= 0) {
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { success: true, data: 'not any record found' },
          'not any record found'
        )
      );
  }
  return res
    .status(200)
    .json(new ApiResponse(200, { success: true, data: allVisaQuery }, 'data fetched'));
});

const GetQuiryVisa = asyncHandler(async (req, res) => {
  const allQuiries = await Query.find({ query_for: 'visa' });
  if (!allQuiries) {
    return res
      .status(200)
      .json(200, { success: true, data: 'Not found any quire' }, 'Not found any quiry');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { success: true, data: allQuiries }, 'data fetch successfully'));
});

const ReplayQuiryVisa = asyncHandler(async (req, res) => {
  const { query_id, reply } = req.body;
  if (!query_id || reply) {
    return res
      .status(400)
      .json(
        new ApiResponse(
          400,
          { success: false, data: 'Please Enter All the details' },
          'Please Enter All the details'
        )
      );
  }
  const query = await Query.findById(query_id);
  if (!query) {
    return res
      .status(400)
      .json(
        new ApiResponse(
          400,
          { success: false, data: 'given id is not valid' },
          'given id is not valid'
        )
      );
  }

  query.reply.push(reply);
  await query.save();

  return res
    .status(200)
    .json(new ApiResponse(200, { success: true, data: query }, 'Give Replay SuccessFully'));
});

export { GetVisaBookingDetails, GetQuiryVisa, ReplayQuiryVisa };
