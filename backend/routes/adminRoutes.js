const express = require("express");
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");
const User = require("../models/User");

const router = express.Router();

// ✅ API chỉ admin mới có thể truy cập
router.get("/all-users", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server" });
    }
});

module.exports = router;
