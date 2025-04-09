export const getAllUsers = async () => {
    try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/users/all-users", {
            headers: { Authorization: token },
        });
        return res.data;
    } catch (error) {
        throw error.response.data;
    }
};
