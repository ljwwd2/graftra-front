/**
 * 认证工具类
 * 处理用户登录状态、本地存储和 API 调用
 */

import http from './http'
import type {
  LoginRequest,
  RegisterRequest,
  WeChatLoginRequest,
  AuthResponse,
  UserSession,
  UserInfo,
  AUTH_ENDPOINTS
} from '@/types/auth'

const STORAGE_KEY = 'graftra_user_session'

/**
 * 认证管理类
 */
export class AuthManager {
  /**
   * 邮箱密码登录
   *
   * API 端点: POST /api/auth/login
   */
  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await http.post<AuthResponse>('/api/auth/login', credentials)

      if (response.success && response.data) {
        // 保存会话到本地存储
        const session: UserSession = {
          user: response.data.user,
          token: response.data.token,
          refreshToken: response.data.refreshToken,
          expiresAt: Date.now() + response.data.expiresIn * 1000,
          loginMethod: 'email'
        }
        this.saveSession(session)
      }

      return response
    } catch (error: any) {
      return {
        success: false,
        message: error.message || '登录失败，请稍后重试'
      }
    }
  }

  /**
   * 用户注册
   *
   * API 端点: POST /api/auth/register
   */
  static async register(data: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await http.post<AuthResponse>('/api/auth/register', data)

      if (response.success && response.data) {
        // 保存会话到本地存储
        const session: UserSession = {
          user: response.data.user,
          token: response.data.token,
          refreshToken: response.data.refreshToken,
          expiresAt: Date.now() + response.data.expiresIn * 1000,
          loginMethod: 'email'
        }
        this.saveSession(session)
      }

      return response
    } catch (error: any) {
      return {
        success: false,
        message: error.message || '注册失败，请稍后重试'
      }
    }
  }

  /**
   * 微信登录
   *
   * API 端点: POST /api/auth/wechat
   */
  static async wechatLogin(params: WeChatLoginRequest): Promise<AuthResponse> {
    try {
      const response = await http.post<AuthResponse>('/api/auth/wechat', params)

      if (response.success && response.data) {
        // 保存会话到本地存储
        const session: UserSession = {
          user: response.data.user,
          token: response.data.token,
          refreshToken: response.data.refreshToken,
          expiresAt: Date.now() + response.data.expiresIn * 1000,
          loginMethod: 'wechat'
        }
        this.saveSession(session)
      }

      return response
    } catch (error: any) {
      return {
        success: false,
        message: error.message || '微信登录失败，请稍后重试'
      }
    }
  }

  /**
   * 退出登录
   *
   * API 端点: POST /api/auth/logout
   */
  static async logout(): Promise<{ success: boolean; message?: string }> {
    try {
      await http.post('/api/auth/logout')
    } catch (error) {
      // 即使 API 调用失败，也要清除本地会话
      console.error('Logout API error:', error)
    } finally {
      // 清除本地会话
      this.clearSession()
    }

    return {
      success: true,
      message: '退出成功'
    }
  }

  /**
   * 刷新令牌
   *
   * API 端点: POST /api/auth/refresh
   * 注意：此方法由 HTTP 拦截器自动调用，通常不需要手动调用
   */
  static async refreshSession(): Promise<AuthResponse> {
    try {
      const session = this.getSession()
      if (!session?.refreshToken) {
        throw new Error('No refresh token available')
      }

      const response = await http.post<AuthResponse>('/api/auth/refresh', {
        refreshToken: session.refreshToken
      })

      if (response.success && response.data) {
        // 更新本地会话
        const updatedSession: UserSession = {
          ...session,
          token: response.data.token,
          expiresAt: Date.now() + response.data.expiresIn * 1000
        }
        this.saveSession(updatedSession)
      }

      return response
    } catch (error: any) {
      // 刷新失败，清除会话
      this.clearSession()
      return {
        success: false,
        message: '会话已过期，请重新登录'
      }
    }
  }

  /**
   * 获取当前用户信息
   *
   * API 端点: GET /api/auth/me
   */
  static async getCurrentUser(): Promise<UserInfo | null> {
    try {
      const response = await http.get<{ success: boolean; data: { user: UserInfo } }>('/api/auth/me')

      if (response.success && response.data?.user) {
        return response.data.user
      }

      return null
    } catch (error) {
      console.error('Get current user error:', error)
      return null
    }
  }

  // ==================== 本地存储辅助方法 ====================

  /** 获取当前会话 */
  static getSession(): UserSession | null {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) return null

    try {
      const session = JSON.parse(data) as UserSession

      // 检查是否过期
      if (Date.now() > session.expiresAt) {
        this.clearSession()
        return null
      }

      return session
    } catch (error) {
      console.error('Failed to parse session:', error)
      this.clearSession()
      return null
    }
  }

  /** 保存会话 */
  static saveSession(session: UserSession): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
  }

  /** 清除会话 */
  static clearSession(): void {
    localStorage.removeItem(STORAGE_KEY)
  }

  /** 获取认证令牌 */
  static getToken(): string | null {
    const session = this.getSession()
    return session?.token || null
  }

  /** 检查是否已登录 */
  static isAuthenticated(): boolean {
    return this.getSession() !== null
  }
}

// 导出便捷函数
export const auth = {
  login: (credentials: LoginRequest) => AuthManager.login(credentials),
  register: (data: RegisterRequest) => AuthManager.register(data),
  wechatLogin: (params: WeChatLoginRequest) => AuthManager.wechatLogin(params),
  logout: () => AuthManager.logout(),
  getToken: () => AuthManager.getToken(),
  getSession: () => AuthManager.getSession(),
  isAuthenticated: () => AuthManager.isAuthenticated(),
  getCurrentUser: () => AuthManager.getCurrentUser(),
}
