import { useContext, useState, useEffect } from "react";
import AuthContext from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const EditProfile = () => {
  const { user, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: user?.name || "",
    address: user?.address || "",
    phone: user?.phone || "",
    avatar: user?.avatar || "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        address: user.address || "",
        phone: user.phone || "",
        avatar: user.avatar || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?._id) {
      console.error("❌ Lỗi: Không tìm thấy ID người dùng!");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("address", formData.address);
    formDataToSend.append("phone", formData.phone);

    if (formData.avatar.startsWith("data:image")) {
      const blob = await fetch(formData.avatar).then((res) => res.blob());
      formDataToSend.append("avatar", blob, "avatar.jpg");
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/update/${user._id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Lỗi cập nhật: ${errorText}`);
      }

      const updatedUser = await response.json();
      updateUser(updatedUser);
      navigate("/profile");
    } catch (error) {
      console.error("❌ Lỗi server:", error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 bg-gradient-to-br from-pink-400 to-orange-400 shadow-xl rounded-2xl mt-10 border border-white/20 text-white">
      <h1 className="text-3xl sm:text-4xl font-extrabold mb-6 text-center">Chỉnh sửa thông tin</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex justify-center">
          <div className="relative group">
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="avatar-upload" />
            <label htmlFor="avatar-upload" className="cursor-pointer">
              <img 
                src={formData.avatar || "https://via.placeholder.com/150"} 
                alt="Avatar" 
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-lg object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                📷
              </div>
            </label>
          </div>
        </div>

        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Họ và tên"
          className="w-full p-3 rounded-lg text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-300 shadow-sm"
          required
        />
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Địa chỉ"
          className="w-full p-3 rounded-lg text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-300 shadow-sm"
        />
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Số điện thoại"
          className="w-full p-3 rounded-lg text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-300 shadow-sm"
        />

        <button
          type="submit"
          className="w-full bg-yellow-400 text-gray-900 py-3 rounded-lg font-bold shadow-md hover:bg-yellow-300 transform hover:scale-105 transition-all duration-300"
        >
          💾 Lưu thay đổi
        </button>
      </form>
      <Link to="/profile" className="block mt-6 text-center text-white hover:underline hover:text-yellow-200 transition">
        ⬅️ Quay lại hồ sơ
      </Link>
    </div>
  );
};

export default EditProfile;
