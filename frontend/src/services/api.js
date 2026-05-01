import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5087/api', // backend URL
    withCredentials: true // Ensures HttpOnly cookies are sent
});

export default api;