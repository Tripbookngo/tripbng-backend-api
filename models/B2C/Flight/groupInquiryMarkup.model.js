import mongoose from 'mongoose';

const groupInquiryMarkupSchema = new mongoose.Schema(
  {
    domestic_one_way: {
      per: {
        type: Number,
        default: 0,
      },
      per_type: {
        type: String,
      },
    },
    domestic_round_way: {
      per: {
        type: Number,
        default: 0,
      },
      per_type: {
        type: String,
      },
    },
    international_one_way: {
      per: {
        type: Number,
        default: 0,
      },
      per_type: {
        type: String,
      },
    },
    international_round_way: {
      per: {
        type: Number,
        default: 0,
      },
      per_type: {
        type: String,
      },
    },
  },
  { timestamps: true }
);

export const GroupInquiryMarkup = mongoose.model('GroupInquiryMarkup', groupInquiryMarkupSchema);
