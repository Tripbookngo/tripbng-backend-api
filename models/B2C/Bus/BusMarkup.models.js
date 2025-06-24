import mongoose from 'mongoose';

const BusMarkupSchema = new mongoose.Schema(
  {
    bus: {
      per: {
        type: Number,
        default: 0,
      },
      per_type: {
        type: String,
        enum: ['Flat Per Pax', 'Percentage(%) Per Pax'],
      },
    },
    cancellation: {
      per: {
        type: Number,
        default: 0,
      },
      per_type: {
        type: String,
        enum: ['Flat Per Pax', 'Percentage(%) Per Pax'],
      },
    },
  },
  { timestamps: true }
);

export const BusMarkup = mongoose.model('BusMarkup', BusMarkupSchema);
