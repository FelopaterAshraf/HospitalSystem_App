import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5087/api', // backend URL
    withCredentials: true // Ensures HttpOnly cookies are sent
});


api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const isLoginRoute   = error.config?.url?.includes('/auth/login');
        const isRefreshRoute = error.config?.url?.includes('/auth/refresh');

        if (error.response?.status === 401 && !isLoginRoute && !isRefreshRoute) {
            try {
                await api.post('/auth/refresh');
                return api(error.config);
            } catch {
                // Session is truly dead. Only redirect when not already on the
                // login page to avoid an infinite reload loop on cold visits.
                if (window.location.pathname !== '/') {
                    window.location.href = '/';
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;

