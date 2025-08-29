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
  getAll: () => apiRequest('/torrents/info'),

  // Add a new torrent
  add: (formData) =>
    apiRequest('/torrents/add', {
      method: 'POST',
      body: formData,
      headers: {},
    }),

  // Pause a torrent
  pause: (hash) =>
    formUrlEncodedRequest('/torrents/pause', {
      hashes: hash,
    }),

  // Resume a torrent
  resume: (hash) =>
    formUrlEncodedRequest('/torrents/resume', {
      hashes: hash,
    }),

  // Recheck a torrent
  recheck: (hash) =>
    formUrlEncodedRequest('/torrents/recheck', {
      hashes: hash,
    }),

  // Delete a torrent
  delete: (hash, deleteFiles = false) =>
    formUrlEncodedRequest('/torrents/delete', {
      hashes: hash,
      deleteFiles: deleteFiles,
    }),

  getCategories: () => apiRequest('/torrents/categories'),

  setCategory: (hashes, category) =>
    formUrlEncodedRequest('/torrents/setCategory', {
      hashes: Array.isArray(hashes) ? hashes.join('|') : hashes,
      category,
    }),

  addCategory: (category, savePath) =>
    formUrlEncodedRequest('/torrents/createCategory', {
      category,
      savePath,
    }),

  editCategory: (category, savePath) =>
    formUrlEncodedRequest('/torrents/editCategory', {
      category,
      savePath,
    }),

  removeCategories: (categories) =>
    formUrlEncodedRequest('/torrents/removeCategories', {
      categories: Array.isArray(categories) ? categories.join('\n') : categories,
    }),
}

// Search API
export const searchApi = {
  start: (pattern) =>
    formUrlEncodedRequest('/search/start', {
      pattern,
      plugins: 'all',
      category: 'all',
    }),
  status: (id) => apiRequest(`/search/status?id=${id}`),
  results: (id) => apiRequest(`/search/results?id=${id}`),
  stop: ({ id }) =>
    formUrlEncodedRequest('/search/stop', {
      id,
    }),
  delete: ({ id }) =>
    formUrlEncodedRequest('/search/delete', {
      id,
    }),
}

// Auth API
export const authApi = {
  login: async (username, password) => {
    const body = new URLSearchParams()
    body.append('username', username)
    body.append('password', password)
    const result = await apiRequest('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    })
    if (result !== 'Ok.') {
      throw new Error(result || 'Login failed')
    }
    return result
  },
  logout: () => apiRequest('/auth/logout', { method: 'POST' }),
  checkAuth: async () => {
    try {
      await apiRequest('/app/version')
      return true
    } catch (error) {
      console.error('Authentication check failed:', error)
      return false
    }
  },
}

// System info API
export const systemApi = {
  getInfo: () => apiRequest('/transfer/info'),
}

// Settings API
export const settingsApi = {
  getPreferences: () => apiRequest('/app/preferences'),
  setPreferences: (prefs) =>
    formUrlEncodedRequest('/app/setPreferences', {
      json: JSON.stringify(prefs),
    }),
}
