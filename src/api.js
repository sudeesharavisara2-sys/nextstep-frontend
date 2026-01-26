import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:8099/api/v1',
});

<<<<<<< HEAD
export default API;
=======

API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default API;
>>>>>>> 88791749c61f2ad401908b7214a63db9fb5d6b91
