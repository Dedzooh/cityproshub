import mongoose from "mongoose";

const providerSchema = new mongoose.Schema({
  name: String,
  businessName: String,
  category: String,
  city: String,
  description: String,
  whatsapp: String,
  imageUrl: String,
  verified: { type: Boolean, default: false },
  featured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
    rating: { type: Number, default: 0 },
  reviews: [
    {
      name: String,
      comment: String,
      stars: { type: Number, min: 1, max: 5 },
      date: { type: Date, default: Date.now },
    },
  ],
});

export default mongoose.model("Provider", providerSchema);
