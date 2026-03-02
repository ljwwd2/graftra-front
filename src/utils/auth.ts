/**
 * 认证工具类
 * 处理用户登录状态、本地存储和 API 调用
 */

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
 *
 * TODO: 后续接入后端 API 时，修改以下方法：
 * - login(): 调用 AUTH_ENDPOINTS.LOGIN
 * - register(): 调用 AUTH_ENDPOINTS.REGISTER
 * - wechatLogin(): 调用 AUTH_ENDPOINTS.WECHAT_LOGIN
 * - logout(): 调用 AUTH_ENDPOINTS.LOGOUT
 * - refreshSession(): 调用 AUTH_ENDPOINTS.REFRESH
 * - getCurrentUser(): 调用 AUTH_ENDPOINTS.ME
 */
export class AuthManager {
  /**
   * 邮箱密码登录
   *
   * API 端点: POST /api/auth/login
   * 请求体: { email: string, password: string, remember?: boolean }
   * 响应: AuthResponse
   */
  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    // TODO: 替换为实际 API 调用
    // const response = await fetch(AUTH_ENDPOINTS.LOGIN, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(credentials)
    // })
    // return await response.json()

    // === 临时实现：本地存储 ===
    // 模拟 API 延迟
    await new Promise(resolve => setTimeout(resolve, 500))

    // 检查用户是否存在于本地存储
    const users = this.getLocalUsers()
    const user = users.find(u => u.email === credentials.email && u.password === credentials.password)

    if (!user) {
      return {
        success: false,
        message: '邮箱或密码错误'
      }
    }

    // 创建会话
    const session = this.createSession(user, 'email')
    this.saveSession(session)

    return {
      success: true,
      data: {
        user: session.user,
        token: session.token,
        expiresIn: 7 * 24 * 60 * 60 // 7天
      }
    }
  }

  /**
   * 用户注册
   *
   * API 端点: POST /api/auth/register
   * 请求体: { name: string, email: string, password: string, agreeToTerms: boolean }
   * 响应: AuthResponse
   */
  static async register(data: RegisterRequest): Promise<AuthResponse> {
    // TODO: 替换为实际 API 调用
    // const response = await fetch(AUTH_ENDPOINTS.REGISTER, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data)
    // })
    // return await response.json()

    // === 临时实现：本地存储 ===
    await new Promise(resolve => setTimeout(resolve, 500))

    // 检查邮箱是否已注册
    const users = this.getLocalUsers()
    if (users.find(u => u.email === data.email)) {
      return {
        success: false,
        message: '该邮箱已被注册'
      }
    }

    // 创建新用户
    const newUser = {
      id: `user_${Date.now()}`,
      name: data.name,
      email: data.email,
      password: data.password,
      createdAt: new Date().toISOString()
    }

    // 保存到本地
    users.push(newUser)
    localStorage.setItem('graftra_users', JSON.stringify(users))

    // 创建会话
    const session = this.createSession(newUser, 'email')
    this.saveSession(session)

    return {
      success: true,
      data: {
        user: session.user,
        token: session.token,
        expiresIn: 7 * 24 * 60 * 60 // 7天
      }
    }
  }

  /**
   * 微信登录
   *
   * API 端点: POST /api/auth/wechat
   * 请求体: { code: string, state?: string }
   * 响应: AuthResponse
   */
  static async wechatLogin(params: WeChatLoginRequest): Promise<AuthResponse> {
    // TODO: 替换为实际 API 调用
    // const response = await fetch(AUTH_ENDPOINTS.WECHAT_LOGIN, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(params)
    // })
    // return await response.json()

    // === 临时实现：模拟微信登录 ===
    await new Promise(resolve => setTimeout(resolve, 500))

    // 模拟微信用户
    const mockUser = {
      id: `wechat_${Date.now()}`,
      name: '微信用户',
      email: `wechat_${Date.now()}@example.com`,
      createdAt: new Date().toISOString()
    }

    const session = this.createSession(mockUser, 'wechat')
    this.saveSession(session)

    return {
      success: true,
      data: {
        user: session.user,
        token: session.token,
        expiresIn: 7 * 24 * 60 * 60
      }
    }
  }

  /**
   * 退出登录
   *
   * API 端点: POST /api/auth/logout
   * 请求头: Authorization: Bearer {token}
   * 响应: { success: boolean, message?: string }
   */
  static async logout(): Promise<{ success: boolean; message?: string }> {
    // TODO: 替换为实际 API 调用
    // const token = this.getToken()
    // if (token) {
    //   await fetch(AUTH_ENDPOINTS.LOGOUT, {
    //     method: 'POST',
    //     headers: {
    //       'Authorization': `Bearer ${token}`
    //     }
    //   })
    // }

    // === 清除本地会话 ===
    this.clearSession()

    return {
      success: true,
      message: '退出成功'
    }
  }

  /**
   * 刷新令牌
   *
   * API 端点: POST /api/auth/refresh
   * 请求体: { refreshToken: string }
   * 响应: AuthResponse
   */
  static async refreshSession(): Promise<AuthResponse> {
    // TODO: 替换为实际 API 调用
    // const session = this.getSession()
    // if (!session?.refreshToken) {
    //   throw new Error('No refresh token')
    // }
    // const response = await fetch(AUTH_ENDPOINTS.REFRESH, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ refreshToken: session.refreshToken })
    // })
    // return await response.json()

    // === 临时实现 ===
    return {
      success: true,
      data: {
        user: this.getSession()?.user!,
        token: this.getToken()!,
        expiresIn: 7 * 24 * 60 * 60
      }
    }
  }

  /**
   * 获取当前用户信息
   *
   * API 端点: GET /api/auth/me
   * 请求头: Authorization: Bearer {token}
   * 响应: { success: boolean, data: { user: UserInfo } }
   */
  static async getCurrentUser(): Promise<UserInfo | null> {
    // TODO: 替换为实际 API 调用
    // const token = this.getToken()
    // if (!token) return null
    // const response = await fetch(AUTH_ENDPOINTS.ME, {
    //   headers: {
    //     'Authorization': `Bearer ${token}`
    //   }
    // })
    // const result = await response.json()
    // return result.success ? result.data.user : null

    // === 临时实现：从本地获取 ===
    const session = this.getSession()
    return session?.user || null
  }

  // ==================== 本地存储辅助方法 ====================

  /** 获取当前会话 */
  static getSession(): UserSession | null {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) return null

    const session = JSON.parse(data) as UserSession

    // 检查是否过期
    if (Date.now() > session.expiresAt) {
      this.clearSession()
      return null
    }

    return session
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

  /** 创建新会话（临时实现） */
  private static createSession(user: any, method: 'email' | 'wechat'): UserSession {
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      },
      token: `token_${Date.now()}_${Math.random().toString(36).substring(2)}`,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7天后过期
      loginMethod: method
    }
  }

  /** 获取本地注册的用户列表（临时实现） */
  private static getLocalUsers(): any[] {
    const data = localStorage.getItem('graftra_users')
    return data ? JSON.parse(data) : []
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
