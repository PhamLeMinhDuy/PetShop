import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./AuthenticationPage.css"; // Dùng chung CSS với trang quên mật khẩu

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isValidToken, setIsValidToken] = useState(true);
  const { token } = useParams();
  const navigate = useNavigate();

  // Kiểm tra token có hợp lệ không
  useEffect(() => {
    const validateToken = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/password/validate-token/${token}`);
        
        if (!response.data.valid) {
          setIsValidToken(false);
          setMessage("Đường dẫn đặt lại mật khẩu không hợp lệ hoặc đã hết hạn!");
        }
      } catch (err) {
        setIsValidToken(false);
        setMessage(err.response?.data?.message || "Đường dẫn đặt lại mật khẩu không hợp lệ!");
      }
    };

    validateToken();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Kiểm tra mật khẩu
    if (password !== confirmPassword) {
      setMessage("Mật khẩu xác nhận không khớp!");
      return;
    }

    if (password.length < 6) {
      setMessage("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/password/reset-password/${token}`, {
        newPassword: password
      });
      
      setIsSuccess(true);
      setMessage("Đặt lại mật khẩu thành công!");
    } catch (err) {
      setMessage(err.response?.data?.message || "Lỗi khi đặt lại mật khẩu!");
    } finally {
      setLoading(false);
    }
  };

  if (!isValidToken) {
    return (
      <div className="auth-container flex flex-col items-center justify-center min-h-screen bg-orange-50 px-4">
        <h2 className="text-3xl font-bold text-orange-500 mb-4">🔐 Đặt lại mật khẩu</h2>
        <div className="text-center bg-white/60 backdrop-blur-md p-6 shadow-2xl rounded-xl border border-orange-300 w-full max-w-md">
          <p className="text-red-600 font-medium mb-4">
            ❌ {message}
          </p>
          <button
            onClick={() => navigate("/auth")}
            className="mt-4 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg font-semibold transition duration-300"
          >
            ← Quay lại đăng nhập
          </button>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="auth-container flex flex-col items-center justify-center min-h-screen bg-orange-50 px-4">
        <h2 className="text-3xl font-bold text-orange-500 mb-4">🔐 Đặt lại mật khẩu</h2>
        <div className="text-center bg-white/60 backdrop-blur-md p-6 shadow-2xl rounded-xl border border-orange-300 w-full max-w-md">
          <p className="text-green-600 font-medium mb-4">
            ✅ {message}
          </p>
          <button
            onClick={() => navigate("/auth")}
            className="mt-4 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg font-semibold transition duration-300"
          >
            Đăng nhập ngay
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container flex flex-col items-center justify-center min-h-screen bg-orange-50 px-4">
      <h2 className="text-3xl font-bold text-orange-500 mb-4">🔐 Đặt lại mật khẩu</h2>
      
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white/60 backdrop-blur-md p-6 shadow-2xl rounded-xl border border-orange-300"
      >
        {message && (
          <div className={`p-3 mb-4 rounded-lg ${isSuccess ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message}
          </div>
        )}

        <div className="mb-4">
          <label className="block mb-2 font-medium">Mật khẩu mới</label>
          <input
            type="password"
            className="w-full p-3 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-medium">Xác nhận mật khẩu mới</label>
          <input
            type="password"
            className="w-full p-3 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold transition duration-300"
        >
          {loading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
        </button>
        
        <button
          type="button"
          onClick={() => navigate("/auth")}
          className="mt-3 text-sm hover:underline block text-center"
        >
          ← Quay lại đăng nhập
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;