/**
 * 认证相关类型定义
 * 用于前后端接口对接
 */

// ==================== 通用响应类型 ====================

/** API 统一响应格式 */
export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  error?: {
    message: string
    code: string
  }
}

// ==================== 请求类型 ====================

/** 登录请求参数 */
export interface LoginRequest {
  email: string
  password: string
  remember?: boolean
}

/** 微信登录请求参数 */
export interface WeChatLoginRequest {
  code: string      // 微信授权码
  state?: string    // 状态参数
}

/** 注册请求参数 */
export interface RegisterRequest {
  name?: string
  email: string
  password: string
  agreeToTerms: boolean
}

/** 刷新令牌请求参数 */
export interface RefreshTokenRequest {
  refreshToken: string
}

// ==================== 响应类型 ====================

/** 用户信息 */
export interface UserInfo {
  id: string
  name: string
  email: string
  avatar?: string | null
  createdAt: string
}

/** 登录/注册响应数据 */
export interface AuthResponseData {
  user: UserInfo
  token: string           // JWT 或其他认证令牌
  refreshToken?: string   // 刷新令牌（可选）
  expiresIn: number       // 过期时间（秒）
}

/** 登录/注册响应 */
export interface AuthResponse extends ApiResponse<AuthResponseData> {
  data?: AuthResponseData
}

/** 令牌刷新响应数据 */
export interface TokenRefreshResponseData {
  token: string
  expiresIn: number
}

/** 获取用户信息响应数据 */
export interface UserInfoResponseData {
  user: UserInfo
}

// ==================== 本地存储类型 ====================

/** 存储在 localStorage 的用户会话 */
export interface UserSession {
  user: UserInfo
  token: string
  refreshToken?: string
  expiresAt: number
  loginMethod: 'email' | 'wechat'
}

// ==================== API 端点配置 ====================

/** 认证相关 API 端点 */
export const AUTH_ENDPOINTS = {
  // 邮箱登录
  LOGIN: '/api/auth/login',
  // 邮箱注册
  REGISTER: '/api/auth/register',
  // 微信登录
  WECHAT_LOGIN: '/api/auth/wechat',
  // 退出登录
  LOGOUT: '/api/auth/logout',
  // 刷新令牌
  REFRESH: '/api/auth/refresh',
  // 获取当前用户信息
  ME: '/api/auth/me',
} as const

// ==================== 错误类型 ====================

/** API 错误响应 */
export interface ApiError {
  success: false
  message: string
  code?: string
  errors?: Record<string, string[]>
}

// ==================== 错误码 ====================

/** 常见错误码 */
export const ERROR_CODES = {
  EMAIL_EXISTS: 'EMAIL_EXISTS',              // 邮箱已被注册
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS', // 邮箱或密码错误
  UNAUTHORIZED: 'UNAUTHORIZED',               // 令牌无效或过期
  VALIDATION_ERROR: 'VALIDATION_ERROR',       // 参数验证失败
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED', // 请求过于频繁
} as const

export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES]
