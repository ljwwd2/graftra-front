/**
 * Toast notification composable
 * Provides a simple way to show toast notifications
 */

import { ref, type Component } from 'vue'
import ToastComponent from '@/components/Toast.vue'
import type { ToastType } from '@/components/Toast.vue'

interface ToastOptions {
  message: string
  type?: ToastType
  duration?: number
}

const toastState = ref<{
  message: string
  type: ToastType
  duration: number
  visible: boolean
}>({
  message: '',
  type: 'info',
  duration: 5000,
  visible: false
})

let toastComponent: Component | null = null

/**
 * Default duration by toast type (ms)
 */
const DEFAULT_DURATIONS: Record<ToastType, number> = {
  success: 3000,  // Success messages can be shorter
  error: 6000,    // Error messages need more time to read
  info: 4000      // Info messages get medium time
}

/**
 * Show a toast notification
 */
export function useToast() {
  const show = (options: ToastOptions) => {
    const type = options.type || 'info'
    toastState.value = {
      message: options.message,
      type,
      duration: options.duration ?? DEFAULT_DURATIONS[type],
      visible: true
    }

    // Auto-hide after duration
    setTimeout(() => {
      toastState.value.visible = false
    }, toastState.value.duration)
  }

  const success = (message: string, duration?: number) => {
    show({ message, type: 'success', duration })
  }

  const error = (message: string, duration?: number) => {
    show({ message, type: 'error', duration })
  }

  const info = (message: string, duration?: number) => {
    show({ message, type: 'info', duration })
  }

  const hide = () => {
    toastState.value.visible = false
  }

  return {
    state: toastState,
    show,
    success,
    error,
    info,
    hide
  }
}

export { toastState, ToastComponent }
