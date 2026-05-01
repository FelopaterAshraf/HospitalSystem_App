import api from './api';

const patientService = {
    getAll: () => api.get('/patients'),
    getById: (id) => api.get(`/patients/${id}`),
    create: (patientData) => api.post('/patients', patientData),
    update: (id, patientData) => api.put(`/patients/${id}`, patientData),
    delete: (id) => api.delete(`/patients/${id}`)
};

export default patientService;