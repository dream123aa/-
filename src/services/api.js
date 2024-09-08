import axios from 'axios'

const api = axios.create({
  baseURL: 'https://your-api-base-url.com/api', // 替换为实际的API地址
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
})

// 添加请求拦截器（可选）
api.interceptors.request.use(
  config => {
    // 添加认证token
    // config.headers.Authorization = `Bearer ${token}`
    return config
  },
  error => Promise.reject(error)
)

export default api