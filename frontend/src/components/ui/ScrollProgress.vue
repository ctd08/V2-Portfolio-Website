<template>
  <div class="scroll-progress-bar" :style="{ width: progress + '%' }" />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const progress = ref(0)

function updateProgress() {
  const scrollTop = window.scrollY
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  progress.value = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
}

onMounted(() => window.addEventListener('scroll', updateProgress)) 
onUnmounted(() => window.removeEventListener('scroll', updateProgress))
</script>

<style scoped>
.scroll-progress-bar {
  position: fixed;
  top: 56px;
  left: 0;
  height: 2px;
  background: var(--accent-primary);
  z-index: 99;
  transition: width 0.1s linear;
}
</style>