// server/routes/providerRoutes.js
import express from "express";
import Provider from "../models/Provider.js";

const router = express.Router();

// Add Provider
router.post("/", async (req, res) => {
  try {
    const newProvider = await Provider.create(req.body);
    res.status(201).json(newProvider);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get Providers (with optional filters)
router.get("/", async (req, res) => {
  try {
    const { category, city } = req.query;
    const filter = {};

    if (category) filter.category = new RegExp(category, "i");
    if (city) filter.city = new RegExp(city, "i");

    const providers = await Provider.find(filter).sort({ createdAt: -1 });
    res.json(providers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
