const express = require("express");
const Pet = require("../models/Pet");
const router = express.Router();

// 🐾 Lấy tất cả thú cưng
router.get("/", async (req, res) => {
  try {
    const pets = await Pet.find();
    res.json(pets);
  } catch (err) {
    res.status(500).json({ error: "Lỗi server" });
  }
});

// 🔍 Lấy thú cưng theo loại (dog, cat, bird...)
router.get("/type/:type", async (req, res) => {
  try {
    const pets = await Pet.find({ type: req.params.type });
    res.json(pets);
  } catch (err) {
    res.status(500).json({ error: "Lỗi server" });
  }
});

// 📌 Lấy thú cưng theo ID
router.get("/:id", async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) return res.status(404).json({ error: "Không tìm thấy thú cưng" });
    res.json(pet);
  } catch (err) {
    res.status(500).json({ error: "Lỗi server" });
  }
});

// ➕ Thêm thú cưng mới
router.post("/", async (req, res) => {
  try {
    const newPet = new Pet(req.body);
    await newPet.save();
    res.status(201).json(newPet);
  } catch (err) {
    res.status(500).json({ error: "Lỗi khi thêm thú cưng" });
  }
});

// ✏️ Cập nhật thú cưng
router.put("/:id", async (req, res) => {
  try {
    const updatedPet = await Pet.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedPet) return res.status(404).json({ error: "Không tìm thấy thú cưng" });
    res.json(updatedPet);
  } catch (err) {
    res.status(500).json({ error: "Lỗi server" });
  }
});

// ❌ Xóa thú cưng
router.delete("/:id", async (req, res) => {
  try {
    const deletedPet = await Pet.findByIdAndDelete(req.params.id);
    if (!deletedPet) return res.status(404).json({ error: "Không tìm thấy thú cưng" });
    res.json({ message: "Xóa thành công!" });
  } catch (err) {
    res.status(500).json({ error: "Lỗi server" });
  }
});

router.get("/api/pet/:id", async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) return res.status(404).json({ message: "Không tìm thấy thú cưng" });
    res.json(pet);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
});


module.exports = router;
