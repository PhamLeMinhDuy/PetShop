const mongoose = require("mongoose");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const Pet = require("../models/Pet");

dotenv.config();

// Kết nối MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Hàm upload ảnh lên Cloudinary
const uploadImageToCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "pet-shop", // Tạo thư mục pet-shop trên Cloudinary
    });
    return result.secure_url; // Trả về URL ảnh sau khi upload
  } catch (error) {
    console.error(`❌ Lỗi upload ảnh ${filePath}:`, error);
    return null;
  }
};

// Hàm lấy ảnh từ thư mục và upload lên Cloudinary
const getImageUrl = async (folder, breed) => {
  const formattedBreed = breed.replace(/\s+/g, "-"); // Đổi khoảng trắng thành '-'

  // Tạo danh sách các đuôi có thể
  const extensions = [".jpg", ".jfif"];

  for (const ext of extensions) {
    const filePath1 = path.join(__dirname, `../assets/${folder}/${formattedBreed}-1${ext}`);
    const filePath2 = path.join(__dirname, `../assets/${folder}/${formattedBreed}-2${ext}`);

    if (fs.existsSync(filePath1)) {
      return await uploadImageToCloudinary(filePath1);
    } else if (fs.existsSync(filePath2)) {
      return await uploadImageToCloudinary(filePath2);
    }
  }

  return "https://via.placeholder.com/150"; // Ảnh mặc định nếu không có ảnh
};


// Hàm tạo dữ liệu thú cưng
const generatePets = async (type, names, breeds) => {
  const colors = ["Brown", "Black", "White", "Gray", "Golden", "Orange", "Cream", "Spotted", "Green", "Blue"];
  const descriptions = {
    dog: "Chú chó đáng yêu, trung thành và hoạt bát.",
    cat: "Mèo thông minh, hiền lành và rất thân thiện.",
    bird: "Chim vui nhộn, biết hót và hoạt bát.",
  };

  const pets = [];

  for (let i = 0; i < names.length; i++) {
    const breed = breeds.length > 0 ? breeds[i % breeds.length] : "Unknown";
    const imageUrl = await getImageUrl(type + "s", breed);

    pets.push({
      name: names[i],
      type,
      breed,
      age: Math.floor(Math.random() * 10) + 1,
      color: colors[Math.floor(Math.random() * colors.length)],
      price: Math.floor(Math.random() * 2500) + 500,
      image: imageUrl, // Lưu URL từ Cloudinary
      description: descriptions[type],
      available: Math.random() > 0.5,
    });
  }

  return pets;
};

// Hàm seed dữ liệu vào MongoDB
const seedPets = async () => {
  try {
    await Pet.deleteMany(); // Xóa dữ liệu cũ

    const dogNames = ["Buddy", "Charlie", "Max", "Rocky", "Cooper"];
    const dogBreeds = ["Labrador Retriever", "German Shepherd", "Golden Retriever", "Bulldog", "Beagle"];

    const catNames = ["Luna", "Oliver", "Milo", "Simba", "Leo"];
    const catBreeds = ["Siamese", "Persian", "Maine Coon", "Bengal", "Sphynx"];

    const birdNames = ["Coco", "Kiwi", "Sunny", "Charlie", "Sky"];
    const birdBreeds = ["Parrot", "Canary", "Finch", "Cockatiel", "Budgerigar"];

    const pets = [
      ...(await generatePets("dog", dogNames, dogBreeds)),
      ...(await generatePets("cat", catNames, catBreeds)),
      ...(await generatePets("bird", birdNames, birdBreeds)),
    ];

    await Pet.insertMany(pets);
    console.log("✅ Dữ liệu thú cưng đã được thêm vào MongoDB!");
    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Lỗi khi seed dữ liệu:", error);
    mongoose.connection.close();
  }
};

// Gọi hàm seed
seedPets();
