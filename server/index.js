import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import providerRoutes from "./routes/providers.js"; // ✅ use consistent name
import adminRoutes from "./routes/adminRoutes.js";
import mpesaRoutes from "./routes/mpesaRoutes.js";

dotenv.config();
const app = express();

// ✅ Connect to MongoDB
connectDB();

// ✅ Enable CORS for both local + deployed frontend
const allowedOrigins = [
  "http://localhost:5173", // Local dev
  "https://cityproshub.vercel.app", // Vercel app
  "https://cityproshub.co.ke", // Custom domain
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed from this origin"));
      }
    },
  })
);

// ✅ Middleware
app.use(express.json());

// ✅ API Routes
app.use("/api/providers", providerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/mpesa", mpesaRoutes);

// ✅ Root route (for Render health check)
app.get("/", (req, res) => res.send("🌍 CityProsHub API Running"));

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`✅ Server running on port ${PORT}`)
);

