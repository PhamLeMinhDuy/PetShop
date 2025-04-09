const express = require("express");
const Order = require("../models/Order");
const User = require("../models/User");
const Pet = require("../models/Pet"); 
const router = express.Router();

// 📌 API lấy danh sách đơn hàng của user
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Kiểm tra user có tồn tại không
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "❌ Người dùng không tồn tại!" });

    // Tìm danh sách đơn hàng của user
    const orders = await Order.find({ userId }).sort({ createdAt: -1 }); // Sắp xếp mới nhất trước

    res.json({ orders });
  } catch (error) {
    console.error("❌ Lỗi server:", error);
    res.status(500).json({ message: "Lỗi server, vui lòng thử lại!" });
  }
});


// 📌 API thêm đơn hàng
router.post("/add", async (req, res) => {
  try {
    const { userId, items } = req.body;

    // Kiểm tra user có tồn tại không
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "❌ Người dùng không tồn tại!" });

    // Lấy dữ liệu thú cưng để có hình ảnh
    const updatedItems = await Promise.all(
      items.map(async (item) => {
        const pet = await Pet.findById(item.petId);
        return {
          ...item,
          image: pet ? pet.image : "", // 🖼️ Thêm hình ảnh nếu có
        };
      })
    );

    // Tính tổng tiền
    const totalPrice = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Tạo đơn hàng mới
    const newOrder = new Order({ userId, items: updatedItems, totalPrice });
    await newOrder.save();

    // Thêm order vào User
    user.orderHistory.push(newOrder._id);
    await user.save();

    res.json({ message: "✅ Đã thêm đơn hàng!", order: newOrder });
  } catch (error) {
    console.error("❌ Lỗi server:", error);
    res.status(500).json({ message: "Lỗi server, vui lòng thử lại!" });
  }
});

// ❌ API xoá đơn hàng (removeOrder)
router.delete("/remove/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;

    // Tìm đơn hàng
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "❌ Đơn hàng không tồn tại!" });

    // Xóa order khỏi User
    await User.findByIdAndUpdate(order.userId, { $pull: { orderHistory: orderId } });

    // Xóa order khỏi DB
    await Order.findByIdAndDelete(orderId);

    res.json({ message: "✅ Đơn hàng đã được xóa!" });
  } catch (error) {
    console.error("❌ Lỗi server:", error);
    res.status(500).json({ message: "Lỗi server, vui lòng thử lại!" });
  }
});

// routes/order.js
router.put("/pay/:orderId", async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng" });

    order.status = "paid";
    await order.save();

    res.json({ message: "Thanh toán thành công!" });
  } catch (error) {
    console.error("Lỗi thanh toán:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
});

// ✅ Thanh toán nhiều đơn hàng (giả lập)
router.put("/pay", async (req, res) => {
  const { orderIds } = req.body;

  if (!Array.isArray(orderIds)) {
    return res.status(400).json({ message: "Dữ liệu không hợp lệ!" });
  }

  try {
    // Giả lập thời gian xử lý thanh toán
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Cập nhật trạng thái cho từng đơn hàng
    await Promise.all(
      orderIds.map(async (id) => {
        await Order.findByIdAndUpdate(id, {
          status: "paid",
          paidAt: new Date(),
        });
      })
    );

    res.json({ message: "Thanh toán thành công!" });
  } catch (error) {
    console.error("Lỗi thanh toán:", error);
    res.status(500).json({ message: "Có lỗi xảy ra khi thanh toán." });
  }
});


module.exports = router;
