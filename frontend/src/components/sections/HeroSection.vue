<template>
  <section class="hero">
    <div
      class="hero-stage"
      ref="stageRef"
      @mousemove="onDrag"
      @mouseup="stopDrag"
      @mouseleave="stopDrag"
      @touchmove.prevent="onTouchDrag"
      @touchend="stopDrag"
    >
      <!-- Left side -->
      <div
        class="hero-side hero-left"
        :style="{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }"
      >
        <div
          class="hero-image"
          :style="{ backgroundImage: `url(${leftImage})` }"
        ></div>
      </div>

      <!-- Right side -->
      <div
        class="hero-side hero-right"
        :style="{ clipPath: `inset(0 0 0 ${sliderPos}%)` }"
      >
        <div
          class="hero-image"
          :style="{ backgroundImage: `url(${rightImage})` }"
        ></div>
      </div>

      <!-- Divider handle -->
      <div
        class="hero-handle"
        :style="{ left: sliderPos + '%' }"
        @mousedown="startDrag"
        @touchstart.prevent="startDrag"
      >
        <div class="handle-line" />
        <div class="handle-grip">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>
      </div>
    </div>

    <div class="hero-content">
      <p class="hero-eyebrow text-eyebrow">
        {{ activeMode === 'right'
          ? 'Software & Hardware · Medtech · Systems'
          : 'Reflective · Observant · Curious' }}
      </p>

      <h1 class="hero-title">
        Servus, I'm <em>Cristina</em>
        <Transition name="swap" mode="out-in">
          <span :key="activeMode" class="hero-subtitle">
            {{
              activeMode === 'right'
                ? 'I design systems with purpose.'
                : 'I also love to create and learn new things.'
            }}
          </span>
        </Transition>
      </h1>

      <div class="hero-actions">
        <Transition name="swap" mode="out-in">
          <div :key="activeMode" class="hero-buttons">
            <RouterLink v-if="activeMode === 'right'" to="/work" class="btn-primary">
              See my work
            </RouterLink>
            <RouterLink v-if="activeMode === 'right'" to="/about" class="btn-ghost">
              About me
            </RouterLink>

            <RouterLink v-if="activeMode === 'left'" to="/about" class="btn-primary">
              Get to know me
            </RouterLink>
            <RouterLink v-if="activeMode === 'left'" to="/blog" class="btn-ghost">
              Read my writing
            </RouterLink>
          </div>
        </Transition>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import imgBackToBack from '@/assets/images/back_to_back.png'
import imgProfessional from '@/assets/images/serious_side.png'
import imgCreative from '@/assets/images/creative_side.png'

const sliderPos = ref(50)
const dragging = ref(false)
const stageRef = ref(null)

// Corrected behavior:
// - center (40–60): neutral image on both sides
// - drag right (>60): left side becomes professional
// - drag left (<40): right side becomes creative
const leftImage = computed(() =>
  sliderPos.value > 60 ? imgProfessional : imgBackToBack
)

const rightImage = computed(() =>
  sliderPos.value < 40 ? imgCreative : imgBackToBack
)

const activeMode = computed(() => {
  if (sliderPos.value < 40) return 'left'
  if (sliderPos.value > 60) return 'right'
  return 'right'
})

function startDrag() {
  dragging.value = true
}

function stopDrag() {
  dragging.value = false
}

function updateSlider(clientX) {
  const rect = stageRef.value?.getBoundingClientRect()
  if (!rect) return

  const x = clientX - rect.left
  sliderPos.value = Math.min(Math.max((x / rect.width) * 100, 5), 95)
}

function onDrag(e) {
  if (!dragging.value) return
  updateSlider(e.clientX)
}

function onTouchDrag(e) {
  if (!dragging.value) return
  updateSlider(e.touches[0].clientX)
}
</script>

<style scoped>
.hero {
  padding: var(--space-8) var(--space-6);
  max-width: var(--max-width);
  margin: 0 auto;
}

/* Stage */
.hero-stage {
  position: relative;
  height: 65vh;
  min-height: 560px;
  max-height: 760px;
  border-radius: var(--radius-lg);
  overflow: hidden;
  cursor: col-resize;
  user-select: none;
}

.hero-side {
  position: absolute;
  inset: 0;
}

.hero-image {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center top;
  background-repeat: no-repeat;
  transition: background-image 0.3s ease;
}

/* Handle */
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

/* Content */
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

/* Buttons */
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

/* Transitions */
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

@media (max-width: 1024px) {
  .hero-stage {
    height: 56vh;
    min-height: 460px;
    max-height: 620px;
  }
}

@media (max-width: 640px) {
  .hero {
    padding: var(--space-6) var(--space-4);
  }

  .hero-stage {
    height: 48vh;
    min-height: 360px;
    max-height: 500px;
  }

  .hero-title {
    font-size: var(--text-3xl);
  }
}
</style>
