// src/api/axiosInstance.js
import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000',  // ← your actual backend port
  headers: {
    'Content-Type': 'application/json'
  }
})

// If your routes are auth-protected, attach the token:
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token') // or wherever you store it
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default axiosInstance