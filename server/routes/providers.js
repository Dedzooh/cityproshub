// server/routes/providers.js
import express from "express";
import Provider from "../models/Provider.js";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

// 🧱 Cloudinary Storage setup
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "cityproshub/providers",
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

// 🧾 Multer middleware
const upload = multer({ storage });

// ✅ Create new provider (with optional image upload)
router.post("/", upload.single("image"), async (req, res) => {
  try {
    console.log("📩 [POST] /api/providers — Incoming data:", req.body);

    // ✅ Get image URL if uploaded
    const imageUrl = req.file ? req.file.path : "";

    const providerData = {
      ...req.body,
      imageUrl,
      verified: false, // default unverified; admin approves later
    };

    const newProvider = await Provider.create(providerData);

    console.log("✅ New provider created:", newProvider.businessName);
    res.status(201).json(newProvider);
  } catch (err) {
    console.error("❌ Error creating provider:", err);
    res.status(400).json({ message: err.message });
  }
});

// ✅ Fetch all verified providers
router.get("/", async (req, res) => {
  try {
    const { category, city, page = 1, limit = 12 } = req.query;
    const filter = { verified: true };

    if (category) filter.category = new RegExp(category, "i");
    if (city) filter.city = new RegExp(city, "i");

    const providers = await Provider.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Provider.countDocuments(filter);

    res.json({ providers, total });
  } catch (err) {
    console.error("❌ Error fetching providers:", err);
    res.status(500).json({ message: "Failed to fetch providers." });
  }
});

// ✅ Add review to provider
router.post("/:id/review", async (req, res) => {
  const { name, comment, stars } = req.body;

  try {
    const provider = await Provider.findById(req.params.id);
    if (!provider) return res.status(404).json({ message: "Provider not found" });

    provider.reviews.push({ name, comment, stars });
    provider.rating =
      provider.reviews.reduce((sum, r) => sum + r.stars, 0) / provider.reviews.length;

    await provider.save();

    res.status(201).json({ message: "✅ Review added successfully!" });
  } catch (err) {
    console.error("❌ Review error:", err);
    res.status(400).json({ message: err.message });
  }
});

// 🧩 Handle undefined routes (for Render logs clarity)
router.all("*", (req, res) => {
  console.warn(`⚠️ Unknown route accessed: ${req.originalUrl}`);
  res.status(404).json({ message: "Route not found" });
});

export default router;
