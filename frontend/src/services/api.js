import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5087/api', // backend URL
    withCredentials: true // Ensures HttpOnly cookies are sent
});


api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const isLoginRoute = error.config?.url?.includes('/auth/login');
        const isRefreshRoute = error.config?.url?.includes('/auth/refresh');

        if (error.response?.status === 401 && !isLoginRoute && !isRefreshRoute) {
            try {
                // Try to silently get a new token
                await api.post('/auth/refresh');
                // Retry the original request
                return api(error.config);
            } catch (refreshError) {
                // Refresh also failed, session is truly dead — kick them out
                localStorage.removeItem('isAuthenticated');
                localStorage.removeItem('userName');
                localStorage.removeItem('userRole');
                window.location.href = '/';
            }
        }
        return Promise.reject(error);
    }
);

export default api;

