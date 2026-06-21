<template>
  <section class="projects">
    <p class="section-eyebrow">Projects</p>

    <div class="carousel-wrap" ref="wrapRef">
      <div class="cards-track" ref="trackRef">
        <RouterLink
          v-for="project in projects"
          :key="project.id"
          :to="`/projects/${project.id}`"
          class="project-card"
          :class="{ featured: project.featured }"
        >
          <div class="card-inner">
            <h3 class="card-title">{{ project.title }}</h3>
            <p class="card-desc">{{ project.description }}</p>
            <div class="card-tags">
              <span v-for="tag in project.tags" :key="tag" class="tag">{{ tag }}</span>
            </div>
          </div>
        </RouterLink>
      </div>

      <!-- Scroll arrows — only visible when overflowing -->
      <button v-if="canScrollLeft" class="scroll-arrow left" @click="scroll(-1)" aria-label="Scroll left">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
      </button>
      <button v-if="canScrollRight" class="scroll-arrow right" @click="scroll(1)" aria-label="Scroll right">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </button>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { projects } from '@/data/projects.js'

const wrapRef = ref(null)
const trackRef = ref(null)
const canScrollLeft = ref(false)
const canScrollRight = ref(false)

function updateArrows() {
  const track = trackRef.value
  if (!track) return
  canScrollLeft.value = track.scrollLeft > 10
  canScrollRight.value = track.scrollLeft + track.clientWidth < track.scrollWidth - 10
}

function scroll(direction) {
  const track = trackRef.value
  if (!track) return
  track.scrollBy({ left: direction * 320, behavior: 'smooth' })
}

onMounted(() => {
  const track = trackRef.value
  if (!track) return
  track.addEventListener('scroll', updateArrows)
  updateArrows()

  // Re-check on resize
  window.addEventListener('resize', updateArrows)
})

onUnmounted(() => {
  const track = trackRef.value
  if (track) track.removeEventListener('scroll', updateArrows)
  window.removeEventListener('resize', updateArrows)
})
</script>

<style scoped>
.projects {
  padding: var(--space-16) 0;
  border-bottom: 1px solid var(--border-subtle);
}

.section-eyebrow {
  font-size: var(--text-xs);
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--accent-primary);
  margin-bottom: var(--space-6);
}

/* ── Carousel ── */
.carousel-wrap {
  position: relative;
}

.cards-track {
  display: flex;
  gap: var(--space-4);
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  padding-bottom: var(--space-2);

  /* Hide scrollbar */
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.cards-track::-webkit-scrollbar {
  display: none;
}

/* ── Cards ── */
.project-card {
  flex: 0 0 300px;
  scroll-snap-align: start;
  border: 1px solid var(--border-subtle);
  border-left: 3px solid transparent;
  border-radius: 0 var(--radius-lg) var(--radius-lg) 0;
  background: var(--bg-secondary);
  text-decoration: none;
  display: block;
  transition: border-color var(--transition-fast), background var(--transition-fast);
}

.project-card:hover {
  border-color: var(--border-default);
  border-left-color: var(--accent-primary);
  background: var(--bg-surface);
}

.project-card.featured {
  border-left-color: var(--accent-primary);
}

.card-inner {
  padding: var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  height: 100%;
}

.card-title {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  color: var(--text-primary);
  font-weight: 400;
  line-height: var(--leading-tight);
}

.card-desc {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  line-height: var(--leading-normal);
  flex: 1;
  max-width: 100%;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.tag {
  font-size: var(--text-xs);
  padding: 2px 8px;
  border-radius: var(--radius-sm);
  background: rgba(74, 158, 106, 0.1);
  color: var(--accent-primary);
  border: 1px solid rgba(74, 158, 106, 0.25);
  font-family: var(--font-mono);
}

/* ── Scroll arrows ── */
.scroll-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--bg-surface);
  border: 1px solid var(--border-default);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: color var(--transition-fast), border-color var(--transition-fast), background var(--transition-fast);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.scroll-arrow:hover {
  color: var(--text-primary);
  border-color: var(--accent-primary);
  background: var(--bg-secondary);
}

.scroll-arrow.left { left: -18px; }
.scroll-arrow.right { right: -18px; }
</style>