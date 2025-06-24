import mongoose from 'mongoose';

const packageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    destination: { type: String, required: true },
    fromCity: { type: String, required: true },
    toCity: { type: String, required: true },
    departureDate: { type: String, required: true },
    returnDate: { type: String, required: true },
    duration: {
      nights: { type: Number, required: true },
      days: { type: Number, required: true },
    },
    currency: { type: String, required: true },
    theme: [{ type: String }], // Example: ['Adventure', 'Luxury', 'Beach']
    isFixedDeparture: { type: Boolean, default: false },
    pricing: [
      {
        fromPax: { type: Number, required: true },
        toPax: { type: Number, required: true },
        singleSharing: { type: Number },
        doubleSharing: { type: Number },
        tripleSharing: { type: Number },
        childWithBed: { type: Number },
        childWithoutBed: { type: Number },
      },
    ],
    hotels: [
      {
        name: { type: String },
        stars: { type: Number },
        mealPlan: { type: String },
        description: { type: String },
      },
    ],
    activities: [
      {
        name: { type: String },
        description: { type: String },
      },
    ],
    transfers: [
      {
        type: { type: String }, // Example: 'Airport Pickup', 'Cab'
        description: { type: String },
      },
    ],
    itinerary: [
      {
        dayNumber: { type: Number },
        highlight: { type: String },
        details: { type: String },
      },
    ],
    inclusions: [{ type: String }],
    exclusions: [{ type: String }],
    coverImages: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model('Package', packageSchema);
