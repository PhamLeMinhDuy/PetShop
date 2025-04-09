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
        const response = await fetch("http://localhost:5000/api/pets"); // 🟢 Gọi API thật
        const data = await response.json();
        setPets(data); // Cập nhật danh sách thú cưng
      } catch (error) {
        console.error("Lỗi khi tải thú cưng:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchPets();
  }, []);
  

  // 🐾 Điều hướng đến trang danh sách loại thú cưng
  const handleNavigate = (type) => {
    navigate(`/pets/${type}`);
  };

  // 🐾 Điều hướng đến trang chi tiết thú cưng
  const handleNavigateToDetail = (id) => {
    navigate(`/pet/${id}`);
  };

  return (
    <div className="container mx-auto p-6">
      {/* 🚀 Banner */}
      <div className="relative w-full h-64 rounded-xl overflow-hidden shadow-lg">
        <img src={banner} alt="Pet Shop Banner" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
          <h1 className="text-white text-4xl font-bold drop-shadow-lg">🐾 Chào mừng đến với Pet Shop! 🐾</h1>
        </div>
      </div>

      {/* 📌 Danh mục thú cưng */}
      <h2 className="text-2xl font-bold mt-6 text-orange-500">Danh mục thú cưng</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        <button onClick={() => handleNavigate("dog")} className="bg-orange-100 p-4 rounded-lg shadow hover:bg-orange-200">🐶 Chó</button>
        <button onClick={() => handleNavigate("cat")} className="bg-orange-100 p-4 rounded-lg shadow hover:bg-orange-200">🐱 Mèo</button>
        <button onClick={() => handleNavigate("bird")} className="bg-orange-100 p-4 rounded-lg shadow hover:bg-orange-200">🐦 Chim</button>
      </div>

      {/* 🐾 Danh sách thú cưng nổi bật */}
      <h2 className="text-2xl font-bold mt-6 text-orange-500">Thú cưng nổi bật</h2>
      {loading ? (
        <p className="text-gray-500">Đang tải...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-4">
          {pets.slice(0, 8).map((pet) => (
            <div key={pet._id} className="bg-white p-4 rounded-xl shadow-lg">
              <img 
                src={pet.image} 
                alt={pet.name} 
                className="w-full h-[160px] object-fill rounded-lg cursor-pointer"
              />
              <h3 className="text-xl font-semibold mt-2">{pet.name}</h3>
              <p className="text-gray-500 capitalize">Loại: {pet.type}</p>
              <button 
                onClick={() => handleNavigateToDetail(pet._id)} 
                className="mt-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
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
