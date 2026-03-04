<template>
  <div class="login-page">
    <!-- Navigation -->
    <nav class="navbar">
      <RouterLink to="/" class="navbar-logo">
        <Hexagon :size="28" />
        Graftra
      </RouterLink>
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
                class="login-tab wechat-tab"
                :class="{ active: loginMethod === 'wechat' }"
                @click="handleWechatClick"
              >
                <svg class="tab-icon" viewBox="0 0 24 24" fill="#07C160">
                  <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.01-.27-.027-.407-.03zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.969-.982z"/>
                </svg>
                <span>微信登录</span>
                <span class="coming-soon-badge">暂不支持</span>
              </button>
              <button
                class="login-tab"
                :class="{ active: loginMethod === 'email' }"
                @click="loginMethod = 'email'"
              >
                <Mail :size="18" />
                <span>手机号登录</span>
              </button>
            </div>

            <!-- WeChat Login Content -->
            <div v-if="loginMethod === 'wechat'" class="login-content">
              <div class="wechat-qr-container">
                <div class="wechat-qr-code">
                  <div class="qr-placeholder coming-soon">
                    <Lock :size="48" />
                  </div>
                  <div class="qr-status">微信登录功能开发中</div>
                </div>
                <p class="wechat-tip">敬请期待，请使用手机号登录</p>
              </div>
            </div>

            <!-- Phone Login Content -->
            <div v-else class="login-content phone-login-form">

            <!-- Login Form -->
            <form @submit.prevent="handleSubmit" class="login-form">
              <div class="form-group">
                <label for="phone">手机号</label>
                <input
                  id="phone"
                  v-model="form.phone"
                  type="tel"
                  class="form-input"
                  placeholder="请输入11位手机号"
                  required
                  maxlength="11"
                  :class="{ 'has-error': errors.phone }"
                  @blur="validateField('phone')"
                >
                <span v-if="errors.phone" class="error-text">{{ errors.phone }}</span>
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

              <!-- Confirm Password (only for signup) -->
              <div v-show="mode === 'signup'" class="form-group">
                <label for="confirmPassword">确认密码</label>
                <div class="password-input">
                  <input
                    id="confirmPassword"
                    v-model="form.confirmPassword"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    class="form-input"
                    placeholder="再次输入密码"
                    :required="mode === 'signup'"
                    :class="{ 'has-error': errors.confirmPassword }"
                    @blur="validateField('confirmPassword')"
                  >
                  <button
                    type="button"
                    class="toggle-password"
                    @click="showConfirmPassword = !showConfirmPassword"
                    :aria-label="showConfirmPassword ? '隐藏密码' : '显示密码'"
                  >
                    <Eye :size="20" v-if="!showConfirmPassword" />
                    <EyeOff :size="20" v-else />
                  </button>
                </div>
                <span v-if="errors.confirmPassword" class="error-text">{{ errors.confirmPassword }}</span>
              </div>

              <!-- SMS Code (only for signup) -->
              <div v-show="mode === 'signup'" class="form-group">
                <label for="smsCode">短信验证码</label>
                <div class="sms-input">
                  <input
                    id="smsCode"
                    v-model="form.smsCode"
                    type="text"
                    class="form-input sms-field"
                    placeholder="6位验证码"
                    :required="mode === 'signup'"
                    :class="{ 'has-error': errors.smsCode }"
                    @blur="validateField('smsCode')"
                    maxlength="6"
                  >
                  <button
                    type="button"
                    class="sms-send-btn"
                    @click="handleSendSms"
                    :disabled="smsCountdown > 0"
                  >
                    {{ smsCountdown > 0 ? `${smsCountdown}秒后重发` : '发送验证码' }}
                  </button>
                </div>
                <span v-if="errors.smsCode" class="error-text">{{ errors.smsCode }}</span>
              </div>

              <!-- CAPTCHA (for both login and signup) -->
              <div class="form-group">
                <label for="captcha">验证码</label>
                <div class="captcha-input">
                  <input
                    id="captcha"
                    v-model="form.captcha"
                    type="text"
                    class="form-input captcha-field"
                    placeholder="输入验证码"
                    required
                    :class="{ 'has-error': errors.captcha }"
                    @blur="validateField('captcha')"
                    maxlength="4"
                  >
                  <!-- 验证码图片 -->
                  <div
                    class="captcha-image-wrapper"
                    v-show="captchaImage"
                    @click="refreshCaptcha"
                    title="点击刷新验证码"
                  >
                    <img
                      :src="captchaImage"
                      alt="验证码"
                      class="captcha-img"
                    >
                  </div>
                  <!-- 加载状态 -->
                  <div
                    class="captcha-loading"
                    v-show="!captchaImage"
                  >
                    <Loader2 :size="20" class="spinner" />
                  </div>
                  <button
                    type="button"
                    class="captcha-refresh-btn"
                    @click="refreshCaptcha"
                    title="刷新验证码"
                  >
                    <RefreshCw :size="16" />
                  </button>
                </div>
                <span v-if="errors.captcha" class="error-text">{{ errors.captcha }}</span>
              </div>

              <div v-if="mode === 'login'" class="form-options">
                <label class="remember-me">
                  <input type="checkbox" v-model="form.remember" checked>
                  <span>记住我</span>
                </label>
                <a href="#" class="forgot-link" @click.prevent="isForgotPasswordOpen = true">忘记密码？</a>
              </div>

              <!-- Mode Toggle Link (above submit button) -->
              <div v-if="mode === 'login'" class="mode-toggle">
                <span class="mode-text">还没有账号？</span>
                <RouterLink
                  to="/login?mode=signup"
                  class="mode-link"
                >
                  立即注册
                </RouterLink>
              </div>

              <div v-else class="mode-toggle">
                <span class="mode-text">已有账号？</span>
                <RouterLink
                  to="/login"
                  class="mode-link"
                >
                  立即登录
                </RouterLink>
              </div>

              <!-- Terms Checkbox (before submit button for signup) -->
              <div v-show="mode === 'signup'" class="terms-checkbox">
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

    <!-- Forgot Password Modal -->
    <ForgotPasswordModal
      :is-open="isForgotPasswordOpen"
      @close="isForgotPasswordOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { RouterLink, useRouter, useRoute } from 'vue-router'
import {
  Hexagon, Sparkles, Zap, Palette, Download, Shield, Eye, EyeOff, Loader2, Mail, QrCode, RefreshCw, Lock
} from 'lucide-vue-next'
import { auth } from '@/utils/auth'
import ForgotPasswordModal from '@/components/ForgotPasswordModal.vue'
import type { LoginRequest, RegisterRequest } from '@/types/auth'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const route = useRoute()
const toast = useToast()

// Forgot password modal state
const isForgotPasswordOpen = ref(false)

const mode = computed<'login' | 'signup'>(() => {
  const modeParam = route.query.mode as 'login' | 'signup' | undefined
  return modeParam === 'signup' ? 'signup' : 'login'
})

// 登录模式默认手机号登录，注册模式也默认手机号登录
const loginMethod = ref<'wechat' | 'email'>('email')
const isLoading = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)

// CAPTCHA - 使用后端API
// 登录和注册都需要验证码
const captchaId = ref('')              // 后端返回的验证码ID
const captchaImage = ref('')           // 后端返回的Base64图片

const form = ref({
  phone: '',
  password: '',
  confirmPassword: '',
  remember: true,
  agreeToTerms: false,
  captcha: '',                         // 用户输入的验证码
  smsCode: '',                         // 短信验证码
})

const errors = ref<{
  phone?: string
  password?: string
  confirmPassword?: string
  captcha?: string
  smsCode?: string
  agreeToTerms?: string
}>({})

// SMS countdown state
const smsCountdown = ref(0)
let smsTimer: ReturnType<typeof setInterval> | null = null

const validateField = (field: 'phone' | 'password' | 'confirmPassword' | 'captcha' | 'smsCode' | 'agreeToTerms') => {
  switch (field) {
    case 'phone':
      const phoneRegex = /^1[3-9]\d{9}$/
      if (!form.value.phone.trim()) {
        errors.value.phone = '请输入手机号'
        return false
      }
      if (!phoneRegex.test(form.value.phone)) {
        errors.value.phone = '请输入有效的手机号'
        return false
      }
      delete errors.value.phone
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

    case 'confirmPassword':
      if (!form.value.confirmPassword) {
        errors.value.confirmPassword = '请再次输入密码'
        return false
      }
      if (form.value.confirmPassword !== form.value.password) {
        errors.value.confirmPassword = '两次输入的密码不一致'
        return false
      }
      delete errors.value.confirmPassword
      return true

    case 'captcha':
      if (!form.value.captcha.trim()) {
        errors.value.captcha = '请输入验证码'
        return false
      }
      if (form.value.captcha.length !== 4) {
        errors.value.captcha = '请输入4位验证码'
        return false
      }
      delete errors.value.captcha
      return true

    case 'smsCode':
      if (!form.value.smsCode.trim()) {
        errors.value.smsCode = '请输入短信验证码'
        return false
      }
      if (form.value.smsCode.length !== 6) {
        errors.value.smsCode = '请输入6位验证码'
        return false
      }
      delete errors.value.smsCode
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
  if (!validateField('captcha')) {
    return
  }
  if (!validateField('phone')) {
    return
  }
  if (!validateField('password')) {
    return
  }

  // For signup, validate additional fields
  if (mode.value === 'signup') {
    if (!validateField('confirmPassword')) {
      return
    }
    if (!validateField('smsCode')) {
      return
    }
    if (!validateField('agreeToTerms')) {
      return
    }
  }

  if (Object.keys(errors.value).length > 0) {
    return
  }

  isLoading.value = true

  try {
    if (mode.value === 'signup') {
      // 注册
      const registerData: RegisterRequest = {
        phone: form.value.phone,
        password: form.value.password,
        smsCode: form.value.smsCode,
        captchaCode: form.value.captcha,
        captchaId: captchaId.value,
        agreeToTerms: form.value.agreeToTerms
      }
      const result = await auth.register(registerData)

      if (!result.success) {
        const errorCode = result.error?.code
        if (errorCode === 'INVALID_CAPTCHA') {
          errors.value.captcha = result.message || '验证码错误或已过期'
        } else if (errorCode === 'INVALID_SMS_CODE') {
          errors.value.smsCode = result.message || '短信验证码错误或已过期'
        } else if (errorCode === 'PHONE_EXISTS') {
          errors.value.phone = result.message || '该手机号已被注册'
        } else if (errorCode === 'TERMS_NOT_AGREED') {
          errors.value.agreeToTerms = result.message || '必须同意服务条款'
        } else {
          toast.error(result.message || '注册失败，请稍后重试')
        }
        // 任何错误都刷新验证码
        refreshCaptcha()
        return
      }
    } else {
      // 登录 - 验证码通过登录接口传给后端校验
      const credentials: LoginRequest = {
        phone: form.value.phone,
        password: form.value.password,
        captchaCode: form.value.captcha,
        captchaId: captchaId.value,
        remember: form.value.remember
      }
      const result = await auth.login(credentials)

      if (!result.success) {
        const errorCode = result.error?.code
        if (errorCode === 'INVALID_CAPTCHA') {
          errors.value.captcha = result.message || '验证码错误或已过期'
        } else if (errorCode === 'INVALID_CREDENTIALS') {
          errors.value.password = result.message || '手机号或密码错误'
        } else if (errorCode === 'ACCOUNT_LOCKED') {
          toast.error(result.message || '账户已临时锁定，请稍后再试')
        } else {
          toast.error(result.message || '登录失败，请稍后重试')
        }
        // 任何错误都刷新验证码
        refreshCaptcha()
        return
      }
    }

    // 登录/注册成功，跳转到应用页面
    toast.success(mode.value === 'signup' ? '注册成功！' : '登录成功！')
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

const handleWechatClick = () => {
  // 微信登录暂不支持
  toast.info('微信登录功能正在开发中，敬请期待')
}

// Send SMS verification code
const handleSendSms = async () => {
  // Validate phone first
  if (!validateField('phone')) {
    return
  }

  try {
    const result = await auth.sendSms(form.value.phone)

    if (result.success) {
      toast.success('验证码已发送到您的手机，请查收')

      // Start countdown
      smsCountdown.value = 60
      smsTimer = setInterval(() => {
        smsCountdown.value--
        if (smsCountdown.value <= 0) {
          if (smsTimer) {
            clearInterval(smsTimer)
            smsTimer = null
          }
        }
      }, 1000)
    } else {
      const errorCode = result.error?.code
      if (errorCode === 'SMS_CODE_RECENTLY_SENT') {
        toast.error(result.message || '验证码已发送，请稍后再试')
      } else if (errorCode === 'INVALID_PHONE_FORMAT') {
        errors.value.phone = result.message || '手机号格式不正确'
      } else {
        toast.error(result.message || '发送验证码失败，请稍后重试')
      }
    }
  } catch (error) {
    console.error('Send SMS error:', error)
    toast.error('发送验证码失败，请稍后重试')
  }
}

// CAPTCHA - 使用后端API
const refreshCaptcha = async () => {
  try {
    const response = await auth.getCaptcha()
    if (response.success && response.data) {
      captchaId.value = response.data.captchaId
      captchaImage.value = response.data.image
      // 清空用户输入的验证码
      form.value.captcha = ''
      delete errors.value.captcha
    } else {
      toast.error(response.message || '获取验证码失败')
    }
  } catch (error) {
    console.error('Get captcha error:', error)
    toast.error('获取验证码失败，请稍后重试')
  }
}

// Initialize CAPTCHA on mount - always load captcha
onMounted(() => {
  nextTick(() => {
    refreshCaptcha()
  })
})

// Cleanup SMS timer on unmount
onUnmounted(() => {
  if (smsTimer) {
    clearInterval(smsTimer)
    smsTimer = null
  }
})

// Watch for mode changes to refresh captcha
watch(
  mode,
  () => {
    // Always switch to phone tab and refresh captcha when mode changes
    loginMethod.value = 'email'
    nextTick(() => {
      refreshCaptcha()
    })
  }
)

// Watch for loginMethod changes to refresh captcha when switching to phone tab
watch(
  loginMethod,
  (newMethod) => {
    if (newMethod === 'email') {
      nextTick(() => {
        refreshCaptcha()
      })
    }
  }
)
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

/* WeChat Tab - Disabled State */
.login-tab.wechat-tab {
  opacity: 0.6;
  cursor: not-allowed;
  position: relative;
}

.login-tab.wechat-tab:hover {
  background: transparent;
  color: var(--text-muted);
}

.coming-soon-badge {
  position: absolute;
  top: -6px;
  right: -6px;
  background: #f59e0b;
  color: white;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 10px;
  font-weight: 600;
  line-height: 1;
  pointer-events: none;
}

.qr-placeholder.coming-soon {
  background: var(--slate-100);
  border-color: var(--slate-300);
}

.qr-placeholder.coming-soon :deep(svg) {
  color: var(--text-muted);
  opacity: 0.6;
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

/* Phone Login Form */
.phone-login-form {
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

/* CAPTCHA Input */
.captcha-input {
  display: flex;
  gap: 12px;
  align-items: center;
}

.captcha-field {
  flex: 1;
}

/* SMS Input */
.sms-input {
  display: flex;
  gap: 12px;
  align-items: center;
}

.sms-field {
  flex: 1;
}

.sms-send-btn {
  padding: 0 20px;
  height: 48px;
  border: 2px solid var(--primary);
  background: white;
  color: var(--primary);
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  flex-shrink: 0;
}

.sms-send-btn:hover:not(:disabled) {
  background: var(--primary);
  color: white;
}

.sms-send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  border-color: var(--slate-300);
  color: var(--text-muted);
}

.captcha-image-wrapper {
  width: 120px;
  height: 44px;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid var(--slate-200);
  transition: all 0.2s ease;
  flex-shrink: 0;
  position: relative;
}

.captcha-image-wrapper:hover {
  border-color: var(--primary);
}

.captcha-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.captcha-loading {
  width: 120px;
  height: 44px;
  border-radius: 10px;
  background: var(--slate-100);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.captcha-refresh-btn {
  width: 36px;
  height: 44px;
  border: 2px solid var(--slate-200);
  background: white;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.captcha-refresh-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
  background: var(--slate-50);
}

.captcha-refresh-btn:active {
  transform: scale(0.95);
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

.mode-toggle {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  padding: 8px 0;
}

.mode-text {
  font-size: 14px;
  color: var(--text-muted);
}

.mode-link {
  font-size: 14px;
  font-weight: 600;
  color: var(--primary);
  text-decoration: none;
  transition: color 0.2s ease;
}

.mode-link:hover {
  color: var(--primary-700);
  text-decoration: underline;
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
