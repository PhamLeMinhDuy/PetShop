import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AuthenticationPage.css";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/password/forgot-password`, { email });
      setSent(true);
    } catch (err) {
      alert(err.response?.data?.message || "Lỗi khi gửi email!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container flex flex-col items-center justify-center min-h-screen bg-orange-50 px-4">
      <h2 className="text-3xl font-bold text-orange-500 mb-4">🔐 Quên mật khẩu</h2>

      {sent ? (
        <div className="text-center bg-white/60 backdrop-blur-md p-6 shadow-2xl rounded-xl border border-orange-300 w-full max-w-md">
          <p className="text-green-600 font-medium mb-4">
            ✔️ Email khôi phục đã được gửi.<br />Hãy kiểm tra hộp thư của bạn!
          </p>
          <button
            onClick={() => navigate("/auth")}
            className="mt-4 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg font-semibold transition duration-300"
          >
            ← Quay lại đăng nhập
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white/60 backdrop-blur-md p-6 shadow-2xl rounded-xl border border-orange-300"
        >
          <label className="block mb-2 font-medium">Nhập email đã đăng ký:</label>
          <input
            type="email"
            className="w-full p-3 mb-4 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold transition duration-300"
          >
            {loading ? "Đang gửi..." : "Gửi email khôi phục"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/auth")}
            className="mt-3 text-sm  hover:underline block text-center"
          >
            ← Quay lại đăng nhập
          </button>
        </form>
      )}
    </div>
  );
};

export default ForgotPasswordPage;
