import api from './api';

const authService = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    refresh: () => api.post('/auth/refresh'),
    logout: () => api.post('/auth/logout'),
    
   
    getCurrentUser: () => api.get('/auth/me'),
};

export default authService;