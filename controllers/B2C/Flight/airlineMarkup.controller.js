import { AirLineWiseMarkup } from '../../../models/B2C/Flight/airlineMarkup.model.js';
import { ApiResponse } from '../../../utils/ApiResponse.js';
import { isNull } from '../../../utils/isNull.js';
import { asyncHandler } from '../../../utils/asyncHandler.js';

// Markup type values (indexed)
const markupTypes = [
  'Flat for Full Booking',
  'Flat commision Pax',
  'Flat commision Pax commision Segment',
  'Flat commision Segment Full Booking',
  'commisioncentage(%) for Full Booking',
  'commisioncentage(%) commision Pax',
  'commisioncentage(%) commision Pax commision Segment',
  'commisioncentage(%) commision Segment Full Booking',
];

// Helper function to validate index
const isValidCommisionIndex = (index) => {
  return typeof index === 'number' && index >= 0 && index < markupTypes.length;
};

// Helper to convert index to string on response
const formatMarkup = (markup) => {
  const replaceIndexWithText = (segment) => ({
    ...segment,
    commision_type: isValidCommisionIndex(segment?.commision_type)
      ? markupTypes[segment.commision_type]
      : segment?.commision_type,
  });

  return {
    ...markup._doc,
    domestic_one_way: replaceIndexWithText(markup.domestic_one_way),
    domestic_round_way: replaceIndexWithText(markup.domestic_round_way),
    international_one_way: replaceIndexWithText(markup.international_one_way),
    international_round_way: replaceIndexWithText(markup.international_round_way),
  };
};

// CREATE
export const createAirlineMarkup = asyncHandler(async (req, res) => {
  const {
    carrier,
    domestic_one_way,
    domestic_round_way,
    international_one_way,
    international_round_way,
  } = req.body;

  if (isNull([carrier])) {
    return res
      .status(400)
      .json(new ApiResponse(400, { success: false, data: 'Carrier is required' }));
  }

  const segments = [
    domestic_one_way,
    domestic_round_way,
    international_one_way,
    international_round_way,
  ];
  for (const segment of segments) {
    if (segment?.commision_type !== undefined && !isValidCommisionIndex(segment.commision_type)) {
      return res
        .status(400)
        .json(new ApiResponse(400, { success: false, data: 'Invalid commision_type index' }));
    }
  }

  const createdMarkup = await AirLineWiseMarkup.create({
    carrier,
    domestic_one_way,
    domestic_round_way,
    international_one_way,
    international_round_way,
  });

  return res
    .status(201)
    .json(
      new ApiResponse(201, { success: true, data: createdMarkup }, 'Markup added successfully')
    );
});

// READ ALL
export const getAllAirlineMarkups = asyncHandler(async (req, res) => {
  const markups = await AirLineWiseMarkup.find();
  const formatted = markups.map(formatMarkup);

  return res
    .status(200)
    .json(new ApiResponse(200, { success: true, data: formatted }, 'Fetched all markups'));
});

// READ ONE
export const getAirlineMarkupById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const markup = await AirLineWiseMarkup.findById(id);
  if (!markup) {
    return res
      .status(404)
      .json(new ApiResponse(404, { success: false, data: null }, 'Markup not found'));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { success: true, data: formatMarkup(markup) }, 'Fetched markup'));
});

// UPDATE
export const updateAirlineMarkup = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const segments = [
    req.body.domestic_one_way,
    req.body.domestic_round_way,
    req.body.international_one_way,
    req.body.international_round_way,
  ];

  for (const segment of segments) {
    if (segment?.commision_type !== undefined && !isValidCommisionIndex(segment.commision_type)) {
      return res
        .status(400)
        .json(new ApiResponse(400, { success: false, data: 'Invalid commision_type index' }));
    }
  }

  const updated = await AirLineWiseMarkup.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updated) {
    return res
      .status(404)
      .json(new ApiResponse(404, { success: false, data: null }, 'Markup not found'));
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, { success: true, data: formatMarkup(updated) }, 'Updated successfully')
    );
});
