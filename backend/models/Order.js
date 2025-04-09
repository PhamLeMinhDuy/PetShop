const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        petId: { type: mongoose.Schema.Types.ObjectId, ref: "Pet", required: true },
        name: String,
        price: Number,
        quantity: { type: Number, default: 1 },
        image: String, // 🖼️ Thêm trường ảnh base64
      }
    ],
    totalPrice: { type: Number, required: true },
    status: { type: String, enum: ["pending", "completed", "cancelled"], default: "pending" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
