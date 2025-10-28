import express from "express";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

router.post("/stkpush", async (req, res) => {
  const { phone, amount } = req.body;

  try {
    // Step 1: Get Access Token
    const tokenResponse = await axios.get(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        auth: {
          username: process.env.MPESA_CONSUMER_KEY,
          password: process.env.MPESA_CONSUMER_SECRET,
        },
      }
    );

    const accessToken = tokenResponse.data.access_token;

    // Step 2: STK Push
    const stkResponse = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        BusinessShortCode: process.env.MPESA_SHORTCODE,
        Password: process.env.MPESA_PASSWORD,
        Timestamp: process.env.MPESA_TIMESTAMP,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: phone,
        PartyB: process.env.MPESA_SHORTCODE,
        PhoneNumber: phone,
        CallBackURL: "https://cityproshub.co.ke/api/mpesa/callback",
        AccountReference: "CityProsHub",
        TransactionDesc: "Featured Listing Payment",
      },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    res.json(stkResponse.data);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ message: "M-Pesa payment failed" });
  }
});

export default router;
