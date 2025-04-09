const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
      const { email, password } = req.body;

      let user = await User.findOne({ email });
      if (user) return res.status(400).json({ message: "Email đã tồn tại" });

      // ✅ Tự động lấy name từ email (trước @)
      const name = email.split("@")[0];

      // ✅ Mặc định role là "user"
      const role = "user";

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      user = new User({ name, email, password: hashedPassword, role });
      await user.save();

      res.status(201).json({ message: "Tạo tài khoản thành công", user });
  } catch (error) {
      res.status(500).json({ message: "Lỗi server" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Email không đúng" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Mật khẩu không đúng" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // ✅ Trả về đầy đủ thông tin user (trừ password)
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        avatar: user.avatar || "", // 🖼️ Avatar (base64 hoặc "")
        wishlist: user.wishlist, // ❤️ Danh sách yêu thích
        orderHistory: user.orderHistory, // 📦 Lịch sử đơn hàng
        role: user.role, // 👤 Vai trò
        createdAt: user.createdAt, // 📅 Ngày tạo tài khoản
        updatedAt: user.updatedAt, // 🕒 Ngày cập nhật gần nhất
      }
    });    
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};


exports.updateProfile = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userId = req.user.id; // 🔥 Sửa lại đúng ID từ middleware

    let user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Người dùng không tồn tại" });

    // ✅ Cập nhật thông tin nếu có dữ liệu mới
    if (name) user.name = name;
    if (email) user.email = email;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    // ✅ Cập nhật avatar nếu có file ảnh mới
    if (req.file) {
      user.avatar = `data:image/png;base64,${req.file.buffer.toString("base64")}`;
    }

    await user.save();
    
    res.json({ 
      message: "Cập nhật thành công", 
      user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar } 
    });

  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

