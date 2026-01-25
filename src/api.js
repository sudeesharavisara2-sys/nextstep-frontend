import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:8099/api/v1',
});

// සෑම Request එකකටම Token එක ස්වයංක්‍රීයව එකතු කිරීමට (Interceptor)
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token'); // Login එකේදී save කළ token එක ලබා ගැනීම
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default API;