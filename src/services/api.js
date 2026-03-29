import axios from 'axios'

const api = axios.create({
<<<<<<< Updated upstream
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
=======
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
})

export const authService = {
  signup: (data) => api.post('/auth/signup', data),
  getMe: () => api.get('/users/me'),
}

export const userService = {
  updateMe: (data) => api.patch('/users/me', data),
  getProfile: (userId) => api.get(`/users/${userId}/profile`),
  getHistory: () => api.get('/users/history'),
}

export const socialService = {
  getState: () => api.get('/social/state'),
  sendFriendRequest: (targetUserId) => api.post('/friends/requests', { targetUserId }),
  acceptFriendRequest: (requestId) => api.post(`/friends/requests/${requestId}/accept`),
  declineFriendRequest: (requestId) => api.post(`/friends/requests/${requestId}/decline`),
  getFriends: () => api.get('/friends'),
  getMessages: (friendId) => api.get(`/friends/${friendId}/messages`),
}

export const matchService = {
  getActiveMatch: () => api.get('/match/active'),
>>>>>>> Stashed changes
}

export default api
