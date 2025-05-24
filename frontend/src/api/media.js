
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL + '/media';

export const getMedia = async () => {
    const auth = JSON.parse(localStorage.getItem('auth'));
    
    const response = await axios.get(API_URL, {
        headers: {
            Authorization: `Bearer ${auth.token}`
        }
    });
    
    return response.data;
};

export const uploadMedia = async (file, title, expiryTime) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('expiryTime', expiryTime);

    const auth = JSON.parse(localStorage.getItem('auth'));
    const response = await axios.post(API_URL, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${auth.token}`
        }
    });
    return response.data;
};

export const getMediaUrl = (id) => {
    return `${import.meta.env.VITE_BACKEND_API_BASE_URL}/storage/${id}`;
};

export const getExpiredMedia = async () => {
    const auth = JSON.parse(localStorage.getItem('auth'));
    const response = await axios.get(`${API_URL}/expired`, {
        headers: {
            Authorization: `Bearer ${auth.token}`
        }
    });
    return response.data;
};

export const deleteMedia = async (id) => {
    const auth = JSON.parse(localStorage.getItem('auth'));
    const response = await axios.delete(`${API_URL}/${id}`, {
        headers: {
            Authorization: `Bearer ${auth.token}`
        }
    });
    return response.data;
};