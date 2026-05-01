import api from './api';

const appointmentService = {
    getAll: () => api.get('/appointments'),
    getById: (id) => api.get(`/appointments/${id}`),
    create: (appointmentData) => api.post('/appointments', appointmentData),
    update: (id, appointmentData) => api.put(`/appointments/${id}`, appointmentData),
    delete: (id) => api.delete(`/appointments/${id}`)
};

export default appointmentService;