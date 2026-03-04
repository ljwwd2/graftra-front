<template>
  <!-- Settings Modal - must be outside the v-if/v-else block -->
  <SettingsModal
    :is-open="isSettingsOpen"
    :user="user"
    @close="isSettingsOpen = false"
    @updated="handleUserUpdated"
  />

  <div v-if="user" class="user-menu">
    <button
      class="user-trigger"
      @click="isOpen = !isOpen"
      :class="{ active: isOpen }"
    >
      <div class="user-avatar">
        <component :is="getAvatarIcon(user.avatar)" :size="18" />
      </div>
      <span class="user-name">{{ displayName }}</span>
      <ChevronDown :size="16" :class="{ 'rotate': isOpen }" />
    </button>

    <Transition name="dropdown">
      <div v-if="isOpen" class="user-dropdown">
        <div class="dropdown-header">
          <div class="user-info">
            <div class="user-info-name">{{ displayName }}</div>
            <div class="user-info-phone">{{ user.phone }}</div>
          </div>
        </div>

        <div class="dropdown-divider"></div>

        <button class="dropdown-item" @click="openSettings">
          <Settings :size="18" />
          <span>账户设置</span>
        </button>
        <a href="#" class="dropdown-item" @click.prevent>
          <HelpCircle :size="18" />
          <span>帮助中心</span>
        </a>

        <div class="dropdown-divider"></div>

        <button class="dropdown-item logout" @click="handleLogout">
          <LogOut :size="18" />
          <span>退出登录</span>
        </button>
      </div>
    </Transition>

    <div v-if="isOpen" class="dropdown-backdrop" @click="isOpen = false"></div>
  </div>

  <!-- 未登录状态：显示登录按钮 -->
  <RouterLink v-else to="/login" class="btn btn-ghost">
    <User :size="16" />
    登录
  </RouterLink>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import {
  User, ChevronDown, Settings, HelpCircle, LogOut,
  Smile, Heart, Star, Sun, Moon, Cloud, Zap, Flame, Feather,
  Flower, Sparkles, Compass, Anchor, Bird, Bug, Cake, Cherry
} from 'lucide-vue-next'
import { auth } from '@/utils/auth'
import SettingsModal from './SettingsModal.vue'
import type { UserInfo } from '@/types/auth'

// Avatar icon mapping
const avatarIcons: Record<string, any> = {
  user: User,
  smile: Smile,
  heart: Heart,
  star: Star,
  sun: Sun,
  moon: Moon,
  cloud: Cloud,
  zap: Zap,
  flame: Flame,
  feather: Feather,
  flower: Flower,
  sparkles: Sparkles,
  compass: Compass,
  anchor: Anchor,
  bird: Bird,
  bug: Bug,
  cake: Cake,
  cherry: Cherry,
}

const router = useRouter()

const isOpen = ref(false)
const isSettingsOpen = ref(false)
const user = ref<UserInfo | null>(null)

// Display name: use name if available, otherwise use phone
const displayName = computed(() => {
  if (!user.value) return ''
  return user.value.name || user.value.phone
})

// Get avatar icon component by name
const getAvatarIcon = (iconName: string | null | undefined) => {
  if (!iconName) return User
  return avatarIcons[iconName] || User
}

// Update user state from local session
const updateUserState = () => {
  const session = auth.getSession()
  user.value = session?.user || null
}

onMounted(updateUserState)

// Watch for route changes to update user state (e.g., after login/logout)
watch(() => router.currentRoute.value, () => {
  updateUserState()
})

const openSettings = () => {
  isOpen.value = false
  isSettingsOpen.value = true
}

const handleUserUpdated = (updatedUser: UserInfo) => {
  user.value = updatedUser
}

const handleLogout = async () => {
  await auth.logout()
  isOpen.value = false
  updateUserState() // 立即更新用户状态
  router.push('/')
}
</script>

<style scoped>
.user-menu {
  position: relative;
}

.user-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 6px 6px 8px;
  border-radius: 24px;
  background: white;
  border: 1px solid var(--slate-200);
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--text);
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.user-trigger:hover,
.user-trigger.active {
  background: var(--slate-50);
  border-color: var(--slate-300);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.user-avatar :deep(svg) {
  color: white;
}

.user-avatar :deep([stroke]) {
  stroke: white;
}

.user-name {
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-trigger :deep(svg) {
  transition: transform 0.25s ease;
  color: var(--text-muted);
}

.user-trigger :deep(svg.rotate) {
  transform: rotate(180deg);
}

/* Dropdown */
.user-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 240px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  border: 1px solid var(--slate-200);
  z-index: 100;
  overflow: hidden;
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.dropdown-header {
  padding: 16px;
  background: var(--slate-50);
}

.user-info {
  text-align: center;
}

.user-info-name {
  font-size: 15px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 4px;
}

.user-info-phone {
  font-size: 13px;
  color: var(--text-muted);
}

.dropdown-divider {
  height: 1px;
  background: var(--slate-200);
  margin: 0 4px;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 16px;
  background: none;
  border: none;
  color: var(--text);
  font-size: 14px;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.dropdown-item:hover {
  background: var(--slate-50);
}

.dropdown-item.logout {
  color: #ef4444;
}

.dropdown-item.logout:hover {
  background: #fef2f2;
}

.dropdown-backdrop {
  position: fixed;
  inset: 0;
  z-index: 99;
}
</style>
