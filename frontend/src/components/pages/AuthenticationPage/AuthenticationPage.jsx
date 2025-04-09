import { useState, useContext } from "react";
import AuthContext from "../../context/AuthContext"; // Import context
import { registerUser, loginUser } from "../../../api/auth"; 
import {useNavigate} from "react-router-dom";
import "./AuthenticationPage.css"; 

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ email: "", password: "", confirmPassword: "" });
  const { login } = useContext(AuthContext); // 👉 Lấy hàm login từ Context
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        // 🟢 Đăng nhập
        const userData = await loginUser({ email: form.email, password: form.password });
        localStorage.setItem("token", userData.token); // Lưu token vào localStorage
        login(userData); // 👉 Cập nhật user vào Context
        alert("Đăng nhập thành công!");
        navigate("/")
      } else {
        // 🔴 Kiểm tra mật khẩu khớp
        if (form.password !== form.confirmPassword) {
          alert("Mật khẩu nhập lại không khớp!");
          return;
        }

        // 🟠 Đăng ký
        const userData = await registerUser({ email: form.email, password: form.password });

        // 🌟 Tạo name mặc định từ email (lấy phần trước @)
        const name = form.email.split("@")[0];

        // Cập nhật user sau khi đăng ký
        const finalUserData = { ...userData, name, role: "user" };
        login(finalUserData); // 👉 Cập nhật user vào Context

        alert("Đăng ký thành công!");
        setIsLogin(true); 
      }
    } catch (error) {
      alert(error.message || "Có lỗi xảy ra!");
    }
  };

  return (
    <div className="auth-container flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-3xl font-bold text-orange-400 drop-shadow-lg">
        {isLogin ? "🐾 Đăng nhập" : "🐾 Đăng ký"}
      </h2>

      <form className="w-[400px] bg-white/40 p-6 shadow-2xl rounded-2xl border border-orange-300 mt-6" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block font-medium">Email:</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} className="w-full p-3 border border-orange-300 rounded-lg" required />
        </div>

        <div className="mb-4">
          <label className="block font-medium">Mật khẩu:</label>
          <input type="password" name="password" value={form.password} onChange={handleChange} className="w-full p-3 border border-orange-300 rounded-lg" required />
        </div>

        {!isLogin && (
          <div className="mb-4">
            <label className="block font-medium">Nhập lại mật khẩu:</label>
            <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} className="w-full p-3 border border-orange-300 rounded-lg" required />
          </div>
        )}

        <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold transition duration-300">
          {isLogin ? "🐶 Đăng nhập" : "🐱 Đăng ký"}
        </button>
      </form>

      <p className="mt-4 font-medium">
        {isLogin ? "Chưa có tài khoản?" : "Đã có tài khoản?"}{" "}
        <button onClick={() => setIsLogin(!isLogin)} className="text-orange-600 font-bold hover:underline">
          {isLogin ? "Đăng ký ngay" : "Đăng nhập"}
        </button>
      </p>
    </div>
  );
};

export default AuthPage;
