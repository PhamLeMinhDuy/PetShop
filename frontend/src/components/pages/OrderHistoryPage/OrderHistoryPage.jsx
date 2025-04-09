import { useEffect, useState, useContext } from "react";
import AuthContext from "../../context/AuthContext";

const OrderHistoryPage = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/orders/user/${user._id}`);
        const data = await res.json();
        setOrders(data.orders || []);
      } catch (error) {
        console.error("Lỗi khi lấy lịch sử đơn hàng:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (!user)
    return <p className="text-center text-red-500">❌ Bạn cần đăng nhập để xem lịch sử đơn hàng!</p>;
  if (loading)
    return <p className="text-center text-gray-500">⏳ Đang tải đơn hàng...</p>;
  if (orders.length === 0)
    return <p className="text-center text-gray-500">📭 Chưa có đơn hàng nào.</p>;

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center sm:text-left">
        📋 Lịch sử đơn hàng
      </h2>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="p-4 sm:p-6 bg-white shadow rounded-lg space-y-2">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
              <div className="space-y-1">
                <p className="text-base sm:text-lg font-semibold">Đơn #{order._id}</p>
                <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
                <p className="text-sm font-medium">
                  Trạng thái:{" "}
                  <span
                    className={order.status === "completed" ? "text-green-600" : "text-yellow-600"}
                  >
                    {order.status === "completed" ? "Đã thanh toán" : "Đang chờ thanh toán"}
                  </span>
                </p>
              </div>
              <p className="text-base sm:text-lg font-bold text-gray-800 mt-2 sm:mt-0">
                💰 {order.totalPrice} USD
              </p>
            </div>

            <ul className="grid grid-cols-1 gap-4 mt-2">
              {order.items.map((item) => (
                <li key={item.petId} className="flex gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <p className="font-semibold text-sm sm:text-base">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      {item.quantity} x {item.price} USD
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistoryPage;
