import { GroupInquiryMarkup } from "../../../models/B2C/Flight/groupInquiryMarkup.model.js";
import {ApiResponse} from "../../../utils/ApiResponse.js";
import { asyncHandler } from "../../../utils/asyncHandler.js"

const markupTypes = [
    "Flat for Full Booking",
    "Flat Per Pax",
    "Percentage(%) for Full Booking",
    "Percentage(%) Per Pax"
];

const isValidMarkupTypeIndex = (index) => {
    return typeof index === "number" && index >= 0 && index < markupTypes.length;
};

const formatMarkup = (markup) => {
    const formatType = (section) => ({
        ...section,
        per_type: isValidMarkupTypeIndex(section?.per_type)
            ? markupTypes[section.per_type]
            : section?.per_type
    });

    const result = {};
    const fields = Object.keys(markup._doc);
    for (const key of fields) {
        if (["_id", "createdAt", "updatedAt", "__v"].includes(key)) {
            result[key] = markup[key];
        } else {
            result[key] = formatType(markup[key]);
        }
    }
    return result;
};

// CREATE
export const createGroupInquiryMarkup = asyncHandler(async (req, res) => {
    const body = req.body;

    for (const key in body) {
        const per_type = body[key]?.per_type;
        if (per_type !== undefined && !isValidMarkupTypeIndex(per_type)) {
            return res.status(400).json(
                new ApiResponse(400, { success: false, data: `Invalid per_type index at ${key}` })
            );
        }
    }

    const created = await GroupInquiryMarkup.create(body);
    return res.status(201).json(
        new ApiResponse(201, { success: true, data: created }, "Group Inquiry Markup created successfully")
    );
});

// READ ALL
export const getAllGroupInquiryMarkup = asyncHandler(async (req, res) => {
    const markups = await GroupInquiryMarkup.find();
    const formatted = markups.map(formatMarkup);

    return res.status(200).json(
        new ApiResponse(200, { success: true, data: formatted }, "Fetched all Group Inquiry markups")
    );
});

// READ ONE
export const getGroupInquiryMarkupById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const markup = await GroupInquiryMarkup.findById(id);
    if (!markup) {
        return res.status(404).json(
            new ApiResponse(404, { success: false, data: null }, "Markup not found")
        );
    }

    return res.status(200).json(
        new ApiResponse(200, { success: true, data: formatMarkup(markup) }, "Fetched markup")
    );
});

// UPDATE
export const updateGroupInquiryMarkup = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const body = req.body;

    for (const key in body) {
        const per_type = body[key]?.per_type;
        if (per_type !== undefined && !isValidMarkupTypeIndex(per_type)) {
            return res.status(400).json(
                new ApiResponse(400, { success: false, data: `Invalid per_type index at ${key}` })
            );
        }
    }

    const updated = await GroupInquiryMarkup.findByIdAndUpdate(id, body, {
        new: true,
        runValidators: true,
    });

    if (!updated) {
        return res.status(404).json(
            new ApiResponse(404, { success: false, data: null }, "Markup not found")
        );
    }

    return res.status(200).json(
        new ApiResponse(200, { success: true, data: formatMarkup(updated) }, "Updated successfully")
    );
});
