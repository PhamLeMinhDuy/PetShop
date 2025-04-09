const mongoose = require("mongoose");

const PetSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // Tên thú cưng
    type: { type: String, required: true, enum: ["dog", "cat", "bird", "other"] }, // Loại thú cưng
    breed: { type: String, required: true }, // Giống thú cưng
    age: { type: Number, required: true }, // Tuổi
    color: { type: String, required: true }, // Màu sắc
    price: { type: Number, required: true }, // Giá bán
    image: { type: String, required: true }, // Link hình ảnh
    description: { type: String }, // Mô tả thú cưng
    available: { type: Boolean, default: true }, // Còn bán hay không
  },
  { timestamps: true } // Tự động thêm createdAt & updatedAt
);

const Pet = mongoose.model("Pet", PetSchema);

module.exports = Pet;
