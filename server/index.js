import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import providerRoutes from "./routes/providers.js";
import adminRoutes from "./routes/adminRoutes.js";
import mpesaRoutes from "./routes/mpesaRoutes.js";``
dotenv.config();
const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/providers", providerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/mpesa", mpesaRoutes);

app.get("/", (req, res) => res.send("🌍 CityProsHub API Running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
