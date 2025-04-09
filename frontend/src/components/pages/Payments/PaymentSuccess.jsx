import { Link } from "react-router-dom";

const PaymentSuccess = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 px-4">
      <div className="bg-white p-6 sm:p-10 rounded-xl shadow-lg text-center max-w-md w-full">
        <h1 className="text-3xl sm:text-4xl font-bold text-green-600 mb-4">🎉 Thanh toán thành công!</h1>
        <p className="text-gray-700 text-base sm:text-lg mb-6">Cảm ơn bạn đã mua hàng tại Pet Shop! 🐶</p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Về trang chủ
          </Link>
          <Link
            to="/orders"
            className="border border-green-600 text-green-700 px-6 py-2 rounded-lg hover:bg-green-100 transition"
          >
            Xem đơn hàng
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
