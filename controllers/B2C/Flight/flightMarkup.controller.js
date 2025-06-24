import { FlightMarkup } from '../../../models/B2C/Flight/flightMarkup.model.js';
import { ApiResponse } from '../../../utils/ApiResponse.js';
import { asyncHandler } from '../../../utils/asyncHandler.js';

const markupTypes = [
  'Flat for Full Booking',
  'Flat Per Pax',
  'Flat Per Pax Per Segment',
  'Flat Per Segment Full Booking',
  'Percentage(%) for Full Booking',
  'Percentage(%) Per Pax',
  'Percentage(%) Per Pax Per Segment',
  'Percentage(%) Per Segment Full Booking',
];

const isValidMarkupTypeIndex = (index) => {
  return typeof index === 'number' && index >= 0 && index < markupTypes.length;
};

const formatMarkup = (markup) => {
  const formatType = (section) => ({
    ...section,
    per_type: isValidMarkupTypeIndex(section?.per_type)
      ? markupTypes[section.per_type]
      : section?.per_type,
  });

  const result = {};
  const fields = Object.keys(markup._doc);
  for (const key of fields) {
    if (key === '_id' || key === 'createdAt' || key === 'updatedAt' || key === '__v') {
      result[key] = markup[key];
    } else {
      result[key] = formatType(markup[key]);
    }
  }
  return result;
};

// CREATE
export const createFlightMarkup = asyncHandler(async (req, res) => {
  const body = req.body;

  for (const key in body) {
    const per_type = body[key]?.per_type;
    if (per_type !== undefined && !isValidMarkupTypeIndex(per_type)) {
      return res
        .status(400)
        .json(new ApiResponse(400, { success: false, data: `Invalid per_type index at ${key}` }));
    }
  }

  const created = await FlightMarkup.create(body);
  return res
    .status(201)
    .json(new ApiResponse(201, { success: true, data: created }, 'Flight Markup created'));
});

// READ ALL
export const getAllFlightMarkups = asyncHandler(async (req, res) => {
  const data = await FlightMarkup.find();
  return res
    .status(200)
    .json(new ApiResponse(200, { success: true, data: data.map(formatMarkup) }, 'Fetched All'));
});

// READ ONE
export const getFlightMarkupById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = await FlightMarkup.findById(id);
  if (!data) {
    return res.status(404).json(new ApiResponse(404, { success: false, data: null }, 'Not found'));
  }
  return res
    .status(200)
    .json(new ApiResponse(200, { success: true, data: formatMarkup(data) }, 'Fetched'));
});

// UPDATE
export const updateFlightMarkup = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const body = req.body;

  for (const key in body) {
    const per_type = body[key]?.per_type;
    if (per_type !== undefined && !isValidMarkupTypeIndex(per_type)) {
      return res
        .status(400)
        .json(new ApiResponse(400, { success: false, data: `Invalid per_type index at ${key}` }));
    }
  }

  const updated = await FlightMarkup.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true,
  });

  if (!updated) {
    return res.status(404).json(new ApiResponse(404, { success: false, data: null }, 'Not found'));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { success: true, data: formatMarkup(updated) }, 'Updated'));
});

export const deleteFlightMarkup = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const updated = await FlightMarkup.findByIdAndDelete(id);

  return res.status(200).json(new ApiResponse(200, { success: true, data: 'Delete' }, 'Delete'));
});
