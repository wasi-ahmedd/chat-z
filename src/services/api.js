import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
})

export const authService = {
  signup: () => api.post('/auth/signup'),
  getMe: () => api.get('/users/me'),
  updateProfile: (data) => api.patch('/users/me', data),
}

export const socialService = {
  getSocialState: () => api.get('/social/state'),
  markNotificationsRead: (type) => api.post('/social/notifications/read', { type }),
  getProfile: (userId) => api.get(`/users/${userId}/profile`),
}

export default api
