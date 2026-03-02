<template>
  <RouterView />
  <Toast
    v-if="toastState.visible"
    :message="toastState.message"
    :type="toastState.type"
    :duration="toastState.duration"
  />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { toastState, ToastComponent } from './composables/useToast'

// Register Toast component with a shorter name
const Toast = ToastComponent
</script>

<style scoped>
</style>
