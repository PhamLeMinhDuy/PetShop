  const express = require("express");
  const multer = require("multer");
  const User = require("../models/User");

  const router = express.Router();

  // Cấu hình Multer để upload ảnh
  const storage = multer.memoryStorage();
  const upload = multer({ storage: storage });

  // ✅ API cập nhật user
  router.put("/update/:id", upload.single("avatar"), async (req, res) => {
    try {
      const { id } = req.params;  // Lấy id từ URL
      const { name, address, phone } = req.body;

      // Kiểm tra user có tồn tại không
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: "Người dùng không tồn tại!" });
      }

      // Nếu có avatar, chuyển đổi sang base64
      let avatar = req.file ? `data:image/png;base64,${req.file.buffer.toString("base64")}` : user.avatar;

      // Cập nhật user
      user.name = name || user.name;
      user.address = address || user.address;
      user.phone = phone || user.phone;
      user.avatar = avatar;

      await user.save();
      res.json(user);
    } catch (error) {
      console.error("❌ Lỗi server:", error); 
      res.status(500).json({ message: "Lỗi server", error });
    }
  });
  // POST /api/users/wishlist/add
router.post("/wishlist/add", async (req, res) => {
  const { userId, petId } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Người dùng không tồn tại" });

    if (!user.wishlist.includes(petId)) {
      user.wishlist.push(petId);
      await user.save();
    }

    res.json({ message: "Đã thêm vào danh sách yêu thích!" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err });
  }
});

  

  module.exports = router;
