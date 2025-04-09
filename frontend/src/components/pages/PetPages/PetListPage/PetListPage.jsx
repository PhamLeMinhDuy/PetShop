import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";

const PetListPage = () => {
  const { type } = useParams();
  const [pets, setPets] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("name");
  const [breedFilter, setBreedFilter] = useState(""); // Thêm lọc giống
  const [sizeFilter, setSizeFilter] = useState("");
  const [colorFilter, setColorFilter] = useState("");
  const [ageFilter, setAgeFilter] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [perPage, setPerPage] = useState(16);
  const [currentPage, setCurrentPage] = useState(1);
  const [breeds, setBreeds] = useState([]); // Danh sách giống

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/pets/type/${type}`);
        setPets(response.data);

        // Lấy danh sách giống không trùng lặp
        const uniqueBreeds = [...new Set(response.data.map((pet) => pet.breed))];
        setBreeds(uniqueBreeds);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách thú cưng:", error);
      }
    };

    fetchPets();
  }, [type]);

  const filteredPets = pets
    .filter((pet) => pet.name.toLowerCase().includes(search.toLowerCase()))
    .filter((pet) => (breedFilter ? pet.breed === breedFilter : true)) // Lọc theo giống
    .filter((pet) => (sizeFilter ? pet.size === sizeFilter : true))
    .filter((pet) => (colorFilter ? pet.color === colorFilter : true))
    .filter((pet) => (ageFilter ? pet.age === ageFilter : true))
    .filter((pet) => (minPrice ? pet.price >= Number(minPrice) : true))
    .filter((pet) => (maxPrice ? pet.price <= Number(maxPrice) : true))
    .sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "name-desc") return b.name.localeCompare(a.name);
      if (sort === "newest") return new Date(b.dateAdded) - new Date(a.dateAdded);
      if (sort === "oldest") return new Date(a.dateAdded) - new Date(b.dateAdded);
      return 0;
    });

  const totalPages = Math.ceil(filteredPets.length / perPage);
  const startIndex = (currentPage - 1) * perPage;
  const paginatedPets = filteredPets.slice(startIndex, startIndex + perPage);

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold">Danh sách {type === "dog" ? "Chó" : type === "cat" ? "Mèo" : "Chim"}</h2>

      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 my-4">
        <input type="text" placeholder="🔍 Tìm kiếm theo tên..." className="p-2 border rounded w-full" value={search} onChange={(e) => setSearch(e.target.value)} />
        
        <select className="p-2 border rounded w-full" onChange={(e) => setSort(e.target.value)}>
          <option value="name">Sắp xếp: A-Z</option>
          <option value="name-desc">Sắp xếp: Z-A</option>
          <option value="newest">Mới nhất</option>
          <option value="oldest">Cũ nhất</option>
        </select>

        {/* Bộ lọc giống */}
        <select className="p-2 border rounded w-full" onChange={(e) => setBreedFilter(e.target.value)}>
          <option value="">Chọn giống</option>
          {breeds.map((breed) => (
            <option key={breed} value={breed}>{breed}</option>
          ))}
        </select>

        <input type="number" placeholder="💲 Giá tối thiểu" className="p-2 border rounded w-full" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
        <input type="number" placeholder="💲 Giá tối đa" className="p-2 border rounded w-full" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-4">
        {paginatedPets.map((pet) => (
          <div key={pet._id} className="bg-white p-4 rounded-xl shadow-lg">
            <Link to={`/pet/${pet._id}`}>
              <img 
                src={pet.image} 
                alt={pet.name} 
                className="w-full h-[160px] object-center rounded-lg cursor-pointer"
              />

            </Link>
            <h3 className="text-xl font-semibold mt-2">
              <Link to={`/pets/${pet._id}`}>{pet.name}</Link>
            </h3>
            <p className="text-gray-500 capitalize">Giống: {pet.breed}</p>
            <p className="text-gray-500 capitalize">Giá: {pet.price} USD</p>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-6 space-x-2">
        <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50">Trước</button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button key={page} className={`px-4 py-2 rounded ${page === currentPage ? "bg-blue-500 text-white" : "bg-gray-200"}`} onClick={() => setCurrentPage(page)}>
            {page}
          </button>
        ))}
        <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)} className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50">Sau</button>
      </div>
    </div>
  );
};

export default PetListPage;
