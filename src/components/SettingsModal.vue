<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="modal-backdrop" @click.self="close">
        <div class="modal-container">
          <!-- Modal Header -->
          <div class="modal-header">
            <h2 class="modal-title">账户设置</h2>
            <button class="modal-close" @click="close" aria-label="关闭">
              <X :size="20" />
            </button>
          </div>

          <!-- Modal Body -->
          <div class="modal-body">
            <!-- Tabs -->
            <div class="settings-tabs">
              <button
                class="settings-tab"
                :class="{ active: activeTab === 'profile' }"
                @click="activeTab = 'profile'"
              >
                <User :size="18" />
                <span>个人资料</span>
              </button>
              <button
                class="settings-tab"
                :class="{ active: activeTab === 'security' }"
                @click="activeTab = 'security'"
              >
                <Shield :size="18" />
                <span>安全设置</span>
              </button>
            </div>

            <!-- Profile Tab -->
            <div v-if="activeTab === 'profile'" class="tab-content">
              <!-- Avatar Selection -->
              <div class="setting-section">
                <div class="setting-label">头像</div>
                <div class="avatar-selection">
                  <!-- Current Avatar Preview -->
                  <div class="current-avatar">
                    <component :is="getAvatarIcon(profileForm.avatar)" :size="48" />
                  </div>
                  <div class="avatar-grid">
                    <button
                      v-for="avatarOption in avatarOptions"
                      :key="avatarOption.name"
                      type="button"
                      class="avatar-option"
                      :class="{ selected: profileForm.avatar === avatarOption.name }"
                      :title="avatarOption.label"
                      @click="selectAvatar(avatarOption.name)"
                    >
                      <component :is="avatarOption.icon" :size="24" />
                    </button>
                  </div>
                </div>
                <p class="setting-hint">选择一个图标作为您的头像</p>
              </div>

              <!-- Name -->
              <div class="setting-section">
                <label class="setting-label" for="name">昵称</label>
                <input
                  id="name"
                  v-model="profileForm.name"
                  type="text"
                  class="setting-input"
                  placeholder="输入昵称"
                  maxlength="50"
                >
              </div>

              <!-- Phone (Read-only) -->
              <div class="setting-section">
                <label class="setting-label">手机号</label>
                <input
                  :value="user?.phone"
                  type="tel"
                  class="setting-input"
                  disabled
                >
                <p class="setting-hint">手机号不可修改</p>
              </div>
            </div>

            <!-- Security Tab -->
            <div v-else class="tab-content">
              <p class="security-notice">修改密码后需要重新登录</p>

              <div class="setting-section">
                <label class="setting-label" for="oldPassword">当前密码</label>
                <div class="password-input">
                  <input
                    id="oldPassword"
                    v-model="passwordForm.oldPassword"
                    :type="showOldPassword ? 'text' : 'password'"
                    class="setting-input"
                    placeholder="输入当前密码"
                    :class="{ 'has-error': errors.oldPassword }"
                  >
                  <button
                    type="button"
                    class="toggle-password"
                    @click="showOldPassword = !showOldPassword"
                  >
                    <Eye :size="18" v-if="!showOldPassword" />
                    <EyeOff :size="18" v-else />
                  </button>
                </div>
                <span v-if="errors.oldPassword" class="error-text">{{ errors.oldPassword }}</span>
              </div>

              <div class="setting-section">
                <label class="setting-label" for="newPassword">新密码</label>
                <div class="password-input">
                  <input
                    id="newPassword"
                    v-model="passwordForm.newPassword"
                    :type="showNewPassword ? 'text' : 'password'"
                    class="setting-input"
                    placeholder="至少8位字符"
                    :class="{ 'has-error': errors.newPassword }"
                  >
                  <button
                    type="button"
                    class="toggle-password"
                    @click="showNewPassword = !showNewPassword"
                  >
                    <Eye :size="18" v-if="!showNewPassword" />
                    <EyeOff :size="18" v-else />
                  </button>
                </div>
                <span v-if="errors.newPassword" class="error-text">{{ errors.newPassword }}</span>
              </div>

              <div class="setting-section">
                <label class="setting-label" for="confirmPassword">确认新密码</label>
                <div class="password-input">
                  <input
                    id="confirmPassword"
                    v-model="passwordForm.confirmPassword"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    class="setting-input"
                    placeholder="再次输入新密码"
                    :class="{ 'has-error': errors.confirmPassword }"
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
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="modal-footer">
            <button type="button" class="btn btn-ghost" @click="close">
              取消
            </button>
            <button
              type="button"
              class="btn btn-primary"
              @click="handleSave"
              :disabled="isLoading"
            >
              <Loader2 v-if="isLoading" :size="18" class="spinner" />
              <span>{{ isLoading ? '保存中...' : '保存' }}</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, markRaw } from 'vue'
import { useRouter } from 'vue-router'
import {
  X, User, Shield, Loader2, Eye, EyeOff,
  Smile, Heart, Star, Sun, Moon, Cloud, Zap, Flame, Feather,
  Flower, Sparkles, Compass, Anchor, Bird, Bug, Cake, Cherry
} from 'lucide-vue-next'
import { auth } from '@/utils/auth'
import { useToast } from '@/composables/useToast'
import type { UserInfo } from '@/types/auth'

interface Props {
  isOpen: boolean
  user: UserInfo | null
}

interface Emits {
  close: []
  updated: [user: UserInfo]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const router = useRouter()
const toast = useToast()

// Avatar options - preset icons from Lucide
const avatarOptions = [
  { name: 'user', label: '用户', icon: markRaw(User) },
  { name: 'smile', label: '微笑', icon: markRaw(Smile) },
  { name: 'heart', label: '爱心', icon: markRaw(Heart) },
  { name: 'star', label: '星星', icon: markRaw(Star) },
  { name: 'sun', label: '太阳', icon: markRaw(Sun) },
  { name: 'moon', label: '月亮', icon: markRaw(Moon) },
  { name: 'cloud', label: '云朵', icon: markRaw(Cloud) },
  { name: 'zap', label: '闪电', icon: markRaw(Zap) },
  { name: 'flame', label: '火焰', icon: markRaw(Flame) },
  { name: 'feather', label: '羽毛', icon: markRaw(Feather) },
  { name: 'flower', label: '花朵', icon: markRaw(Flower) },
  { name: 'sparkles', label: '闪光', icon: markRaw(Sparkles) },
  { name: 'compass', label: '指南针', icon: markRaw(Compass) },
  { name: 'anchor', label: '锚', icon: markRaw(Anchor) },
  { name: 'bird', label: '小鸟', icon: markRaw(Bird) },
  { name: 'bug', label: '虫子', icon: markRaw(Bug) },
  { name: 'cake', label: '蛋糕', icon: markRaw(Cake) },
  { name: 'cherry', label: '樱桃', icon: markRaw(Cherry) },
]

const activeTab = ref<'profile' | 'security'>('profile')
const isLoading = ref(false)

// Profile form - avatar stores icon name
const profileForm = ref({
  name: '',
  avatar: 'user'  // Default avatar icon name
})

// Password form
const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const showOldPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

const errors = ref<Record<string, string>>({})

// Get avatar icon component by name
const getAvatarIcon = (iconName: string | null | undefined) => {
  const option = avatarOptions.find(opt => opt.name === iconName)
  return option?.icon || User
}

// Select avatar
const selectAvatar = (iconName: string) => {
  profileForm.value.avatar = iconName
}

// Initialize form when user changes
watch(() => props.user, (newUser) => {
  if (newUser) {
    profileForm.value.name = newUser.name || ''
    // avatar field stores icon name
    profileForm.value.avatar = newUser.avatar || 'user'
  }
}, { immediate: true })

// Reset password errors when switching tabs
watch(activeTab, () => {
  errors.value = {}
})

const close = () => {
  emit('close')
  // Reset forms
  passwordForm.value = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
  errors.value = {}
}

const validatePasswordForm = () => {
  errors.value = {}

  if (!passwordForm.value.oldPassword) {
    errors.value.oldPassword = '请输入当前密码'
    return false
  }

  if (!passwordForm.value.newPassword) {
    errors.value.newPassword = '请输入新密码'
    return false
  }

  if (passwordForm.value.newPassword.length < 8) {
    errors.value.newPassword = '密码至少需要8个字符'
    return false
  }

  if (passwordForm.value.newPassword === passwordForm.value.oldPassword) {
    errors.value.newPassword = '新密码不能与当前密码相同'
    return false
  }

  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    errors.value.confirmPassword = '两次输入的密码不一致'
    return false
  }

  return true
}

const handleSave = async () => {
  if (activeTab.value === 'profile') {
    // Save profile
    isLoading.value = true

    try {
      const updateData: { name?: string; avatar?: string } = {}

      // Only send changed fields
      if (profileForm.value.name !== props.user?.name) {
        updateData.name = profileForm.value.name
      }

      if (profileForm.value.avatar !== props.user?.avatar) {
        updateData.avatar = profileForm.value.avatar
      }

      // Check if anything changed
      if (Object.keys(updateData).length === 0) {
        toast.info('没有需要保存的更改')
        return
      }

      const result = await auth.updateUser(updateData)

      if (result.success) {
        toast.success('保存成功')
        emit('updated', result.data!)
        close()
      } else {
        const errorCode = result.error?.code
        if (errorCode === 'VALIDATION_ERROR') {
          toast.error(result.message || '参数验证失败')
        } else {
          toast.error(result.message || '保存失败，请稍后重试')
        }
      }
    } catch (error) {
      console.error('Update error:', error)
      toast.error('保存失败，请稍后重试')
    } finally {
      isLoading.value = false
    }
  } else {
    // Save password
    if (!validatePasswordForm()) {
      return
    }

    isLoading.value = true

    try {
      const result = await auth.changePassword({
        oldPassword: passwordForm.value.oldPassword,
        newPassword: passwordForm.value.newPassword
      })

      if (result.success) {
        toast.success('密码修改成功，请重新登录')
        // Logout and redirect to login
        await auth.logout()
        router.push('/login')
      } else {
        const errorCode = result.error?.code
        if (errorCode === 'INVALID_OLD_PASSWORD') {
          errors.value.oldPassword = result.message || '当前密码错误'
        } else if (errorCode === 'SAME_PASSWORD') {
          errors.value.newPassword = result.message || '新密码不能与当前密码相同'
        } else if (errorCode === 'VALIDATION_ERROR') {
          toast.error(result.message || '参数验证失败')
        } else {
          toast.error(result.message || '修改密码失败，请稍后重试')
        }
      }
    } catch (error) {
      console.error('Change password error:', error)
      toast.error('修改密码失败，请稍后重试')
    } finally {
      isLoading.value = false
    }
  }
}
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
  max-width: 500px;
  background: white;
  border-radius: 16px;
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
  width: 36px;
  height: 36px;
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
  max-height: 60vh;
  overflow-y: auto;
}

/* Settings Tabs */
.settings-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  background: var(--slate-100);
  padding: 4px;
  border-radius: 10px;
}

.settings-tab {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 16px;
  border: none;
  background: transparent;
  color: var(--text-muted);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.settings-tab:hover {
  color: var(--text);
}

.settings-tab.active {
  background: white;
  color: var(--text);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

/* Tab Content */
.tab-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Setting Section */
.setting-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.setting-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--text);
}

.setting-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid var(--slate-200);
  border-radius: 10px;
  font-size: 15px;
  font-family: inherit;
  transition: all 0.2s ease;
  background: var(--slate-50);
}

.setting-input:focus {
  outline: none;
  border-color: var(--primary);
  background: white;
  box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.1);
}

.setting-input:disabled {
  background: var(--slate-100);
  color: var(--text-muted);
  cursor: not-allowed;
}

.setting-input.has-error {
  border-color: #ef4444;
}

.setting-hint {
  font-size: 13px;
  color: var(--text-muted);
  margin: 0;
}

.error-text {
  font-size: 13px;
  color: #ef4444;
}

/* Avatar Selection */
.avatar-selection {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.current-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.current-avatar :deep(svg) {
  color: white;
}

.current-avatar :deep([stroke]) {
  stroke: white;
}

.avatar-grid {
  display: grid;
  grid-template-columns: repeat(9, 1fr);
  gap: 8px;
}

.avatar-option {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: var(--slate-100);
  border: 2px solid transparent;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.avatar-option:hover {
  background: var(--slate-200);
  color: var(--text);
  transform: scale(1.1);
}

.avatar-option.selected {
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  border-color: var(--primary);
  color: white;
  transform: scale(1.1);
}

.avatar-option.selected :deep(svg) {
  color: white;
}

.avatar-option.selected :deep([stroke]) {
  stroke: white;
}

/* Password Input */
.password-input {
  position: relative;
  display: flex;
  align-items: center;
}

.password-input .setting-input {
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

/* Security Notice */
.security-notice {
  padding: 12px 16px;
  background: #fef3c7;
  border: 1px solid #fbbf24;
  border-radius: 8px;
  font-size: 14px;
  color: #92400e;
  margin: 0;
}

/* Modal Footer */
.modal-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding: 20px 24px;
  border-top: 1px solid var(--slate-200);
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(5, 150, 105, 0.3);
}

.btn-ghost {
  background: transparent;
  color: var(--text-muted);
}

.btn-ghost:hover:not(:disabled) {
  background: var(--slate-100);
  color: var(--text);
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

  .avatar-grid {
    grid-template-columns: repeat(6, 1fr);
  }
}
</style>
