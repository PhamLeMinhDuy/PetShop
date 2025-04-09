import { Link } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import AuthContext from "../../context/AuthContext";
import logo from "../../../assets/images/logo.png";
import { FaBars } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion"; // 👉 Thêm dòng này

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [pendingItemCount, setPendingItemCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchPendingCart = async () => {
      if (!user) return;

      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/orders/user/${user._id}`);
        const data = await res.json();

        const pendingOrders = data.orders.filter((order) => order.status === "pending");
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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-orange-500 text-white py-4 shadow-lg relative z-50">
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

        <div className="flex items-center gap-4">
          <button 
            className="md:hidden text-white text-2xl focus:outline-none"
            onClick={toggleMobileMenu}
          >
            <FaBars />
          </button>

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
      </div>

      {/* 👉 AnimatePresence giúp mount/unmount mượt mà */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop mờ */}
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-60 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={toggleMobileMenu}
            />

            {/* Mobile Menu */}
            <motion.div
              className="fixed top-0 right-0 w-64 h-full bg-orange-500 shadow-2xl z-50"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
            >
              <button
                className="p-4 text-white text-2xl focus:outline-none"
                onClick={toggleMobileMenu}
              >
                ✕
              </button>
              <nav className="mt-4">
                <Link
                  to="/"
                  className="block py-2 px-4 text-white hover:bg-orange-600"
                  onClick={toggleMobileMenu}
                >
                  🏠 Trang chủ
                </Link>
                <Link
                  to="/cart"
                  className="block py-2 px-4 text-white hover:bg-orange-600 relative"
                  onClick={toggleMobileMenu}
                >
                  🛒 Giỏ hàng
                  {pendingItemCount > 0 && (
                    <span className="absolute -top-2 -right-4 bg-red-600 text-white text-sm px-2 py-0.5 rounded-full">
                      {pendingItemCount}
                    </span>
                  )}
                </Link>
                <Link
                  to="/contact"
                  className="block py-2 px-4 text-white hover:bg-orange-600"
                  onClick={toggleMobileMenu}
                >
                  📞 Liên hệ
                </Link>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
