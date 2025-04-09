import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 text-center">
      <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
      <h2 className="text-2xl md:text-3xl font-semibold mb-2">Oops! Trang không tồn tại.</h2>
      <p className="text-gray-600 mb-6">Trang bạn đang tìm kiếm có thể đã bị xóa hoặc không tồn tại.</p>
      <Link
        to="/"
        className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition"
      >
        Quay về trang chủ
      </Link>
    </div>
  );
};

export default NotFoundPage;
