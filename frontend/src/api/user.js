export const getAllUsers = async () => {
    try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/all-users`, {
            headers: { Authorization: token },
        });
        return res.data;
    } catch (error) {
        throw error.response.data;
    }
};
