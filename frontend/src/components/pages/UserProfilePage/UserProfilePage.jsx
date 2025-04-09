import { useContext } from "react";
import AuthContext from "../../context/AuthContext";
import { Link } from "react-router-dom";

const UserProfile = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <p className="text-center text-lg mt-10">Bạn chưa đăng nhập. <Link to="/auth" className="text-blue-500 hover:underline">Đăng nhập</Link></p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-8 bg-gradient-to-r from-pink-400 to-orange-400 shadow-2xl rounded-2xl mt-10 border border-gray-200 text-white">
      <h1 className="text-4xl font-extrabold mb-6 text-center">Thông tin tài khoản</h1>
      <div className="flex flex-col items-center space-y-6">
        <img src={user.avatar} alt="Avatar" className="w-32 h-32 rounded-full border-4 border-white shadow-lg transform hover:scale-105 transition-transform duration-300" />
        <div className="w-full space-y-3">
          <p className="text-lg"><strong>👤 Họ và tên:</strong> {user.name}</p>
          <p className="text-lg"><strong>📧 Email:</strong> {user.email}</p>
          <p className="text-lg"><strong>📍 Địa chỉ:</strong> {user.address || "Chưa cập nhật"}</p>
          <p className="text-lg"><strong>📞 Số điện thoại:</strong> {user.phone || "Chưa cập nhật"}</p>
        </div>
      </div>
      <Link to="/profile/edit" className="block mt-6 bg-yellow-400 text-gray-900 text-center py-3 rounded-lg font-bold hover:bg-yellow-300 transform hover:scale-105 transition-all duration-300">
        ✏️ Chỉnh sửa thông tin
      </Link>
    </div>
  );
};

export default UserProfile;