import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { useCart } from "../../../context/CartContext";
import AuthContext from "../../../context/AuthContext";

const PetDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { user } = useContext(AuthContext);
  const [orderStatus, setOrderStatus] = useState(null);

  useEffect(() => {
    const fetchPetDetail = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/pets/${id}`);
        const data = await response.json();
        setPet(data);
      } catch (error) {
        console.error("Lỗi khi tải thú cưng:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPetDetail();
  }, [id]);

  const handleAddToCart = async () => {
    if (!pet) return;
    if (!user) {
      setOrderStatus("❌ Bạn cần đăng nhập để đặt hàng!");
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/orders/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user._id,
          items: [{ petId: pet._id, name: pet.name, price: pet.price, quantity: 1 }],
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setOrderStatus("✅ Đơn hàng đã được thêm!");
        addToCart(pet);
      } else {
        setOrderStatus(`❌ Lỗi: ${data.message}`);
      }
    } catch (error) {
      console.error("Lỗi khi đặt hàng:", error);
      setOrderStatus("❌ Lỗi khi kết nối đến server.");
    }
  };

  if (loading)
    return <p className="text-center text-gray-500">⏳ Đang tải dữ liệu...</p>;
  if (!pet)
    return (
      <p className="text-center text-red-500 font-semibold">
        🐾 Không tìm thấy thú cưng...
      </p>
    );

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row items-center lg:items-start gap-6">
      {/* Ảnh thú cưng */}
      <div className="w-full lg:w-1/2">
        <div className="relative w-full h-[300px] sm:h-[400px] rounded-xl overflow-hidden shadow-lg">
          <img
            src={pet.image}
            alt={pet.name}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black bg-opacity-10 hover:bg-opacity-20 transition duration-300"></div>
        </div>
      </div>

      {/* Thông tin thú cưng */}
      <div className="w-full lg:w-1/2 bg-white p-5 sm:p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">{pet.name}</h2>
        <p className="text-gray-500 italic text-base sm:text-lg capitalize">
          🐾 {pet.type}
        </p>

        <div className="mt-4 space-y-2 text-base sm:text-lg">
          <p className="text-gray-700">
            🎨 <span className="font-semibold">Màu sắc:</span> {pet.color}
          </p>
          <p className="text-gray-700">
            📏 <span className="font-semibold">Kích thước:</span> {pet.size}
          </p>
          <p className="text-gray-700">
            🔢 <span className="font-semibold">Độ tuổi:</span> {pet.age} tuổi
          </p>
          <p className="text-gray-800 text-xl font-semibold">
            💰 Giá: <span className="text-orange-500">{pet.price} USD</span>
          </p>
        </div>

        {/* Trạng thái đơn hàng */}
        {orderStatus && (
          <p className="mt-4 text-center text-green-600 font-semibold">
            {orderStatus}
          </p>
        )}

        {/* Nút thêm vào giỏ hàng */}
        <button
          className="mt-6 w-full bg-orange-500 text-white py-3 rounded-lg font-semibold text-base sm:text-lg shadow hover:bg-orange-600 transition"
          onClick={handleAddToCart}
        >
          🛒 Thêm vào giỏ hàng
        </button>

        {/* Nút quay lại */}
        <button
          className="mt-4 w-full bg-gray-300 text-gray-800 py-3 rounded-lg font-semibold text-base sm:text-lg shadow hover:bg-gray-400 transition"
          onClick={() => navigate(-1)}
        >
          🔙 Quay lại
        </button>
      </div>
    </div>
  );
};

export default PetDetailPage;
