const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true }, // 📞 Số điện thoại
    address: { type: String, required: true }, // 📍 Địa chỉ giao hàng
    avatar: { type: String, default: "" }, // 🖼 Ảnh đại diện dạng base64
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }], // ❤️ Sản phẩm yêu thích
    orderHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }], // 📦 Lịch sử đơn hàng
    role: { type: String, enum: ["user", "admin"], default: "user" }, // ✅ Mặc định "user"
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
