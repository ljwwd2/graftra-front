<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="logo-icon"
  >
    <!-- Background hexagon with gradient -->
    <defs>
      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#059669;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#0891b2;stop-opacity:1" />
      </linearGradient>
    </defs>
    <path
      d="M16 2L28 9V23L16 30L4 23V9L16 2Z"
      fill="url(#logoGradient)"
    />
    <!-- Inner hexagon outline -->
    <path
      d="M16 5L25 10V22L16 27L7 22V10L16 5Z"
      fill="none"
      stroke="white"
      stroke-width="1.5"
      stroke-opacity="0.3"
    />
    <!-- G letter shape -->
    <path
      d="M12 11V21M12 11H17C19.2 11 21 12.8 21 15C21 17.2 19.2 19 17 19H12M12 15H16"
      stroke="white"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>

<script setup lang="ts">
interface Props {
  size?: number
}

withDefaults(defineProps<Props>(), {
  size: 32
})
</script>

<style scoped>
.logo-icon {
  display: inline-block;
  vertical-align: middle;
}
</style>
