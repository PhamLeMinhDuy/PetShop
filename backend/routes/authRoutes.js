const express = require("express");
const { register, login, updateProfile } = require("../controllers/authController");
const { authMiddleware } = require("../middleware/authMiddleware"); // ✅ Import đúng cách

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.put("/update-profile", authMiddleware, updateProfile); // ✅ Không còn bị lỗi object

module.exports = router;
