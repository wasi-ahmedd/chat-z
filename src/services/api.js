import axios from 'axios'

const API_URL = '/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Auth interceptor for future token use
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('vibe_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const authService = {
  createSession: (username) => api.post('/auth/signup', { username }),
  getMe: () => api.get('/auth/me'),
  getOnlineCount: () => api.get('/stats/online')
}

export default api
