import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import banner from "../../../assets/images/Banner.png";

const HomePage = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/pets`);
        const data = await response.json();
        setPets(data);
      } catch (error) {
        console.error("Lỗi khi tải thú cưng:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, []);

  const handleNavigate = (type) => {
    navigate(`/pets/${type}`);
  };

  const handleNavigateToDetail = (id) => {
    navigate(`/pet/${id}`);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* 🚀 Banner */}
      <div className="relative w-full h-48 sm:h-64 md:h-72 lg:h-80 rounded-xl overflow-hidden shadow-lg">
        <img src={banner} alt="Pet Shop Banner" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <h1 className="text-white text-xl sm:text-3xl md:text-4xl font-bold drop-shadow-lg text-center">
            🐾 Chào mừng đến với Pet Shop! 🐾
          </h1>
        </div>
      </div>

      {/* 📌 Danh mục thú cưng */}
      <h2 className="text-xl sm:text-2xl font-bold mt-8 text-orange-500">Danh mục thú cưng</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
        {[
          { type: "dog", label: "🐶 Chó" },
          { type: "cat", label: "🐱 Mèo" },
          { type: "bird", label: "🐦 Chim" },
        ].map(({ type, label }) => (
          <button
            key={type}
            onClick={() => handleNavigate(type)}
            className="bg-orange-100 hover:bg-orange-200 p-4 rounded-lg text-sm sm:text-base font-semibold shadow transition-all"
          >
            {label}
          </button>
        ))}
      </div>

      {/* 🐾 Danh sách thú cưng nổi bật */}
      <h2 className="text-xl sm:text-2xl font-bold mt-10 text-orange-500">Thú cưng nổi bật</h2>
      {loading ? (
        <p className="text-gray-500 mt-4">Đang tải...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
          {pets.slice(0, 8).map((pet) => (
            <div key={pet._id} className="bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition duration-300">
              <img
                src={pet.image}
                alt={pet.name}
                className="w-full h-40 sm:h-44 object-cover rounded-lg cursor-pointer"
              />
              <h3 className="text-lg font-semibold mt-2">{pet.name}</h3>
              <p className="text-gray-500 capitalize">Loại: {pet.type}</p>
              <button
                onClick={() => handleNavigateToDetail(pet._id)}
                className="mt-3 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg w-full transition-all"
              >
                Xem chi tiết
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
