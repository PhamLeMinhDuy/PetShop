const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
require('dotenv').config();

// Cấu hình Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  debug: true
});

// POST /api/password/forgot-password
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Email là bắt buộc!" });

  try {
    // Kiểm tra xem email có tồn tại trong hệ thống không
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email này chưa đăng ký trong hệ thống!" });
    }

    // Tạo token ngẫu nhiên và thời hạn (1 giờ)
    const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const resetTokenExpires = Date.now() + 3600000; // 1 giờ tính từ bây giờ

    // Lưu token và thời hạn vào database
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpires;
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    // Gửi email
    await transporter.sendMail({
      from: `🐾 PetShop Support <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Khôi phục mật khẩu - PetShop",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #f0f0f0; border-radius: 10px;">
          <h2 style="color: #f97316; text-align: center;">🐾 PetShop - Khôi phục mật khẩu</h2>
          <p>Xin chào,</p>
          <p>Bạn đã yêu cầu khôi phục mật khẩu cho tài khoản tại PetShop. Vui lòng click vào nút dưới đây để đặt lại mật khẩu:</p>
          <div style="text-align: center; margin: 25px 0;">
            <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #f97316; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">Đặt lại mật khẩu</a>
          </div>
          <p>Đường dẫn này sẽ hết hạn sau 1 giờ.</p>
          <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
          <p style="margin-top: 25px; border-top: 1px solid #f0f0f0; padding-top: 15px;">Trân trọng,<br/>PetShop Team 🐶</p>
        </div>
      `,
    });

    res.json({ message: "Email đặt lại mật khẩu đã được gửi!" });
  } catch (err) {
    console.error("Lỗi khi xử lý yêu cầu quên mật khẩu:", err);
    res.status(500).json({ message: "Không thể gửi email khôi phục!" });
  }
});

// GET /api/password/validate-token/:token
router.get("/validate-token/:token", async (req, res) => {
  const { token } = req.params;
  
  try {
    // Kiểm tra token có tồn tại và còn hạn không
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ valid: false, message: "Token không hợp lệ hoặc đã hết hạn!" });
    }

    res.json({ valid: true });
  } catch (err) {
    console.error("Lỗi khi xác thực token:", err);
    res.status(500).json({ valid: false, message: "Lỗi khi xác thực token!" });
  }
});

// POST /api/password/reset-password/:token
router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ message: "Mật khẩu mới phải có ít nhất 6 ký tự!" });
  }

  try {
    // Tìm người dùng với token hợp lệ và chưa hết hạn
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() } // Kiểm tra token còn hạn
    });

    if (!user) {
      return res.status(400).json({ message: "Token không hợp lệ hoặc đã hết hạn!" });
    }

    // Hash mật khẩu mới
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Cập nhật mật khẩu và xóa thông tin token
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    // Gửi email thông báo đã thay đổi mật khẩu thành công
    await transporter.sendMail({
      from: `🐾 PetShop Support <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Thay đổi mật khẩu thành công - PetShop",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #f0f0f0; border-radius: 10px;">
          <h2 style="color: #f97316; text-align: center;">🐾 PetShop - Thông báo</h2>
          <p>Xin chào,</p>
          <p>Mật khẩu của bạn đã được thay đổi thành công!</p>
          <p>Nếu bạn không thực hiện thay đổi này, vui lòng liên hệ với chúng tôi ngay lập tức.</p>
          <p style="margin-top: 25px; border-top: 1px solid #f0f0f0; padding-top: 15px;">Trân trọng,<br/>PetShop Team 🐶</p>
        </div>
      `,
    });

    res.json({ message: "Mật khẩu đã được thay đổi thành công!" });
  } catch (err) {
    console.error("Lỗi khi đặt lại mật khẩu:", err);
    res.status(500).json({ message: "Lỗi khi thay đổi mật khẩu!" });
  }
});

module.exports = router;