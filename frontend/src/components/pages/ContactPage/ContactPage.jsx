import React from "react";
import { motion } from "framer-motion";

const ContactPage = () => {
  return (
    <motion.div
      className="max-w-4xl mx-auto px-6 py-12 bg-gradient-to-r from-yellow-100 to-orange-200 rounded-lg shadow-xl"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <h1 className="text-3xl sm:text-4xl font-bold text-center text-orange-700 mb-8">
        📞 Liên hệ Pet Shop
      </h1>

      <motion.div
        className="bg-white p-6 sm:p-8 rounded-lg shadow-lg"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-orange-600 border-b-2 pb-2">
          Thông tin liên hệ
        </h2>

        <div className="space-y-4 text-base sm:text-lg">
          <p className="flex items-start gap-2">
            <span className="text-2xl">📍</span>
            <span><strong>Địa chỉ:</strong> 123 Đường ABC, Quận 1, TP.HCM</span>
          </p>
          <p className="flex items-start gap-2">
            <span className="text-2xl">📞</span>
            <span><strong>Điện thoại:</strong> 0123 456 789</span>
          </p>
          <p className="flex items-start gap-2">
            <span className="text-2xl">✉️</span>
            <span><strong>Email:</strong> contact@petshop.com</span>
          </p>
          <p className="flex items-start gap-2">
            <span className="text-2xl">⏰</span>
            <span><strong>Giờ mở cửa:</strong> 08:00 - 21:00 (Tất cả các ngày trong tuần)</span>
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ContactPage;
