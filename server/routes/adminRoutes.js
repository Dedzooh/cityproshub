import express from "express";
import Provider from "../models/Provider.js";

const router = express.Router();

// Toggle verification status
router.put("/verify/:id", async (req, res) => {
  try {
    const provider = await Provider.findById(req.params.id);
    if (!provider) return res.status(404).json({ message: "Provider not found" });

    provider.verified = !provider.verified;
    await provider.save();

    res.json({ message: "Verification status updated", verified: provider.verified });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
