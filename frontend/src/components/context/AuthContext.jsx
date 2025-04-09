import { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
  }, []);

  const login = (userData) => {
    setUser({ ...userData.user, _id: userData.user.id }); // ✅ Gán _id từ id
    localStorage.setItem("user", JSON.stringify({ ...userData.user, _id: userData.user.id }));
    localStorage.setItem("token", userData.token);
  };
  

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  // ✅ Hàm cập nhật user sau khi chỉnh sửa thông tin
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };  

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};





export default AuthContext;
