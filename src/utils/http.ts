/**
 * HTTP 客户端配置
 * 基于 axios 封装，支持请求/响应拦截、自动 Token 刷新
 */

import axios, { type AxiosInstance, type AxiosError, type InternalAxiosRequestConfig } from 'axios'

// API 基础配置
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'
const API_TIMEOUT = 30000 // 30秒

// 刷新 Token 的标记
let isRefreshing = false
let refreshSubscribers: ((token: string) => void)[] = []

/**
 * 添加等待 Token 刷新的订阅者
 */
function subscribeTokenRefresh(callback: (token: string) => void) {
  refreshSubscribers.push(callback)
}

/**
 * 通知所有订阅者 Token 已刷新
 */
function onTokenRefreshed(token: string) {
  refreshSubscribers.forEach(callback => callback(token))
  refreshSubscribers = []
}

/**
 * 创建 axios 实例
 */
const http: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * 请求拦截器
 * 自动添加 Authorization 头
 */
http.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 从 localStorage 获取 token
    const session = localStorage.getItem('graftra_user_session')
    if (session) {
      try {
        const { token } = JSON.parse(session)
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`
        }
      } catch (error) {
        console.error('Failed to parse session:', error)
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

/**
 * 响应拦截器
 * 处理错误和 Token 刷新
 */
http.interceptors.response.use(
  (response) => {
    return response.data
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    // 处理 401 未授权错误
    if (error.response?.status === 401 && !originalRequest._retry) {
      // 检查是否是刷新 Token 的请求，如果是则直接失败
      if (originalRequest.url?.endsWith('/auth/refresh')) {
        // 刷新 Token 失败，清除本地会话
        localStorage.removeItem('graftra_user_session')
        window.location.href = '/login'
        return Promise.reject(error)
      }

      // 尝试刷新 Token
      if (!isRefreshing) {
        isRefreshing = true
        originalRequest._retry = true

        try {
          const session = localStorage.getItem('graftra_user_session')
          if (!session) {
            throw new Error('No session found')
          }

          const { refreshToken } = JSON.parse(session)

          // 调用刷新 Token 接口
          const response = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {
            refreshToken,
          })

          const { data } = response.data
          const newToken = data.token

          // 更新本地存储
          const updatedSession = JSON.parse(session)
          updatedSession.token = newToken
          localStorage.setItem('graftra_user_session', JSON.stringify(updatedSession))

          // 通知所有订阅者
          onTokenRefreshed(newToken)

          // 重试原始请求
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`
          }
          return http(originalRequest)
        } catch (refreshError) {
          // 刷新 Token 失败，清除本地会话并跳转登录页
          localStorage.removeItem('graftra_user_session')
          window.location.href = '/login'
          return Promise.reject(refreshError)
        } finally {
          isRefreshing = false
        }
      }

      // 如果正在刷新，等待刷新完成
      return new Promise((resolve, reject) => {
        subscribeTokenRefresh((token: string) => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`
          }
          resolve(http(originalRequest))
        })
      })
    }

    // 处理其他错误
    const errorMessage = axiosErrorMessage(error)
    return Promise.reject({
      success: false,
      message: errorMessage,
      code: error.response?.status?.toString() || 'UNKNOWN_ERROR',
      error: error.response?.data,
    })
  }
)

/**
 * 提取友好的错误信息
 */
function axiosErrorMessage(error: AxiosError): string {
  if (error.response) {
    const data = error.response.data as any
    if (data?.message) {
      return data.message
    }
    if (data?.error?.message) {
      return data.error.message
    }
  }

  if (error.code === 'ECONNABORTED') {
    return '请求超时，请检查网络连接'
  }

  if (error.code === 'ERR_NETWORK') {
    return '网络连接失败，请检查网络设置'
  }

  return '请求失败，请稍后重试'
}

export default http
