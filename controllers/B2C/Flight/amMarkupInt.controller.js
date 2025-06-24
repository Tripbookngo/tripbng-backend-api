import { AmMarkupINT } from '../../../models/B2C/Flight/amMarkupInt.model.js';
import { ApiResponse } from '../../../utils/ApiResponse.js';
import { isNull } from '../../../utils/isNull.js';
import { asyncHandler } from '../../../utils/asyncHandler.js';

// Markup types by index
const markupTypes = [
  'Flat for Full Amendment',
  'Flat Per Pax',
  'Percentage(%) for Full Amendment',
  'Percentage(%) Per Pax',
];

// Validate index
const isValidMarkupTypeIndex = (index) => {
  return typeof index === 'number' && index >= 0 && index < markupTypes.length;
};

// Replace index with string name
const formatMarkup = (markup) => {
  const formatType = (section) => ({
    ...section,
    per_type: isValidMarkupTypeIndex(section?.per_type)
      ? markupTypes[section.per_type]
      : section?.per_type,
  });

  const fields = Object.keys(markup._doc);
  const result = {};
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
export const createAmMarkupINT = asyncHandler(async (req, res) => {
  const body = req.body;

  for (const key in body) {
    const per_type = body[key]?.per_type;
    if (per_type !== undefined && !isValidMarkupTypeIndex(per_type)) {
      return res
        .status(400)
        .json(new ApiResponse(400, { success: false, data: `Invalid per_type index at ${key}` }));
    }
  }

  const created = await AmMarkupINT.create(body);

  return res
    .status(201)
    .json(
      new ApiResponse(201, { success: true, data: created }, 'INT Markup created successfully')
    );
});

// READ ALL
export const getAllAmMarkupINT = asyncHandler(async (req, res) => {
  const markups = await AmMarkupINT.find();
  const formatted = markups.map(formatMarkup);

  return res
    .status(200)
    .json(new ApiResponse(200, { success: true, data: formatted }, 'Fetched all INT markups'));
});

// READ ONE
export const getAmMarkupINTById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const markup = await AmMarkupINT.findById(id);
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
export const updateAmMarkupINT = asyncHandler(async (req, res) => {
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

  const updated = await AmMarkupINT.findByIdAndUpdate(id, body, {
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
