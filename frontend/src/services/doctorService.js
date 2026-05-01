import api from './api';

const doctorService = {
    getAll: () => api.get('/doctors'),
    getById: (id) => api.get(`/doctors/${id}`),
    create: (doctorData) => api.post('/doctors', doctorData),
    update: (id, doctorData) => api.put(`/doctors/${id}`, doctorData),
    delete: (id) => api.delete(`/doctors/${id}`)
};

export default doctorService;