import mongoose from 'mongoose';

const VisaDestinationWiseMarkupSchema = new mongoose.Schema(
  {
    destination: {
      type: String,
    },
    markup: {
      per: {
        type: Number,
        default: 0,
      },
      per_type: {
        type: String,
        enum: [
          'Flat for Full Booking',
          'Flat Per Pax',
          'Percentage(%) for Full Booking',
          'Percentage(%) Per Pax',
        ],
      },
    },
  },
  { timestamps: true }
);

export const VisaDestinationWiseMarkup = mongoose.model(
  'VisaDestinationWiseMarkup',
  VisaDestinationWiseMarkupSchema
);
