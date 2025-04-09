import { useState, useContext } from "react";
import AuthContext from "../../context/AuthContext";
import { registerUser, loginUser } from "../../../api/auth"; 
import { useNavigate } from "react-router-dom";
import "./AuthenticationPage.css";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ email: "", password: "", confirmPassword: "" });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const userData = await loginUser({ email: form.email, password: form.password });
        localStorage.setItem("token", userData.token);
        login(userData);
        alert("Đăng nhập thành công!");
        navigate("/");
      } else {
        if (form.password !== form.confirmPassword) {
          alert("Mật khẩu nhập lại không khớp!");
          return;
        }

        const userData = await registerUser({ email: form.email, password: form.password });
        const name = form.email.split("@")[0];
        const finalUserData = { ...userData, name, role: "user" };
        login(finalUserData);
        alert("Đăng ký thành công!");
        setIsLogin(true);
      }
    } catch (error) {
      alert(error.message || "Có lỗi xảy ra!");
    }
  };

  return (
    <div className="auth-container flex flex-col items-center justify-center min-h-screen px-4 bg-orange-50">
      <h2 className="text-3xl sm:text-4xl font-bold text-orange-500 drop-shadow-lg text-center">
        {isLogin ? "🐾 Đăng nhập" : "🐾 Đăng ký"}
      </h2>

      <form
        className="w-full max-w-md bg-white/50 backdrop-blur-md p-6 shadow-2xl rounded-xl border border-orange-300 mt-6"
        onSubmit={handleSubmit}
      >
        <div className="mb-4">
          <label className="block font-medium text-sm sm:text-base">Email:</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-3 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium text-sm sm:text-base">Mật khẩu:</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-3 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            required
          />
        </div>

        {!isLogin && (
          <div className="mb-4">
            <label className="block font-medium text-sm sm:text-base">Nhập lại mật khẩu:</label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full p-3 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              required
            />
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold transition duration-300"
        >
          {isLogin ? "🐶 Đăng nhập" : "🐱 Đăng ký"}
        </button>
      </form>

      <p className="mt-4 font-medium text-sm sm:text-base text-center">
        {isLogin ? "Chưa có tài khoản?" : "Đã có tài khoản?"}{" "}
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-orange-600 font-bold hover:underline"
        >
          {isLogin ? "Đăng ký ngay" : "Đăng nhập"}
        </button>
      </p>
    </div>
  );
};

export default AuthPage;
