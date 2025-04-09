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
        setFormData({ ...formData, avatar: reader.result }); // Lưu base64 vào state
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
      const response = await fetch(`http://localhost:5000/api/users/update/${user._id}`, {
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
    <div className="max-w-3xl mx-auto p-8 bg-gradient-to-r from-pink-400 to-orange-400 shadow-2xl rounded-2xl mt-10 border border-gray-200 text-white">
      <h1 className="text-4xl font-extrabold mb-6 text-center">Chỉnh sửa thông tin</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex justify-center">
          <div className="relative">
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="avatar-upload" />
            <label htmlFor="avatar-upload" className="cursor-pointer">
              <img 
                src={formData.avatar || "https://via.placeholder.com/150"} 
                alt="Avatar" 
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg transform hover:scale-105 transition-transform duration-300"
              />
            </label>
          </div>
        </div>
        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Họ và tên" className="w-full p-3 rounded-lg text-gray-900" required />
        <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Địa chỉ" className="w-full p-3 rounded-lg text-gray-900" />
        <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Số điện thoại" className="w-full p-3 rounded-lg text-gray-900" />
        <button type="submit" className="w-full bg-yellow-400 text-gray-900 py-3 rounded-lg font-bold hover:bg-yellow-300 transform hover:scale-105 transition-all duration-300">Lưu thay đổi</button>
      </form>
      <Link to="/profile" className="block mt-4 text-center text-white hover:underline">⬅️ Quay lại hồ sơ</Link>
    </div>
  );
};

export default EditProfile;
