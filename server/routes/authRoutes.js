import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// Temporary admin credentials
const ADMIN = {
  email: process.env.ADMIN_EMAIL || "admin@cityproshub.co.ke",
  password: process.env.ADMIN_PASSWORD || "citypros123",
};

// 🔑 LOGIN ROUTE
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (email !== ADMIN.email || password !== ADMIN.password) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: "2h",
  });

  res.json({ token, message: "Login successful" });
});

// ✅ VERIFY TOKEN
router.post("/verify", (req, res) => {
  const { token } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ valid: true, email: decoded.email });
  } catch (err) {
    res.status(401).json({ valid: false });
  }
});

export default router;
