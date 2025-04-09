const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
const Order = require("../models/Order");
const User = require("../models/User");

router.post("/", async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    console.log("✅ Webhook nhận được:", event.type);
  } catch (err) {
    console.error("❌ Webhook Signature Error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    console.log("✅ Đã thanh toán thành công:", session);

    const orderIds = session.metadata.order_ids.split(',');
    const userId = session.client_reference_id;

    try {
      // ✅ Cập nhật trạng thái đơn hàng thành "completed"
      await Order.updateMany(
        { _id: { $in: orderIds } },
        { $set: { status: "completed" } }
      );

      // ✅ Thêm các orderId vào orderHistory của User
      const user = await User.findById(userId);
      if (user) {
        user.orderHistory.push(...orderIds);
        await user.save();
      }
    } catch (error) {
      console.error("❌ Lỗi xử lý cập nhật đơn hàng và lịch sử user:", error);
    }
  }

  res.status(200).send("Webhook received");
});

module.exports = router;
