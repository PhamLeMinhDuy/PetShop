const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header("Authorization");
        if (!token) return res.status(401).json({ message: "Không có token, truy cập bị từ chối!" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.userId).select("-password");
        
        next();
    } catch (error) {
        res.status(401).json({ message: "Token không hợp lệ!" });
    }
};

// Middleware kiểm tra Admin
const adminMiddleware = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Truy cập bị từ chối, bạn không phải Admin!" });
    }
    next();
};

module.exports = { authMiddleware, adminMiddleware };
