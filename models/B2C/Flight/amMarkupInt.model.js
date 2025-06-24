import mongoose from 'mongoose';

const AmMarkupINTSchema = new mongoose.Schema(
  {
    cancellation_quotation: {
      per: {
        type: Number,
        default: 0,
      },
      per_type: {
        type: String,
      },
    },
    instant_cancellation: {
      per: {
        type: Number,
        default: 0,
      },
      per_type: {
        type: String,
      },
    },

    reissue: {
      per: {
        type: Number,
        default: 0,
      },
      per_type: {
        type: String,
      },
    },
    air_no_show: {
      per: {
        type: Number,
        default: 0,
      },
      per_type: {
        type: String,
      },
    },
    air_void: {
      per: {
        type: Number,
        default: 0,
      },
      per_type: {
        type: String,
      },
    },
    air_meal: {
      per: {
        type: Number,
        default: 0,
      },
      per_type: {
        type: String,
      },
    },
    air_baggage: {
      per: {
        type: Number,
        default: 0,
      },
      per_type: {
        type: String,
      },
    },
    air_correction: {
      per: {
        type: Number,
        default: 0,
      },
      per_type: {
        type: String,
      },
    },
    miscellaneous_quotation: {
      per: {
        type: Number,
        default: 0,
      },
      per_type: {
        type: String,
      },
    },
    miscellaneous_quotation_refund: {
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

export const AmMarkupINT = mongoose.model('AmMarkupINT', AmMarkupINTSchema);
