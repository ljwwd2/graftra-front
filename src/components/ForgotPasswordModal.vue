<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="modal-backdrop" @click.self="close">
        <div class="modal-container" @click.stop>
          <!-- Modal Header -->
          <div class="modal-header">
            <h2 class="modal-title">重置密码</h2>
            <button class="modal-close" @click="close" aria-label="关闭">
              <X :size="20" />
            </button>
          </div>

          <!-- Modal Body -->
          <div class="modal-body">
            <!-- Step Indicator -->
            <div class="step-indicator">
              <div class="step" :class="{ active: step === 1, completed: step > 1 }">
                <div class="step-number">{{ step > 1 ? '✓' : '1' }}</div>
                <div class="step-label">验证手机</div>
              </div>
              <div class="step-line" :class="{ active: step > 1 }"></div>
              <div class="step" :class="{ active: step === 2, completed: step > 2 }">
                <div class="step-number">{{ step > 2 ? '✓' : '2' }}</div>
                <div class="step-label">重置密码</div>
              </div>
              <div class="step-line" :class="{ active: step > 2 }"></div>
              <div class="step" :class="{ active: step === 3 }">
                <div class="step-number">{{ step > 3 ? '✓' : '3' }}</div>
                <div class="step-label">完成</div>
              </div>
            </div>

            <!-- Step 1: Verify Phone -->
            <div v-if="step === 1" class="step-content">
              <form @submit.prevent="handleSendResetSms" class="form">
                <div class="form-group">
                  <label for="reset-phone">手机号</label>
                  <input
                    id="reset-phone"
                    v-model="form.phone"
                    type="tel"
                    class="form-input"
                    placeholder="请输入注册的手机号"
                    required
                    maxlength="11"
                    :class="{ 'has-error': errors.phone }"
                    @blur="validateField('phone')"
                  >
                  <span v-if="errors.phone" class="error-text">{{ errors.phone }}</span>
                </div>

                <button type="submit" class="submit-btn" :disabled="isLoading">
                  <Loader2 v-if="isLoading" :size="18" class="spinner" />
                  <span>{{ isLoading ? '发送中...' : '发送验证码' }}</span>
                </button>
              </form>
            </div>

            <!-- Step 2: Enter SMS Code & New Password -->
            <div v-else-if="step === 2" class="step-content">
              <form @submit.prevent="handleResetPassword" class="form">
                <div class="form-group">
                  <label>手机号</label>
                  <div class="phone-display">{{ form.phone }}</div>
                </div>

                <div class="form-group">
                  <label for="smsCode">短信验证码</label>
                  <div class="sms-input">
                    <input
                      id="smsCode"
                      v-model="form.smsCode"
                      type="text"
                      class="form-input sms-field"
                      placeholder="6位验证码"
                      required
                      :class="{ 'has-error': errors.smsCode }"
                      @blur="validateField('smsCode')"
                      maxlength="6"
                    >
                    <button
                      type="button"
                      class="sms-resend-btn"
                      @click="handleResendSms"
                      :disabled="smsCountdown > 0"
                    >
                      {{ smsCountdown > 0 ? `${smsCountdown}秒` : '重发' }}
                    </button>
                  </div>
                  <span v-if="errors.smsCode" class="error-text">{{ errors.smsCode }}</span>
                </div>

                <div class="form-group">
                  <label for="newPassword">新密码</label>
                  <div class="password-input">
                    <input
                      id="newPassword"
                      v-model="form.newPassword"
                      :type="showPassword ? 'text' : 'password'"
                      class="form-input"
                      placeholder="至少8位字符"
                      required
                      :class="{ 'has-error': errors.newPassword }"
                      @blur="validateField('newPassword')"
                    >
                    <button
                      type="button"
                      class="toggle-password"
                      @click="showPassword = !showPassword"
                    >
                      <Eye :size="18" v-if="!showPassword" />
                      <EyeOff :size="18" v-else />
                    </button>
                  </div>
                  <span v-if="errors.newPassword" class="error-text">{{ errors.newPassword }}</span>
                </div>

                <div class="form-group">
                  <label for="confirmPassword">确认密码</label>
                  <div class="password-input">
                    <input
                      id="confirmPassword"
                      v-model="form.confirmPassword"
                      :type="showConfirmPassword ? 'text' : 'password'"
                      class="form-input"
                      placeholder="再次输入密码"
                      required
                      :class="{ 'has-error': errors.confirmPassword }"
                      @blur="validateField('confirmPassword')"
                    >
                    <button
                      type="button"
                      class="toggle-password"
                      @click="showConfirmPassword = !showConfirmPassword"
                    >
                      <Eye :size="18" v-if="!showConfirmPassword" />
                      <EyeOff :size="18" v-else />
                    </button>
                  </div>
                  <span v-if="errors.confirmPassword" class="error-text">{{ errors.confirmPassword }}</span>
                </div>

                <button type="submit" class="submit-btn" :disabled="isLoading">
                  <Loader2 v-if="isLoading" :size="18" class="spinner" />
                  <span>{{ isLoading ? '重置中...' : '重置密码' }}</span>
                </button>
              </form>

              <button @click="step = 1" class="back-btn">返回上一步</button>
            </div>

            <!-- Step 3: Success -->
            <div v-else-if="step === 3" class="step-content success-content">
              <div class="success-icon">
                <CheckCircle :size="64" />
              </div>
              <h3 class="success-title">密码重置成功！</h3>
              <p class="success-message">请使用新密码登录</p>
              <button @click="close" class="success-btn">返回登录</button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onUnmounted, watch } from 'vue'
import { X, Loader2, Eye, EyeOff, CheckCircle } from 'lucide-vue-next'
import { auth } from '@/utils/auth'
import { useToast } from '@/composables/useToast'

interface Props {
  isOpen: boolean
}

interface Emits {
  close: []
  success: []
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const toast = useToast()

const step = ref(1)
const isLoading = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)

// SMS countdown state
const smsCountdown = ref(0)
let smsTimer: ReturnType<typeof setInterval> | null = null

const form = ref({
  phone: '',
  smsCode: '',
  newPassword: '',
  confirmPassword: ''
})

const errors = ref<{
  phone?: string
  smsCode?: string
  newPassword?: string
  confirmPassword?: string
}>({})

// Reset form when modal opens
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    step.value = 1
    form.value = { phone: '', smsCode: '', newPassword: '', confirmPassword: '' }
    errors.value = {}
  }
})

const close = () => {
  emit('close')
}

const validateField = (field: 'phone' | 'smsCode' | 'newPassword' | 'confirmPassword') => {
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

    case 'newPassword':
      if (!form.value.newPassword) {
        errors.value.newPassword = '请输入新密码'
        return false
      }
      if (form.value.newPassword.length < 8) {
        errors.value.newPassword = '密码至少需要8个字符'
        return false
      }
      delete errors.value.newPassword
      return true

    case 'confirmPassword':
      if (!form.value.confirmPassword) {
        errors.value.confirmPassword = '请再次输入新密码'
        return false
      }
      if (form.value.confirmPassword !== form.value.newPassword) {
        errors.value.confirmPassword = '两次输入的密码不一致'
        return false
      }
      delete errors.value.confirmPassword
      return true
  }
}

const handleSendResetSms = async () => {
  if (!validateField('phone')) return

  isLoading.value = true

  try {
    const result = await auth.sendResetSms(form.value.phone)

    if (result.success) {
      toast.success('验证码已发送')
      step.value = 2

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
      if (errorCode === 'USER_NOT_FOUND') {
        errors.value.phone = result.message || '该手机号未注册'
      } else {
        toast.error(result.message || '发送验证码失败')
      }
    }
  } catch (error) {
    console.error('Send reset SMS error:', error)
    toast.error('发送验证码失败')
  } finally {
    isLoading.value = false
  }
}

const handleResendSms = async () => {
  try {
    const result = await auth.sendResetSms(form.value.phone)

    if (result.success) {
      toast.success('验证码已重新发送')

      // Restart countdown
      smsCountdown.value = 60
      if (smsTimer) clearInterval(smsTimer)
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
      toast.error(result.message || '发送验证码失败')
    }
  } catch (error) {
    console.error('Resend SMS error:', error)
    toast.error('发送验证码失败')
  }
}

const handleResetPassword = async () => {
  if (!validateField('smsCode')) return
  if (!validateField('newPassword')) return
  if (!validateField('confirmPassword')) return

  if (Object.keys(errors.value).length > 0) return

  isLoading.value = true

  try {
    const result = await auth.resetPassword({
      phone: form.value.phone,
      smsCode: form.value.smsCode,
      newPassword: form.value.newPassword
    })

    if (result.success) {
      step.value = 3
      toast.success('密码重置成功')
      emit('success')
    } else {
      const errorCode = result.error?.code
      if (errorCode === 'INVALID_SMS_CODE') {
        errors.value.smsCode = result.message || '验证码错误或已过期'
      } else if (errorCode === 'USER_NOT_FOUND') {
        toast.error(result.message || '用户不存在')
      } else {
        toast.error(result.message || '重置密码失败')
      }
    }
  } catch (error) {
    console.error('Reset password error:', error)
    toast.error('重置密码失败')
  } finally {
    isLoading.value = false
  }
}

onUnmounted(() => {
  if (smsTimer) {
    clearInterval(smsTimer)
    smsTimer = null
  }
})
</script>

<style scoped>
/* Modal Backdrop */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

/* Modal Container */
.modal-container {
  width: 100%;
  max-width: 440px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

/* Modal Header */
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--slate-200);
}

.modal-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--text);
  margin: 0;
}

.modal-close {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background: var(--slate-100);
  color: var(--text);
}

/* Modal Body */
.modal-body {
  padding: 24px;
}

/* Step Indicator */
.step-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  gap: 4px;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.step-number {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--slate-200);
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.step.active .step-number {
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  color: white;
}

.step.completed .step-number {
  background: var(--primary);
  color: white;
}

.step-label {
  font-size: 11px;
  color: var(--text-muted);
}

.step.active .step-label {
  color: var(--primary);
  font-weight: 600;
}

.step-line {
  width: 40px;
  height: 2px;
  background: var(--slate-200);
  transition: all 0.3s ease;
}

.step-line.active {
  background: var(--primary);
}

/* Step Content */
.step-content {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Form */
.form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.form-group label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text);
}

.form-input {
  width: 100%;
  padding: 12px 14px;
  border: 2px solid var(--slate-200);
  border-radius: 10px;
  font-size: 14px;
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

.phone-display {
  padding: 12px 14px;
  border: 2px solid var(--slate-200);
  border-radius: 10px;
  font-size: 14px;
  color: var(--text-muted);
  background: var(--slate-100);
}

.error-text {
  font-size: 12px;
  color: #ef4444;
}

/* Password Input */
.password-input {
  position: relative;
  display: flex;
  align-items: center;
}

.password-input .form-input {
  padding-right: 44px;
}

.toggle-password {
  position: absolute;
  right: 6px;
  width: 32px;
  height: 32px;
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

/* SMS Input */
.sms-input {
  display: flex;
  gap: 8px;
  align-items: center;
}

.sms-field {
  flex: 1;
}

.sms-resend-btn {
  padding: 0 16px;
  height: 46px;
  border: 2px solid var(--primary);
  background: white;
  color: var(--primary);
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  flex-shrink: 0;
}

.sms-resend-btn:hover:not(:disabled) {
  background: var(--primary);
  color: white;
}

.sms-resend-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  border-color: var(--slate-300);
  color: var(--text-muted);
}

/* Buttons */
.submit-btn {
  width: 100%;
  padding: 12px 20px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  color: white;
  font-size: 15px;
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
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(5, 150, 105, 0.35);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.back-btn {
  width: 100%;
  padding: 10px;
  margin-top: 12px;
  font-size: 14px;
  color: var(--primary);
  background: none;
  border: none;
  cursor: pointer;
  font-weight: 600;
}

.back-btn:hover {
  text-decoration: underline;
}

/* Success Content */
.success-content {
  text-align: center;
  padding: 16px 0;
}

.success-icon {
  color: var(--primary);
  margin-bottom: 16px;
}

.success-title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 8px;
  color: var(--text);
}

.success-message {
  font-size: 14px;
  color: var(--text-muted);
  margin-bottom: 24px;
}

.success-btn {
  width: 100%;
  padding: 12px 20px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  color: white;
  font-size: 15px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(5, 150, 105, 0.25);
}

.success-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(5, 150, 105, 0.35);
}

.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Modal Animations */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.95);
}

/* Responsive */
@media (max-width: 640px) {
  .modal-container {
    margin: 0;
    max-width: 100%;
    border-radius: 16px 16px 0 0;
    margin-top: auto;
  }

  .modal-backdrop {
    align-items: flex-end;
    padding: 0;
  }

  .sms-input {
    flex-direction: column;
    align-items: stretch;
  }

  .sms-resend-btn {
    width: 100%;
  }
}
</style>
