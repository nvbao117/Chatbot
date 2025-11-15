import axios from "axios"
import { APP_CONFIG } from "../config/app.config"
import { STORAGE_KEYS } from "../utils/constants"
import { storage } from "../utils/storage"

const api = axios.create({
  baseURL: APP_CONFIG.apiBaseUrl,
  timeout: 10000,
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    let token = storage.get(STORAGE_KEYS.AUTH_TOKEN)
    if (!token) {
      token = localStorage.getItem('th_token')
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      storage.remove(STORAGE_KEYS.AUTH_TOKEN)
      window.location.href = "/login"
    }
    return Promise.reject(error.response?.data || error.message)
  },
)

export default api
