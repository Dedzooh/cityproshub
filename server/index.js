import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import providerRoutes from "./routes/providers.js";
import adminRoutes from "./routes/adminRoutes.js";
import mpesaRoutes from "./routes/mpesaRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
const app = express();

// ✅ Connect to MongoDB
connectDB();

// ✅ Allowed frontend origins
const allowedOrigins = [
  "http://localhost:5173", // local Vite dev
  "http://localhost:3000", // local React dev
  "https://cityproshub.vercel.app", // production frontend
  "https://www.cityproshub.vercel.app", // alt domain
  "https://cityproshub.co.ke", // custom domain (future)
  "https://cityproshub.onrender.com" // your backend (for internal checks)
];

// ✅ Enable detailed CORS logging and safe handling
app.use(
  cors({
    origin: function (origin, callback) {
      console.log("🌍 Incoming request from origin:", origin);
      // Allow server-to-server or Postman (no origin header)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        console.log("✅ CORS allowed for:", origin);
        callback(null, true);
      } else {
        console.warn("🚫 CORS blocked for:", origin);
        callback(new Error(`Not allowed by CORS: ${origin}`));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// ✅ Handle preflight OPTIONS requests
app.options("*", cors());

// ✅ Middleware
app.use(express.json({ limit: "10mb" }));

console.log("✅ All middlewares loaded");

// ✅ Routes
app.use("/api/providers", providerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/mpesa", mpesaRoutes);
app.use("/api/auth", authRoutes);

// ✅ Health check route (for Render uptime ping)
app.get("/", (req, res) => {
  res.send("🌍 CityProsHub API is running fine ✅");
});

// ✅ Global Error Handler (prevents CORS from crashing the API)
app.use((err, req, res, next) => {
  console.error("🚨 Error caught in global handler:", err.message);
  if (err.message && err.message.includes("CORS")) {
    return res.status(403).json({ error: "CORS policy: Access denied" });
  }
  res.status(500).json({ error: err.message || "Internal Server Error" });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${PORT}`);
});
