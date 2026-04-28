<template>
  <section class="hero">

    <!-- Split image container -->
    <div class="hero-stage" ref="stageRef" @mousemove="onDrag" @mouseup="stopDrag" @mouseleave="stopDrag" @touchmove.prevent="onTouchDrag" @touchend="stopDrag">

      <!-- Left side — professional -->
      <div class="hero-side hero-left" :style="{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }">
        <div class="hero-placeholder left-placeholder">
          <span class="placeholder-label">Professional</span>
        </div>
      </div>

      <!-- Right side — personal -->
      <div class="hero-side hero-right" :style="{ clipPath: `inset(0 0 0 ${sliderPos}%)` }">
        <div class="hero-placeholder right-placeholder">
          <span class="placeholder-label">Personal</span>
        </div>
      </div>

      <!-- Divider handle -->
      <div class="hero-handle" :style="{ left: sliderPos + '%' }" @mousedown="startDrag" @touchstart.prevent="startDrag">
        <div class="handle-line" />
        <div class="handle-grip">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>
      </div>

    </div>

    <!-- Hero text — changes based on slider position -->
    <div class="hero-content">
      <p class="hero-eyebrow text-eyebrow">
        {{ activeMode === 'right' ? 'Software & Hardware · Medtech · Systems' : 'Reflective · Observant · Curious' }}
      </p>
      <h1 class="hero-title">
        Servus, I'm <em>Cristina</em> 
        <Transition name="swap" mode="out-in">
          <span :key="activeMode" class="hero-subtitle">
            {{ activeMode === 'right' ? 'I design systems with purpose.' : 'I also love to create and learn new things.' }}
          </span>
        </Transition>
      </h1>
      <div class="hero-actions">
        <Transition name="swap" mode="out-in">
          <div :key="activeMode" class="hero-buttons">
            <RouterLink v-if="activeMode === 'right'" to="/work" class="btn-primary">See my work</RouterLink>
            <RouterLink v-if="activeMode === 'right'" to="/about" class="btn-ghost">About me</RouterLink>
            <RouterLink v-if="activeMode === 'left'" to="/about" class="btn-primary">Get to know me</RouterLink>
            <RouterLink v-if="activeMode === 'left'" to="/blog" class="btn-ghost">Read my writing</RouterLink>
          </div>
        </Transition>
      </div>
    </div>

  </section>
</template>

<script setup>
import { ref, computed } from 'vue'

const sliderPos = ref(50)
const dragging = ref(false)
const stageRef = ref(null)

const activeMode = computed(() => sliderPos.value < 50 ? 'left' : 'right')

function startDrag() {
  dragging.value = true
}

function stopDrag() {
  dragging.value = false
}

function onDrag(e) {
  if (!dragging.value) return
  const rect = stageRef.value.getBoundingClientRect()
  const x = e.clientX - rect.left
  sliderPos.value = Math.min(Math.max((x / rect.width) * 100, 5), 95)
}

function onTouchDrag(e) {
  if (!dragging.value) return
  const rect = stageRef.value.getBoundingClientRect()
  const x = e.touches[0].clientX - rect.left
  sliderPos.value = Math.min(Math.max((x / rect.width) * 100, 5), 95)
}
</script>

<style scoped>
.hero {
  padding: var(--space-8) var(--space-6);
  max-width: var(--max-width);
  margin: 0 auto;
}

/* ── Stage ── */
.hero-stage {
  position: relative;
  height: 50vh;
  border-radius: var(--radius-lg);
  overflow: hidden;
  cursor: col-resize;
  user-select: none;
}

.hero-side {
  position: absolute;
  inset: 0;
}

.hero-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.left-placeholder {
  background: var(--color-green-800);
}

.right-placeholder {
  background: var(--color-green-700);
}

.placeholder-label {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  color: var(--color-green-300);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

/* ── Handle ── */
.hero-handle {
  position: absolute;
  top: 0;
  bottom: 0;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
  cursor: col-resize;
}

.handle-line {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--color-green-300);
  opacity: 0.6;
}

.handle-grip {
  position: relative;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--bg-surface);
  border: 1px solid var(--border-default);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  color: var(--text-secondary);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

/* ── Content ── */
.hero-content {
  padding-top: var(--space-8);
}

.hero-eyebrow {
  margin-bottom: var(--space-3);
  transition: all var(--transition-base);
}

.hero-title {
  font-family: var(--font-display);
  font-size: var(--text-4xl);
  line-height: var(--leading-tight);
  color: var(--text-primary);
  margin-bottom: var(--space-6);
}

.hero-title em {
  font-style: italic;
  color: var(--accent-primary);
}

.hero-subtitle {
  display: block;
}

.hero-buttons {
  display: flex;
  gap: var(--space-3);
  flex-wrap: wrap;
}

/* ── Buttons ── */
.btn-primary {
  display: inline-block;
  background: var(--accent-primary);
  color: var(--bg-primary);
  font-size: var(--text-sm);
  font-weight: 500;
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-pill);
  transition: opacity var(--transition-fast);
}

.btn-primary:hover {
  opacity: 0.85;
}

.btn-ghost {
  display: inline-block;
  border: 1px solid var(--border-default);
  color: var(--text-secondary);
  font-size: var(--text-sm);
  font-weight: 500;
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-pill);
  transition: color var(--transition-fast), border-color var(--transition-fast);
}

.btn-ghost:hover {
  color: var(--text-primary);
  border-color: var(--accent-primary);
}

/* ── Transitions ── */
.swap-enter-active,
.swap-leave-active {
  transition: opacity var(--transition-base), transform var(--transition-base);
}
.swap-enter-from {
  opacity: 0;
  transform: translateY(6px);
}
.swap-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>