<template>
  <div class="login-page">
    <!-- Navigation -->
    <nav class="navbar">
      <RouterLink to="/" class="navbar-logo">
        <Hexagon :size="28" />
        Graftra
      </RouterLink>
      <div class="navbar-actions">
        <span class="nav-text">
          {{ mode === 'signup' ? '已有账号？' : '还没有账号？' }}
        </span>
        <RouterLink
          :to="mode === 'signup' ? '/login' : '/login?mode=signup'"
          class="btn btn-ghost"
        >
          {{ mode === 'signup' ? '登录' : '注册' }}
        </RouterLink>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="login-container">
      <div class="login-grid">
        <!-- Left Side - Brand & Benefits -->
        <div class="brand-section">
          <div class="brand-badge">
            <Sparkles :size="20" />
            AI 智能图表生成
          </div>
          <h1 class="brand-title">
            {{ mode === 'signup' ? '开始创建专业流程图' : '欢迎回来' }}
          </h1>
          <p class="brand-desc">
            {{ mode === 'signup'
              ? '加入 10,000+ 用户，用 AI 将文字一键转换为专业流程图'
              : '继续您的创作，将文字转换为精美的可视化图表'
            }}
          </p>

          <!-- Benefits -->
          <div class="benefits">
            <div class="benefit-item">
              <div class="benefit-icon">
                <Zap :size="24" />
              </div>
              <div class="benefit-content">
                <div class="benefit-title">一键生成</div>
                <div class="benefit-desc">AI 自动识别内容结构，秒级生成</div>
              </div>
            </div>
            <div class="benefit-item">
              <div class="benefit-icon">
                <Palette :size="24" />
              </div>
              <div class="benefit-content">
                <div class="benefit-title">多种样式</div>
                <div class="benefit-desc">简约、商务、科技等多种风格可选</div>
              </div>
            </div>
            <div class="benefit-item">
              <div class="benefit-icon">
                <Download :size="24" />
              </div>
              <div class="benefit-content">
                <div class="benefit-title">导出灵活</div>
                <div class="benefit-desc">支持 PNG、SVG、PDF 多种格式</div>
              </div>
            </div>
          </div>

          <!-- Trust Badge -->
          <div class="trust-badge">
            <Shield :size="16" />
            <span>银行级数据加密，保护您的隐私安全</span>
          </div>
        </div>

        <!-- Right Side - Login Form -->
        <div class="form-section">
          <div class="form-card">
            <div class="form-header">
              <h2 class="form-title">
                {{ mode === 'signup' ? '创建账号' : '登录账号' }}
              </h2>
              <p class="form-subtitle">
                {{ mode === 'signup' ? '免费开始' : '欢迎回来继续创作' }}
              </p>
            </div>

            <!-- Login Method Tabs -->
            <div class="login-tabs">
              <button
                class="login-tab"
                :class="{ active: loginMethod === 'wechat' }"
                @click="loginMethod = 'wechat'"
              >
                <svg class="tab-icon" viewBox="0 0 24 24" fill="#07C160">
                  <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.01-.27-.027-.407-.03zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.969-.982z"/>
                </svg>
                <span>微信登录</span>
              </button>
              <button
                class="login-tab"
                :class="{ active: loginMethod === 'email' }"
                @click="loginMethod = 'email'"
              >
                <Mail :size="18" />
                <span>邮箱登录</span>
              </button>
            </div>

            <!-- WeChat Login Content -->
            <div v-if="loginMethod === 'wechat'" class="login-content">
              <div class="wechat-qr-container">
                <div class="wechat-qr-code">
                  <div class="qr-placeholder">
                    <QrCode :size="160" />
                  </div>
                  <div class="qr-status">扫码{{ mode === 'signup' ? '注册' : '登录' }}</div>
                </div>
                <p class="wechat-tip">打开微信扫一扫，快速{{ mode === 'signup' ? '注册' : '登录' }}</p>
              </div>
            </div>

            <!-- Email Login Content -->
            <div v-else class="login-content email-login-form">

            <!-- Login Form -->
            <form @submit.prevent="handleSubmit" class="login-form">
              <div class="form-group">
                <label for="email">邮箱地址</label>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  class="form-input"
                  placeholder="your@email.com"
                  required
                  :class="{ 'has-error': errors.email }"
                  @blur="validateField('email')"
                >
                <span v-if="errors.email" class="error-text">{{ errors.email }}</span>
              </div>

              <div class="form-group">
                <label for="password">密码</label>
                <div class="password-input">
                  <input
                    id="password"
                    v-model="form.password"
                    :type="showPassword ? 'text' : 'password'"
                    class="form-input"
                    :placeholder="mode === 'signup' ? '至少8位字符' : ''"
                    required
                    :class="{ 'has-error': errors.password }"
                    @blur="validateField('password')"
                  >
                  <button
                    type="button"
                    class="toggle-password"
                    @click="showPassword = !showPassword"
                    :aria-label="showPassword ? '隐藏密码' : '显示密码'"
                  >
                    <Eye :size="20" v-if="!showPassword" />
                    <EyeOff :size="20" v-else />
                  </button>
                </div>
                <span v-if="errors.password" class="error-text">{{ errors.password }}</span>
              </div>

              <div v-if="mode === 'login'" class="form-options">
                <label class="remember-me">
                  <input type="checkbox" v-model="form.remember" checked>
                  <span>记住我</span>
                </label>
                <a href="#" class="forgot-link">忘记密码？</a>
              </div>

              <!-- Terms Checkbox (before submit button for signup) -->
              <div v-if="mode === 'signup'" class="terms-checkbox">
                <label class="terms-label">
                  <input type="checkbox" v-model="form.agreeToTerms" :class="{ 'has-error': errors.agreeToTerms }">
                  <span>我已阅读并同意
                    <a href="#" class="terms-link" @click.prevent>服务条款</a>
                    和
                    <a href="#" class="terms-link" @click.prevent>隐私政策</a>
                  </span>
                </label>
                <span v-if="errors.agreeToTerms" class="error-text terms-error">{{ errors.agreeToTerms }}</span>
              </div>

              <button type="submit" class="submit-btn" :disabled="isLoading">
                <Loader2 v-if="isLoading" :size="20" class="spinner" />
                <span>{{ isLoading ? '处理中...' : (mode === 'signup' ? '创建账号' : '登录') }}</span>
              </button>
            </form>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="footer">
      <p>© 2024 Graftra. All rights reserved.</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink, useRouter, useRoute } from 'vue-router'
import {
  Hexagon, Sparkles, Zap, Palette, Download, Shield, Eye, EyeOff, Loader2, Mail, QrCode
} from 'lucide-vue-next'
import { auth } from '@/utils/auth'
import type { LoginRequest, RegisterRequest } from '@/types/auth'

const router = useRouter()
const route = useRoute()

const mode = computed<'login' | 'signup'>(() => {
  const modeParam = route.query.mode as 'login' | 'signup' | undefined
  return modeParam === 'signup' ? 'signup' : 'login'
})

const loginMethod = ref<'wechat' | 'email'>('wechat')
const isLoading = ref(false)
const showPassword = ref(false)

const form = ref({
  email: '',
  password: '',
  remember: true,
  agreeToTerms: false
})

const errors = ref<{
  email?: string
  password?: string
  agreeToTerms?: string
}>({})

const validateField = (field: 'email' | 'password' | 'agreeToTerms') => {
  switch (field) {
    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!form.value.email.trim()) {
        errors.value.email = '请输入邮箱地址'
        return false
      }
      if (!emailRegex.test(form.value.email)) {
        errors.value.email = '请输入有效的邮箱地址'
        return false
      }
      delete errors.value.email
      return true

    case 'password':
      if (!form.value.password) {
        errors.value.password = '请输入密码'
        return false
      }
      if (form.value.password.length < 8) {
        errors.value.password = '密码至少需要8个字符'
        return false
      }
      delete errors.value.password
      return true

    case 'agreeToTerms':
      if (mode.value === 'signup' && !form.value.agreeToTerms) {
        errors.value.agreeToTerms = '请阅读并同意服务条款和隐私政策'
        return false
      }
      delete errors.value.agreeToTerms
      return true
  }
}

const handleSubmit = async () => {
  // Validate all fields
  if (mode.value === 'signup') {
    validateField('agreeToTerms')
  }
  validateField('email')
  validateField('password')

  if (Object.keys(errors.value).length > 0) {
    return
  }

  isLoading.value = true

  try {
    if (mode.value === 'signup') {
      // 注册
      const registerData: RegisterRequest = {
        email: form.value.email,
        password: form.value.password,
        agreeToTerms: form.value.agreeToTerms
      }
      const result = await auth.register(registerData)

      if (!result.success) {
        errors.value.email = result.message || '注册失败'
        return
      }
    } else {
      // 登录
      const credentials: LoginRequest = {
        email: form.value.email,
        password: form.value.password,
        remember: form.value.remember
      }
      const result = await auth.login(credentials)

      if (!result.success) {
        errors.value.password = result.message || '登录失败'
        return
      }
    }

    // 登录/注册成功，跳转到应用页面
    router.push('/app')
  } finally {
    isLoading.value = false
  }
}

const socialLogin = async (provider: 'wechat') => {
  try {
    // TODO: 实际生产环境需要跳转到微信 OAuth 授权页面
    // const authUrl = `https://open.weixin.qq.com/connect/qrconnect?...`
    // window.location.href = authUrl

    // 临时实现：模拟微信登录
    const result = await auth.wechatLogin({ code: 'mock_code' })

    if (result.success) {
      router.push('/app')
    }
  } catch (error) {
    console.error('WeChat login error:', error)
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, var(--bg) 0%, var(--primary-50) 100%);
}

/* Navigation */
.navbar {
  padding: 20px 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(5, 150, 105, 0.1);
}

.navbar-logo {
  font-size: 24px;
  font-weight: 800;
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
}

.navbar :deep(.navbar-logo) svg {
  color: var(--primary);
}

.navbar-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.nav-text {
  font-size: 14px;
  color: var(--text-muted);
}

/* Main Content */
.login-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 60px;
}

.login-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

/* Brand Section */
.brand-section {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.brand-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(5, 150, 105, 0.1);
  border: 1px solid rgba(5, 150, 105, 0.2);
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  color: var(--primary);
  margin-bottom: 24px;
}

.brand-title {
  font-size: 48px;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin-bottom: 16px;
  color: var(--text);
}

.brand-desc {
  font-size: 18px;
  color: var(--text-muted);
  margin-bottom: 40px;
  line-height: 1.6;
}

.benefits {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 40px;
}

.benefit-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.benefit-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.benefit-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 4px;
}

.benefit-desc {
  font-size: 14px;
  color: var(--text-muted);
}

.trust-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: rgba(5, 150, 105, 0.05);
  border: 1px solid rgba(5, 150, 105, 0.15);
  border-radius: 12px;
  font-size: 13px;
  color: var(--primary);
}

/* Form Section */
.form-section {
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-card {
  width: 100%;
  max-width: 440px;
  background: white;
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 8px 32px rgba(5, 150, 105, 0.1);
}

.form-header {
  text-align: center;
  margin-bottom: 28px;
}

.form-title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 8px;
  color: var(--text);
}

.form-subtitle {
  font-size: 15px;
  color: var(--text-muted);
}

/* Login Method Tabs */
.login-tabs {
  display: flex;
  background: var(--slate-100);
  border-radius: 12px;
  padding: 4px;
  margin-bottom: 28px;
  gap: 4px;
}

.login-tab {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  color: var(--text-muted);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.25s ease;
}

.login-tab:hover {
  color: var(--text);
}

.login-tab.active {
  background: white;
  color: var(--text);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.tab-icon {
  width: 18px;
  height: 18px;
}

.login-tab :deep(.tab-icon) {
  color: #07C160;
}

.login-tab :deep(svg) {
  width: 18px;
  height: 18px;
}

/* Login Content */
.login-content {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* WeChat QR Code */
.wechat-qr-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 0;
}

.wechat-qr-code {
  position: relative;
  margin-bottom: 16px;
}

.qr-placeholder {
  width: 180px;
  height: 180px;
  border-radius: 16px;
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  border: 2px dashed #86efac;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qr-placeholder :deep(svg) {
  color: #059669;
  width: 100px;
  height: 100px;
  opacity: 0.5;
}

.qr-status {
  position: absolute;
  bottom: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  color: var(--primary);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  white-space: nowrap;
}

.wechat-tip {
  font-size: 14px;
  color: var(--text-muted);
  text-align: center;
  margin: 0;
}

/* Email Login Form */
.email-login-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

/* Form */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-size: 14px;
  font-weight: 600;
  color: var(--text);
}

.form-input {
  width: 100%;
  padding: 14px 16px;
  border: 2px solid var(--slate-200);
  border-radius: 10px;
  font-size: 15px;
  font-family: inherit;
  transition: all 0.2s ease;
  background: var(--slate-50);
}

.form-input:focus {
  outline: none;
  border-color: var(--primary);
  background: white;
  box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.1);
}

.form-input.has-error {
  border-color: #ef4444;
}

.error-text {
  font-size: 13px;
  color: #ef4444;
}

.password-input {
  position: relative;
  display: flex;
  align-items: center;
}

.password-input .form-input {
  padding-right: 48px;
}

.toggle-password {
  position: absolute;
  right: 8px;
  width: 36px;
  height: 36px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
}

.toggle-password:hover {
  color: var(--text);
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--text);
  cursor: pointer;
}

.remember-me input {
  width: 16px;
  height: 16px;
  accent-color: var(--primary);
}

.forgot-link {
  font-size: 14px;
  color: var(--primary);
  text-decoration: none;
  transition: color 0.2s ease;
}

.forgot-link:hover {
  color: var(--primary-700);
}

.submit-btn {
  width: 100%;
  padding: 14px 24px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  color: white;
  font-size: 16px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(5, 150, 105, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 4px;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(5, 150, 105, 0.35);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.terms-checkbox {
  margin-top: 8px;
  margin-bottom: 16px;
  padding: 12px;
  background: var(--slate-50);
  border-radius: 8px;
}

.terms-label {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 13px;
  color: var(--text-muted);
  cursor: pointer;
  user-select: none;
}

.terms-label input[type="checkbox"] {
  width: 16px;
  height: 16px;
  margin-top: 2px;
  accent-color: var(--primary);
  flex-shrink: 0;
  cursor: pointer;
}

.terms-label input[type="checkbox"].has-error {
  outline: 2px solid #ef4444;
  outline-offset: 1px;
}

.terms-label span {
  line-height: 1.5;
}

.terms-error {
  display: block;
  margin-top: 4px;
  margin-left: 28px;
}

.terms-link {
  color: var(--primary);
  text-decoration: none;
}

.terms-link:hover {
  text-decoration: underline;
}

/* Footer */
.footer {
  padding: 20px 60px;
  text-align: center;
  border-top: 1px solid rgba(5, 150, 105, 0.1);
}

.footer p {
  font-size: 14px;
  color: var(--text-muted);
}

/* Responsive */
@media (max-width: 1024px) {
  .login-grid {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .brand-section {
    text-align: center;
  }

  .benefits {
    align-items: center;
  }

  .brand-title {
    font-size: 36px;
  }
}

@media (max-width: 768px) {
  .navbar {
    padding: 16px 20px;
  }

  .login-container {
    padding: 24px 20px;
  }

  .brand-title {
    font-size: 32px;
  }

  .form-card {
    padding: 32px 24px;
  }

  .social-login {
    gap: 8px;
  }

  .social-btn span {
    font-size: 14px;
  }
}
</style>
