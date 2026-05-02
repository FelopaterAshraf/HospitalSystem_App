import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5087/api', // backend URL
    withCredentials: true // Ensures HttpOnly cookies are sent
});

api.interceptors.response.use(
    (response) => {
        // If the request succeeds, just return the data normally
        return response;
    },
    (error) => {
        // If the  backend rejects the request because of a missing/expired cookie...
        if (error.response && error.response.status === 401) {
            
            // Destroy the React VIP wristbands
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('userName');
            localStorage.removeItem('userRole');
            
            // Force the browser to redirect to the Login page
            window.location.href = '/'; 
        }
        return Promise.reject(error);
    }
);

export default api;