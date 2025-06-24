import mongoose from 'mongoose';

const ApiFlightSchema = new mongoose.Schema(
  {
    apiname: {
      type: String,
      required: true,
      uniqe: true,
    },
    apiid: {
      type: Number,
      required: true,
      uniqe: true,
    },
    apifavour: [{ type: String, required: true }],
    status: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  { timestamps: true }
);

export const ApiFlight = mongoose.model('ApiFlight', ApiFlightSchema);
