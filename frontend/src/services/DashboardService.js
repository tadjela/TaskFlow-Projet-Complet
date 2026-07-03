import api from '../utils/axios'

const DashboardService = {
  get: () => api.get('/dashboard'),
}

export default DashboardService
