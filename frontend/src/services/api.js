import { API_BASE_URL } from '../config/api'

// Common fetch options
const defaultOptions = {
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include',
}

// Base API request function
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`
  const response = await fetch(url, {
    ...defaultOptions,
    ...options,
  })

  const contentType = response.headers.get('content-type')
  const isJson = contentType && contentType.includes('application/json')

  if (!response.ok) {
    let errorData
    let message = `API request failed: ${response.status} ${response.statusText}`

    try {
      errorData = isJson ? await response.json() : await response.text()
      if (typeof errorData === 'object') {
        message = errorData.message || message
      } else if (typeof errorData === 'string') {
        message = errorData
      }
    } catch (e) {}

    const error = new Error(message)
    error.status = response.status
    error.data = errorData
    throw error
  }

  return isJson ? response.json() : response.text()
}

// Form URL encoded request helper
const formUrlEncodedRequest = async (endpoint, params = {}) => {
  const body = Object.entries(params)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&')

  return apiRequest(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  })
}

// Torrent API
export const torrentsApi = {
  // Get all torrents
  getAll: () => apiRequest('/api/torrents'),

  // Add a new torrent
  add: (formData) =>
    apiRequest('/api/torrents/add', {
      method: 'POST',
      body: formData,
      headers: {},
    }),

  // Pause a torrent
  pause: (hash) =>
    formUrlEncodedRequest('/api/torrents/pause', {
      hashes: hash,
    }),

  // Resume a torrent
  resume: (hash) =>
    formUrlEncodedRequest('/api/torrents/resume', {
      hashes: hash,
    }),

  // Recheck a torrent
  recheck: (hash) =>
    formUrlEncodedRequest('/api/v2/torrents/recheck', {
      hashes: hash,
    }),

  // Delete a torrent
  delete: (hash, deleteFiles = false) =>
    formUrlEncodedRequest('/api/torrents/delete', {
      hashes: hash,
      deleteFiles: deleteFiles,
    }),

  getCategories: () => apiRequest('/api/v2/torrents/categories'),

  setCategory: (hashes, category) =>
    formUrlEncodedRequest('/api/v2/torrents/setCategory', {
      hashes: Array.isArray(hashes) ? hashes.join('|') : hashes,
      category,
    }),
  
  addCategory: (category, savePath) =>
    formUrlEncodedRequest('/api/v2/torrents/createCategory', {
      category,
      savePath,
    }),
  
  editCategory: (category, savePath) =>
    formUrlEncodedRequest('/api/v2/torrents/editCategory', {
      category,
      savePath,
    }),
  
  removeCategories: (categories) =>
    formUrlEncodedRequest('/api/v2/torrents/removeCategories', {
      categories: Array.isArray(categories) ? categories.join('\n') : categories,
    }),
}

// Search API
export const searchApi = {
  start: (pattern) =>
    apiRequest('/api/search/start', {
      method: 'POST',
      body: JSON.stringify({ pattern }),
    }),
  status: (id) => apiRequest(`/api/search/status?id=${id}`),
  results: (id) => apiRequest(`/api/search/results?id=${id}`),
  stop: ({ id }) =>
    apiRequest('/api/search/stop', {
      method: 'POST',
      body: JSON.stringify({ id }),
    }),
  delete: ({ id }) =>
    apiRequest('/api/search/delete', {
      method: 'POST',
      body: JSON.stringify({ id }),
    }),
}

// Auth API
export const authApi = {
  login: async (username, password) => {
    return await apiRequest('/api/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    })
  },
  logout: () => apiRequest('/api/logout', { method: 'POST' }),
  checkAuth: async () => {
    try {
      const result = await apiRequest('/api/check-auth')
      return result.authenticated
    } catch (error) {
      console.error('Authentication check failed:', error)
      return false
    }
  },
}

// System info API
export const systemApi = {
  getInfo: () => apiRequest('/api/system/info'),
}
