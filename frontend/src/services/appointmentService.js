import api from './api';

const appointmentService = {
    getAll: () => api.get('/appointments'),
    getById: (id) => api.get(`/appointments/${id}`),
    create: (appointmentData) => api.post('/appointments', appointmentData),
    update: (id, appointmentData) => api.put(`/appointments/${id}`, appointmentData),
    delete: (id) => api.delete(`/appointments/${id}`),
    getSlots: (doctorId, date, excludeId) => api.get('/appointments/slots', { params: { doctorId, date, ...(excludeId != null ? { excludeId } : {}) } }),
    book: (data) => api.post('/appointments/book', data),
    getMine: () => api.get('/appointments/mine'),
    cancel: (id) => api.put(`/appointments/${id}/cancel`),
    getPending: () => api.get('/appointments/pending'),
    getDoctorToday: () => api.get('/appointments/doctor/today'),
    getDoctorSchedule: (date) => api.get('/appointments/doctor/schedule', { params: { date } }),
    getAdminDoctorSchedule: (doctorId, date) => api.get('/appointments/admin/schedule', { params: { doctorId, date } }),
    approve: (id) => api.put(`/appointments/${id}/approve`),
    reject: (id) => api.put(`/appointments/${id}/reject`)
};

export default appointmentService;