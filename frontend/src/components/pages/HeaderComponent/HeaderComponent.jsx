import { Link } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import AuthContext from "../../context/AuthContext";
import logo from "../../../assets/images/logo.png";

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [pendingItemCount, setPendingItemCount] = useState(0);

  useEffect(() => {
    const fetchPendingCart = async () => {
      if (!user) return;

      try {
        const res = await fetch(`http://localhost:5000/api/orders/user/${user._id}`);
        const data = await res.json();

        // Lọc đơn hàng có trạng thái pending
        const pendingOrders = data.orders.filter((order) => order.status === "pending");

        // Tính tổng số sản phẩm trong các đơn pending
        const totalPendingItems = pendingOrders.reduce((sum, order) => {
          return sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0);
        }, 0);

        setPendingItemCount(totalPendingItems);
      } catch (error) {
        console.error("Lỗi khi lấy đơn hàng pending:", error);
      }
    };

    fetchPendingCart();
  }, [user]);

  return (
    <header className="bg-orange-500 text-white py-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center px-6">
        <Link to="/" className="text-2xl font-bold flex items-center gap-2">
          <img src={logo} alt="Pet Shop Logo" className="h-14" />
          Pet Shop
        </Link>

        <nav className="hidden md:flex space-x-6 text-lg font-medium">
          <Link to="/" className="hover:text-gray-300">🏠 Trang chủ</Link>

          <Link to="/cart" className="relative hover:text-gray-300">
            🛒 Giỏ hàng
            {pendingItemCount > 0 && (
              <span className="absolute -top-2 -right-4 bg-red-600 text-white text-sm px-2 py-0.5 rounded-full">
                {pendingItemCount}
              </span>
            )}
          </Link>

          <Link to="/contact" className="hover:text-gray-300">📞 Liên hệ</Link>
        </nav>

        {user ? (
          <div className="relative">
            <button 
              className="text-lg font-semibold flex items-center gap-2 hover:text-gray-300"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              {user.avatar ? (
                <img 
                  src={user.avatar.startsWith("data:image") ? user.avatar : `data:image/png;base64,${user.avatar}`} 
                  alt="Avatar" 
                  className="w-10 h-10 rounded-full border-2 border-white"
                />
              ) : (
                <>👤</>
              )}
              <span>{user.name}</span>
              ▼
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-black shadow-lg rounded-lg overflow-hidden z-50">
                <Link 
                  to="/profile" 
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  📝 Thông tin tài khoản
                </Link>
                <Link 
                  to="/order-history" 
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  📦 Lịch sử đơn hàng
                </Link>
                <button 
                  className="block w-full text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 text-red-600"
                  onClick={() => {
                    logout();
                    setIsDropdownOpen(false);
                  }}
                >
                  🚪 Đăng xuất
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/auth">
            <button className="bg-white text-orange-500 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100">
              Đăng nhập
            </button>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
