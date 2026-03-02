<template>
  <div v-if="user" class="user-menu">
    <button
      class="user-trigger"
      @click="isOpen = !isOpen"
      :class="{ active: isOpen }"
    >
      <div class="user-avatar">
        <User :size="20" />
      </div>
      <span class="user-name">{{ user.name }}</span>
      <ChevronDown :size="16" :class="{ 'rotate': isOpen }" />
    </button>

    <Transition name="dropdown">
      <div v-if="isOpen" class="user-dropdown">
        <div class="dropdown-header">
          <div class="user-info">
            <div class="user-info-name">{{ user.name }}</div>
            <div class="user-info-email">{{ user.email }}</div>
          </div>
        </div>

        <div class="dropdown-divider"></div>

        <a href="#" class="dropdown-item" @click.prevent>
          <Settings :size="18" />
          <span>账户设置</span>
        </a>
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
import { ref, onMounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import {
  User, ChevronDown, Settings, HelpCircle, LogOut
} from 'lucide-vue-next'
import { auth } from '@/utils/auth'
import type { UserInfo } from '@/types/auth'

const router = useRouter()

const isOpen = ref(false)
const user = ref<UserInfo | null>(null)

onMounted(async () => {
  user.value = await auth.getCurrentUser()
})

const handleLogout = async () => {
  await auth.logout()
  isOpen.value = false
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
  padding: 8px 12px;
  border-radius: 10px;
  background: rgba(5, 150, 105, 0.1);
  border: 1.5px solid rgba(5, 150, 105, 0.2);
  cursor: pointer;
  transition: all 0.25s ease;
  color: var(--text);
  font-size: 14px;
  font-weight: 600;
}

.user-trigger:hover,
.user-trigger.active {
  background: rgba(5, 150, 105, 0.15);
  border-color: rgba(5, 150, 105, 0.3);
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
  background: linear-gradient(135deg, var(--primary-50) 0%, var(--secondary-50) 100%);
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

.user-info-email {
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
