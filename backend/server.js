const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");  
const petRoutes = require("./routes/petRoutes");
const userRoutes = require("./routes/userRoutes")
const orderRoutes = require("./routes/orderRoutes");
const checkoutRoutes = require('./routes/checkoutRoutes');
const webhookRoute = require("./routes/webhook");

dotenv.config();
connectDB();

const app = express();

// ❗️ Bước 1: Middleware cho CORS (OK)
app.use(cors());

// ❗️ Bước 2: Webhook cần đặt TRƯỚC express.json() để giữ raw body
app.use("/api/webhook", express.raw({ type: 'application/json' }), webhookRoute);

// ❗️ Bước 3: Tất cả route khác mới dùng express.json()
app.use(express.json());

// ❗️ Bước 4: Các route còn lại
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes); 
app.use("/api/pets", petRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/orders", checkoutRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server chạy trên port ${PORT}`));
