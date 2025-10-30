// server/routes/providerRoutes.js
import express from "express";
import Provider from "../models/Provider.js";

const router = express.Router();

// ✅ Add Provider
router.post("/", async (req, res) => {
  try {
    console.log("📩 [POST] /api/providers — Incoming request body:", req.body);

    const newProvider = await Provider.create(req.body);
    console.log("✅ Provider successfully created:", newProvider.businessName);

    res.status(201).json(newProvider);
  } catch (err) {
    console.error("❌ Error creating provider:", err.message);
    res.status(400).json({ message: err.message });
  }
});

// ✅ Get Providers (with optional filters)
router.get("/", async (req, res) => {
  try {
    const { category, city } = req.query;
    const filter = {};

    if (category) filter.category = new RegExp(category, "i");
    if (city) filter.city = new RegExp(city, "i");

    console.log("🔍 [GET] /api/providers — Filters received:", filter);

    const providers = await Provider.find(filter).sort({ createdAt: -1 });

    console.log(
      `✅ Found ${providers.length} provider(s)${
        Object.keys(filter).length
          ? ` matching filters: ${JSON.stringify(filter)}`
          : " (no filters applied)"
      }`
    );

    res.json(providers);
  } catch (err) {
    console.error("❌ Error fetching providers:", err.message);
    res.status(500).json({ message: err.message });
  }
});

// ✅ Handle invalid route requests (optional but useful for Render logs)
router.all("*", (req, res) => {
  console.warn(`⚠️  Unknown route hit: ${req.originalUrl}`);
  res.status(404).json({ message: "Route not found" });
});

export default router;
