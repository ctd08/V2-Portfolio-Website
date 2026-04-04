<template>
  <Transition name="fade-up">
    <button v-if="visible" class="scroll-top-btn" @click="scrollToTop" title="Back to top">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="12" y1="19" x2="12" y2="5"/>
        <polyline points="5 12 12 5 19 12"/>
      </svg>
    </button>
  </Transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const visible = ref(false)

function updateVisibility() {
  const scrolled = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)
  visible.value = scrolled > 0.4
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => window.addEventListener('scroll', updateVisibility))
onUnmounted(() => window.removeEventListener('scroll', updateVisibility))
</script>

<style scoped>
.scroll-top-btn {
  position: fixed;
  bottom: var(--space-8);
  right: var(--space-8);
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  background: var(--bg-surface);
  border: 1px solid var(--border-default);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 90;
  transition: color var(--transition-fast), background var(--transition-fast), border-color var(--transition-fast);
}

.scroll-top-btn:hover {
  color: var(--text-primary);
  background: var(--bg-secondary);
  border-color: var(--accent-primary);
}

.fade-up-enter-active,
.fade-up-leave-active {
  transition: opacity var(--transition-base), transform var(--transition-base);
}
.fade-up-enter-from,
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>