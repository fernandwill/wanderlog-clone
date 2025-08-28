import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/auth/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  register: (data: { username: string; email: string; password: string; lastName?: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  getProfile: () =>
    api.get('/auth/profile'),
}

// Trips API
export const tripsAPI = {
  create: (data: any) => api.post('/trips', data),
  getAll: () => api.get('/trips'),
  getById: (id: string) => api.get(`/trips/${id}`),
  update: (id: string, data: any) => api.put(`/trips/${id}`, data),
  delete: (id: string) => api.delete(`/trips/${id}`),
}

// Places API
export const placesAPI = {
  search: (params: any) => api.get('/places/search', { params }),
  getNearby: (params: any) => api.get('/places/nearby', { params }),
  getById: (id: string) => api.get(`/places/${id}`),
  create: (data: any) => api.post('/places', data),
  update: (id: string, data: any) => api.put(`/places/${id}`, data),
}

// Itinerary API
export const itineraryAPI = {
  add: (data: any) => api.post('/itinerary', data),
  update: (id: string, data: any) => api.put(`/itinerary/${id}`, data),
  remove: (id: string) => api.delete(`/itinerary/${id}`),
  reorder: (tripId: string, items: any[]) => api.put(`/itinerary/trips/${tripId}/reorder`, { items }),
}

// AI API
export const aiAPI = {
  generateSuggestions: (tripId: string, data: any) => api.post(`/ai/trips/${tripId}/suggestions`, data),
  optimizeRoute: (tripId: string) => api.post(`/ai/trips/${tripId}/optimize`),
  acceptSuggestion: (id: string) => api.put(`/ai/suggestions/${id}/accept`),
  rejectSuggestion: (id: string) => api.put(`/ai/suggestions/${id}/reject`),
}