import React from "react";

const ContactPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 bg-gradient-to-r from-yellow-100 to-orange-200 rounded-lg shadow-xl">
      <h1 className="text-4xl font-bold text-center text-orange-700 mb-8">📞 Liên hệ Pet Shop</h1>
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-6 text-orange-600 border-b-2 pb-2">Thông tin liên hệ</h2>
        <div className="space-y-4 text-lg">
          <p className="flex items-center gap-2"><span className="text-2xl">📍</span> <strong>Địa chỉ:</strong> 123 Đường ABC, Quận 1, TP.HCM</p>
          <p className="flex items-center gap-2"><span className="text-2xl">📞</span> <strong>Điện thoại:</strong> 0123 456 789</p>
          <p className="flex items-center gap-2"><span className="text-2xl">✉️</span> <strong>Email:</strong> contact@petshop.com</p>
          <p className="flex items-center gap-2"><span className="text-2xl">⏰</span> <strong>Giờ mở cửa:</strong> 08:00 - 21:00 (Tất cả các ngày trong tuần)</p>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;