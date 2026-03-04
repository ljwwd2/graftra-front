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
  phone: string
  password: string
  captchaCode: string
  captchaId: string
  remember?: boolean
}

/** 微信登录请求参数 */
export interface WeChatLoginRequest {
  code: string      // 微信授权码
  state?: string    // 状态参数
}

/** 发送短信验证码请求参数 */
export interface SendSmsRequest {
  phone: string
}

/** 注册请求参数 */
export interface RegisterRequest {
  phone: string
  password: string
  smsCode: string        // 短信验证码（6位数字）
  captchaCode: string
  captchaId: string
  agreeToTerms: boolean
  name?: string
}

/** 修改密码请求参数 */
export interface ChangePasswordRequest {
  oldPassword: string
  newPassword: string
}

/** 重置密码请求参数 */
export interface ResetPasswordRequest {
  phone: string
  smsCode: string
  newPassword: string
}

/** 更新用户信息请求参数 */
export interface UpdateUserRequest {
  name?: string
  avatar?: string
}

/** 文件上传响应 */
export interface UploadResponse {
  url: string
  filename: string
}

/** 验证码响应数据 */
export interface CaptchaResponseData {
  captchaId: string
  image: string      // Base64编码的PNG图片
}

/** 验证码响应 */
export interface CaptchaResponse extends ApiResponse<CaptchaResponseData> {
  data?: CaptchaResponseData
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
  phone: string
  avatar?: string | null
  loginMethod: 'PHONE' | 'WECHAT'
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
  loginMethod: 'PHONE' | 'WECHAT'
}

// ==================== API 端点配置 ====================

/** 认证相关 API 端点 */
export const AUTH_ENDPOINTS = {
  // 生成验证码
  CAPTCHA: '/api/auth/captcha',
  // 发送短信验证码
  SEND_SMS: '/api/auth/send-sms',
  // 发送重置密码短信验证码
  SEND_RESET_SMS: '/api/auth/send-reset-sms',
  // 手机号登录
  LOGIN: '/api/auth/login',
  // 手机号注册
  REGISTER: '/api/auth/register',
  // 微信登录
  WECHAT_LOGIN: '/api/auth/wechat',
  // 重置密码
  RESET_PASSWORD: '/api/auth/reset-password',
  // 退出登录
  LOGOUT: '/api/auth/logout',
  // 刷新令牌
  REFRESH: '/api/auth/refresh',
  // 获取当前用户信息
  ME: '/api/auth/me',
  // 修改密码
  CHANGE_PASSWORD: '/api/auth/password',
  // 上传文件
  UPLOAD: '/api/oss/upload',
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
  PHONE_EXISTS: 'PHONE_EXISTS',                      // 手机号已被注册
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',        // 手机号或密码错误
  INVALID_CAPTCHA: 'INVALID_CAPTCHA',                // 验证码错误或已过期
  INVALID_SMS_CODE: 'INVALID_SMS_CODE',              // 短信验证码错误或已过期
  REQUIRE_CAPTCHA: 'REQUIRE_CAPTCHA',                // 需要输入验证码（失败6次后）
  ACCOUNT_LOCKED: 'ACCOUNT_LOCKED',                  // 登录失败次数过多，账户已临时锁定
  TERMS_NOT_AGREED: 'TERMS_NOT_AGREED',              // 必须同意服务条款
  UNAUTHORIZED: 'UNAUTHORIZED',                      // 令牌无效或过期
  INVALID_TOKEN: 'INVALID_TOKEN',                    // 无效的访问令牌
  USER_NOT_FOUND: 'USER_NOT_FOUND',                  // 用户不存在
  VALIDATION_ERROR: 'VALIDATION_ERROR',              // 参数验证失败
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',        // 请求过于频繁
  INVALID_REFRESH_TOKEN: 'INVALID_REFRESH_TOKEN',    // 无效的刷新令牌
  REFRESH_TOKEN_EXPIRED: 'REFRESH_TOKEN_EXPIRED',    // 刷新令牌已失效
  INVALID_OLD_PASSWORD: 'INVALID_OLD_PASSWORD',      // 旧密码错误
  SAME_PASSWORD: 'SAME_PASSWORD',                    // 新密码不能与旧密码相同
  INVALID_PHONE_FORMAT: 'INVALID_PHONE_FORMAT',      // 手机号格式不正确
  SMS_CODE_RECENTLY_SENT: 'SMS_CODE_RECENTLY_SENT',  // 验证码已发送，请稍后再试
} as const

export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES]
