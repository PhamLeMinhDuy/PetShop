import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_URL}/api/auth`; // Thay bằng URL backend thực tế

// API Đăng ký
export const registerUser = async (userData) => {
    try {
        const res = await axios.post(`${API_URL}/register`, userData);
        return res.data;
    } catch (error) {
        throw error.response.data;
    }
};

// API Đăng nhập
export const loginUser = async (userData) => {
    try {
        const res = await axios.post(`${API_URL}/login`, userData);
        return res.data;
    } catch (error) {
        throw error.response.data;
    }
};
