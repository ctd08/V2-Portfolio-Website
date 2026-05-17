<template>
  <section class="skills">
    <p class="section-eyebrow">Skills</p>

    <div class="skills-grid">
      <div
        v-for="(cat, catIndex) in skills"
        :key="cat.category"
        class="skill-category fade-in"
        :ref="el => { if (el) fadeEls.push(el) }"
      >
        <div class="cat-label">{{ cat.category }}</div>
        <div class="chips">
          <button
            v-for="item in cat.items"
            :key="item.name"
            class="chip"
            :class="{
              clickable: cat.filterable,
              learning: item.learning,
            }"
            @click="cat.filterable ? filterProjects(item.name) : null"
            :title="cat.filterable ? `Filter projects by ${item.name}` : item.name"
          >
            {{ item.name }}
            <span v-if="item.learning" class="learning-badge">learning</span>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { skills } from '@/data/skills.js'
/*import * as simpleIcons from 'simple-icons'*/

const router = useRouter()
const fadeEls = ref([])
let observer = null

/*function getIcon(slug, color) {
  const key = 'si' + slug.charAt(0).toUpperCase() + slug.slice(1).replace(/\./g, '')
  const icon = simpleIcons[key]
  if (!icon) return ''
  return `<svg role="img" viewBox="0 0 24 24" width="14" height="14" fill="${color || '#' + icon.hex}" xmlns="http://www.w3.org/2000/svg"><path d="${icon.path}"/></svg>`
}*/

function filterProjects(skill) {
  router.push({ path: '/projects', query: { filter: skill } })
}

onMounted(() => {
  observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible')
        observer.unobserve(e.target)
      }
    })
  }, { threshold: 0.1 })

  fadeEls.value.forEach((el, i) => {
    el.style.transitionDelay = `${i * 100}ms`
    observer.observe(el)
  })
})

onUnmounted(() => {
  if (observer) observer.disconnect()
})
</script>

<style scoped>
.skills {
  padding: var(--space-16) 0;
  border-bottom: 1px solid var(--border-subtle);
}

.section-eyebrow {
  font-size: var(--text-xs);
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--accent-primary);
  margin-bottom: var(--space-8);
}

.skills-grid {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
}

/* ── Fade in ── */
.fade-in {
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.fade-in.visible {
  opacity: 1;
  transform: translateY(0);
}

.cat-label {
  font-size: var(--text-xs);
  font-family: var(--font-mono);
  color: var(--text-muted);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: var(--space-3);
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-subtle);
  background: var(--bg-secondary);
  font-size: var(--text-sm);
  font-family: var(--font-body);
  color: var(--text-primary);
  cursor: default;
  transition: border-color var(--transition-fast), background var(--transition-fast);
}

.chip.clickable {
  border-color: rgba(74, 158, 106, 0.3);
  color: var(--accent-primary);
  cursor: pointer;
}

.chip.clickable:hover {
  background: rgba(74, 158, 106, 0.08);
  border-color: var(--accent-primary);
}

.chip.learning {
  border-style: dashed;
  color: var(--text-muted);
}

.chip-icon {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.learning-badge {
  font-size: 10px;
  color: var(--text-muted);
  font-family: var(--font-mono);
  margin-left: var(--space-1);
}
</style>