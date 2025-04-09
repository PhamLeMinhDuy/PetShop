import { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../context/AuthContext";

const UserProfile = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return (
      <p className="text-center text-lg mt-10">
        Bạn chưa đăng nhập.{" "}
        <Link to="/auth" className="text-blue-500 hover:underline">
          Đăng nhập
        </Link>
      </p>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 mt-10 rounded-2xl shadow-2xl bg-gradient-to-r from-pink-400 to-orange-400 border border-gray-200 text-neutral-100">
      <h1 className="text-3xl sm:text-4xl font-extrabold mb-6 text-center">
        Thông tin tài khoản
      </h1>

      <div className="flex flex-col items-center gap-6">
        <img
          src={user.avatar || "https://via.placeholder.com/150"}
          alt="Avatar"
          className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover hover:scale-105 transition-transform duration-300"
        />

        <div className="w-full grid sm:grid-cols-2 gap-4 bg-white/20 p-6 rounded-xl backdrop-blur-sm">
          <div className="text-lg">
            <strong>👤 Họ và tên:</strong>
            <p>{user.name}</p>
          </div>
          <div className="text-lg">
            <strong>📧 Email:</strong>
            <p>{user.email}</p>
          </div>
          <div className="text-lg">
            <strong>📍 Địa chỉ:</strong>
            <p>{user.address || "Chưa cập nhật"}</p>
          </div>
          <div className="text-lg">
            <strong>📞 Số điện thoại:</strong>
            <p>{user.phone || "Chưa cập nhật"}</p>
          </div>
        </div>

        <Link
          to="/profile/edit"
          className="mt-6 bg-yellow-400 text-gray-900 text-center px-6 py-3 rounded-lg font-bold hover:bg-yellow-300 transform hover:scale-105 transition-all duration-300"
        >
          ✏️ Chỉnh sửa thông tin
        </Link>
      </div>
    </div>
  );
};

export default UserProfile;
