import { useEffect, useState, useContext } from "react";
import AuthContext from "../../context/AuthContext";

const CartPage = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);

  const confirmDeleteOrder = (orderId) => {
    setOrderToDelete(orderId);
    setShowModal(true);
  };

  const handleDeleteOrder = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/orders/remove/${orderToDelete}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.message) {
        setOrders((prev) => prev.filter((order) => order._id !== orderToDelete));
        alert("✅ Đã xoá đơn hàng!");
      }
    } catch (error) {
      console.error("Lỗi khi xoá đơn hàng:", error);
      alert("❌ Xoá thất bại");
    } finally {
      setShowModal(false);
      setOrderToDelete(null);
    }
  };

  const handlePayment = async () => {
    try {
      const unpaidOrders = orders.filter(order => order.status === "pending");
      if (unpaidOrders.length === 0) {
        alert("🛒 Không có đơn hàng chưa thanh toán!");
        return;
      }

      const response = await fetch("http://localhost:5000/api/orders/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orders: unpaidOrders, userId: user._id }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("❌ Không thể tạo phiên thanh toán.");
      }
    } catch (error) {
      console.error("Lỗi khi thanh toán:", error);
      alert("❌ Thanh toán thất bại");
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      try {
        const response = await fetch(`http://localhost:5000/api/orders/user/${user._id}`);
        const data = await response.json();
        setOrders(data.orders);
      } catch (error) {
        console.error("Lỗi khi tải đơn hàng:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  const pendingOrders = orders.filter(order => order.status !== "completed");

  if (!user) return <p className="text-center text-red-500">❌ Bạn cần đăng nhập để xem giỏ hàng!</p>;
  if (loading) return <p className="text-center text-gray-500">⏳ Đang tải dữ liệu...</p>;
  if (pendingOrders.length === 0) return <p className="text-center text-gray-500">🛒 Không có đơn hàng chưa thanh toán!</p>;

  return (
    <div className="container mx-auto p-6 relative">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">🛒 Giỏ hàng của bạn</h2>

      <div className="space-y-4">
        {pendingOrders.map((order) => (
          <div key={order._id} className="p-4 bg-white shadow rounded-lg space-y-2">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-lg font-semibold text-gray-800">📦 Đơn hàng #{order._id}</p>
                <p className="text-gray-500">🕒 {new Date(order.createdAt).toLocaleDateString()}</p>
                <p className="text-gray-700 font-semibold">💰 {order.totalPrice} USD</p>
                <p className="text-sm font-medium text-gray-600">
                  Trạng thái:{" "}
                  <span className="text-yellow-600">Chưa thanh toán</span>
                </p>
              </div>
              <div className="flex flex-col gap-2 text-right">
                <button
                  onClick={() => confirmDeleteOrder(order._id)}
                  className="text-red-500 hover:text-red-600 transition"
                >
                  ❌ Xoá đơn
                </button>
              </div>
            </div>

            <ul className="space-y-2">
              {order.items.map((item) => (
                <li key={item.petId} className="flex items-center gap-4">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                  <div className="flex flex-col">
                    <span className="text-gray-700">
                      {item.name} - {item.quantity} x {item.price} USD
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={handlePayment}
          className="bg-green-600 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:bg-green-700 transition-all duration-300 ease-in-out w-full sm:w-auto"
        >
          <span className="text-lg">Thanh toán toàn bộ giỏ hàng</span>
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm text-center">
            <h3 className="text-lg font-semibold mb-4">Xác nhận xoá đơn hàng?</h3>
            <p className="text-gray-600 mb-6">Bạn có chắc muốn xoá đơn hàng này không?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDeleteOrder}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                Xoá
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
              >
                Huỷ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
