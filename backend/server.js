import express from "express";
import Razorpay from "razorpay";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// ✅ Middlewares
app.use(
  cors({
    origin: ["http://localhost:5173"], // your frontend URL
    methods: ["GET", "POST"],
  })
);
app.use(express.json());

// ✅ Initialize Razorpay with test credentials
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ✅ Health check route
app.get("/", (req, res) => {
  res.send("AuroraCine Razorpay backend is live ✅");
});

// ✅ Create Razorpay Order
app.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid payment amount" });
    }

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Convert to paise
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    });

    console.log("✅ Razorpay Order Created:", order.id);
    res.status(201).json(order);
  } catch (err) {
    console.error("❌ Razorpay order error:", err);
    res
      .status(500)
      .json({ error: "Failed to create Razorpay order", details: err.message });
  }
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);
