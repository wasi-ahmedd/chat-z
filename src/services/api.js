import axios from 'axios'

const API_URL = '/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
})

export const authService = {
  signup: (data) => api.post('/auth/signup', data),
  getMe: () => api.get('/users/me'),
  updateProfile: (data) => api.patch('/users/me', data),
}

export const userService = {
  updateMe: (data) => api.patch('/users/me', data),
  getProfile: (userId) => api.get(`/users/${userId}/profile`),
  getHistory: () => api.get('/users/history'),
}

export const socialService = {
  getState: () => api.get('/social/state'),
  markNotificationsRead: (type) => api.post('/social/notifications/read', { type }),
  sendFriendRequest: (targetUserId) => api.post('/friends/requests', { targetUserId }),
  acceptFriendRequest: (requestId) => api.post(`/friends/requests/${requestId}/accept`),
  declineFriendRequest: (requestId) => api.post(`/friends/requests/${requestId}/decline`),
  getFriends: () => api.get('/friends'),
  getMessages: (friendId) => api.get(`/friends/${friendId}/messages`),
}

export const matchService = {
  getActiveMatch: () => api.get('/match/active'),
}

export const uiService = {
  getConfig: () => api.get('/ui/config'),
  getState: () => api.get('/ui/state'),
  save: (config, state) => api.post('/ui/save', { config, state }),
}

export default api
