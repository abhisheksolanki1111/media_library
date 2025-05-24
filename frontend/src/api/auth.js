
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const register = async (name, email, password, role) => {
    return await axios.post(`${API_URL}/register`, {
        name,
        email,
        password,
        password_confirmation: password,
        role
    });
};

export const login = async (email, password) => {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data;
};
// export const login = async (email, password) => {
//     const response = await axios.post(`${API_URL}/login`, { email, password });

//     const { token } = response.data;

//     localStorage.setItem('token', token);

//     return response.data;
// };
  
export const logout = async () => {
    return await axios.post(`${API_URL}/logout`, {}, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
};

export const getCurrentUser = async () => {
    const response = await axios.get(`${API_URL}/me`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
    return response.data;
};