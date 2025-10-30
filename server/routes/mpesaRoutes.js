// src/routes/mpesaRoutes.js
import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import Provider from "../models/Provider.js";

dotenv.config();
const router = express.Router();

// Generate Access Token (already working)
const getAccessToken = async () => {
  const { data } = await axios.get(
    "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
    {
      auth: {
        username: process.env.MPESA_CONSUMER_KEY,
        password: process.env.MPESA_CONSUMER_SECRET,
      },
    }
  );
  return data.access_token;
};

// 🔹 STK Push
router.post("/stkpush", async (req, res) => {
  try {
    const { phone, amount, providerId } = req.body;
    const token = await getAccessToken();

    const timestamp = new Date()
      .toISOString()
      .replace(/[-T:.Z]/g, "")
      .slice(0, 14);

    const password = Buffer.from(
      `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
    ).toString("base64");

    await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        BusinessShortCode: process.env.MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: phone,
        PartyB: process.env.MPESA_SHORTCODE,
        PhoneNumber: phone,
        CallBackURL: `${process.env.BASE_URL}/api/mpesa/callback`,
        AccountReference: providerId,
        TransactionDesc: "Feature Listing Payment",
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    res.json({ message: "📲 Payment request sent, check your phone." });
  } catch (err) {
    console.error("STK Error:", err.response?.data || err.message);
    res.status(500).json({ error: "Payment initiation failed" });
  }
});

// 🔹 Payment Callback (Safaricom posts here)
router.post("/callback", async (req, res) => {
  try {
    const { Body } = req.body;
    const result = Body?.stkCallback;

    if (result?.ResultCode === 0) {
      const providerId = result.CallbackMetadata?.Item?.find(
        (i) => i.Name === "AccountReference"
      )?.Value;

      if (providerId) {
        await Provider.findByIdAndUpdate(providerId, { featured: true });
        console.log(`✅ Provider ${providerId} marked as FEATURED.`);
      }
    } else {
      console.log("❌ Payment not completed.");
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Callback Error:", err.message);
    res.status(500).json({ error: "Callback processing failed" });
  }
});

export default router;
