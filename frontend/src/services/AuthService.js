import api from '../utils/axios'

const AuthService = {
  register: (data) => api.post('/register', data),
  login: (data) => api.post('/login', data),
  logout: () => api.post('/logout'),
  me: () => api.get('/user'),
  updateProfile: (data) => {
    const isFormData = data instanceof FormData
    return api.put('/profile', data, isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {})
  },
  updatePassword: (data) => api.put('/password', data),
}

export default AuthService
