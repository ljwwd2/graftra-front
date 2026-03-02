<template>
  <Teleport to="body">
    <Transition name="toast">
      <div
        v-if="visible"
        :class="['toast', `toast-${type}`]"
        role="alert"
        :aria-live="type === 'error' ? 'assertive' : 'polite'"
      >
        <div class="toast-icon">
          <component :is="iconComponent" :size="20" />
        </div>
        <div class="toast-content">
          <div class="toast-message">{{ message }}</div>
        </div>
        <button
          class="toast-close"
          :aria-label="'关闭'"
          @click="hide"
        >
          <X :size="16" />
        </button>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { CheckCircle2, AlertCircle, X } from 'lucide-vue-next'

export type ToastType = 'success' | 'error' | 'info'

const props = defineProps<{
  message: string
  type?: ToastType
  duration?: number
}>()

const emit = defineEmits<{
  close: []
}>()

const visible = ref(false)

const iconComponent = computed(() => {
  switch (props.type) {
    case 'success':
      return CheckCircle2
    case 'error':
      return AlertCircle
    default:
      return AlertCircle
  }
})

const show = () => {
  visible.value = true
}

const hide = () => {
  visible.value = false
  emit('close')
}

// Auto hide after duration
let timer: ReturnType<typeof setTimeout> | null = null

watch(() => props.message, (newMessage) => {
  if (newMessage) {
    show()
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      hide()
    }, props.duration || 5000)
  }
}, { immediate: true })

defineExpose({ show, hide })
</script>

<style scoped>
.toast {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  min-width: 320px;
  max-width: 480px;
  cursor: pointer;
}

.toast-success {
  border-left: 4px solid #10b981;
}

.toast-error {
  border-left: 4px solid #ef4444;
}

.toast-info {
  border-left: 4px solid #3b82f6;
}

.toast-icon {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toast-success .toast-icon {
  color: #10b981;
}

.toast-error .toast-icon {
  color: #ef4444;
}

.toast-info .toast-icon {
  color: #3b82f6;
}

.toast-content {
  flex: 1;
}

.toast-message {
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
  line-height: 1.4;
}

.toast-close {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: #9ca3af;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.15s ease;
}

.toast-close:hover {
  background: #f3f4f6;
  color: #6b7280;
}

/* Toast animations */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* Responsive */
@media (max-width: 640px) {
  .toast {
    left: 16px;
    right: 16px;
    min-width: 0;
    top: 16px;
  }
}
</style>
