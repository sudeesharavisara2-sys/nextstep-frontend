import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:8099/api/v1',
});

export default API;