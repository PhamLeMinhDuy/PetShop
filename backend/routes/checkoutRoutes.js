const express = require("express");
const router = express.Router();
require('dotenv').config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Order = require("../models/Order");

router.post("/create-checkout-session", async (req, res) => {
  try {
    const { orders, userId } = req.body; // Lấy orders và userId từ request

    // Kiểm tra nếu userId không có trong request body
    if (!userId) {
      return res.status(400).json({ error: "userId không được truyền" });
    }

    const line_items = orders.map((order) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: `Đơn hàng ${order._id}`,
        },
        unit_amount: Math.round(order.totalPrice * 100),
      },
      quantity: 1,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `http://localhost:3000/payment-success?session_id={CHECKOUT_SESSION_ID}&user_id=${userId}`, // Truyền userId vào success_url
      cancel_url: "http://localhost:3000/payment-cancel",
      client_reference_id: userId, // Thêm userId vào client_reference_id để có thể lấy từ Stripe webhook sau này
      metadata: {
        order_ids: orders.map(order => order._id).join(","), // Lưu danh sách order_ids
      }
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Lỗi tạo phiên thanh toán:", error);
    res.status(500).json({ error: "Lỗi tạo phiên thanh toán" });
  }
});

module.exports = router;
