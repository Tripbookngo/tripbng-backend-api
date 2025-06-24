import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { Query } from '../../models/query.model.js';

const AddQuery = asyncHandler(async (req, res) => {
  const { user_id, query, query_for } = req.body;
  if (!user_id || !query || !query_for) {
    return res
      .status(400)
      .json(
        new ApiResponse(
          400,
          { success: false, data: 'Please Enter All the Data' },
          'Please Enter all the Data'
        )
      );
  }
  const datasave = await Query.create({ user_id, query, query_for });
  if (!datasave) {
    return res
      .status(500)
      .json(
        new ApiResponse(500, { success: false, data: 'Somthing probelm into the databse site' })
      );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { success: true, data: datasave }, 'Query save successfully'));
});

export { AddQuery };
