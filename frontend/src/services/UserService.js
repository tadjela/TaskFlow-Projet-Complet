import api from '../utils/axios'

const UserService = {
  list: (params) => api.get('/admin/users', { params }),
  get: (id) => api.get(`/admin/users/${id}`),
  update: (id, data) => api.put(`/admin/users/${id}`, data),
  remove: (id) => api.delete(`/admin/users/${id}`),
  statistics: () => api.get('/admin/statistics'),
  logs: (params) => api.get('/admin/logs', { params }),
}

export default UserService
