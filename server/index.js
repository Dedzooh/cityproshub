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

// ✅ Allowed origins (frontend URLs)
const allowedOrigins = [
  "http://localhost:5173",           // Local Vite
  "http://localhost:3000",           // React dev (optional)
  "https://cityproshub.vercel.app",  // Vercel frontend
  "https://www.cityproshub.co.ke",   // Custom domain (future)
];

// ✅ Enable CORS (with error-safe handling)
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow server-to-server or tools (like Postman) without origin
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`❌ Blocked by CORS: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// ✅ Handle preflight OPTIONS requests (important for browsers)
app.options("*", cors());

// ✅ Middleware
app.use(express.json({ limit: "10mb" }));

// ✅ Log to confirm startup
console.log("✅ All middlewares loaded");

// ✅ API Routes
app.use("/api/providers", providerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/mpesa", mpesaRoutes);
app.use("/api/auth", authRoutes);

// ✅ Health check route (Render uses this)
app.get("/", (req, res) => res.send("🌍 CityProsHub API is running fine ✅"));

// ✅ Global error handler (prevents blank responses on CORS rejection)
app.use((err, req, res, next) => {
  console.error("🚨 Server Error:", err.message);
  res.status(500).json({ error: err.message || "Internal Server Error" });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${PORT}`);
});
