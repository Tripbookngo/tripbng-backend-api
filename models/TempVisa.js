import mongoose, { model } from 'mongoose';

const TempvisaSchema = new mongoose.Schema(
  {
    username: {
      type: String,
    },
    contact: {
      type: String,
      required: false,
    },
    email: {
      type: String,
    },
    for: {
      type: String,
    },
    travel_date: {
      type: String,
    },
    stayin_days: {
      type: String,
    },
    visa_type: {
      type: String,
    },
    no_of_person: [
      {
        adult: String,
        child: String,
        inflant: String,
      },
    ],
  },
  { timestamps: true }
);

export const Tempvisas = mongoose.model('Tempvisas', TempvisaSchema);
