<template>
  <div class="construction">
    <div class="construction-content">
      <span class="construction-eyebrow text-eyebrow">Work in progress</span>
      <h1 class="construction-title">
        This part is still <em>being built.</em>
      </h1>
      <p class="construction-sub">
        I'm working on it — check back soon. In the meantime, feel free to explore the rest of the site.
      </p>
      <div class="construction-meta">
        <span class="meta-item">
          <span class="meta-dot"></span>
          {{ pageHint }}
        </span>
      </div>
      <RouterLink to="/" class="btn-home">Back to home</RouterLink>
    </div>

    <div class="construction-visual">
      <div class="progress-wrap">
        <div class="progress-label">
          <span class="text-mono">site completion</span>
          <span class="text-mono">{{ completion }}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: completion + '%' }"></div>
        </div>
      </div>

      <div class="checklist">
        <div v-for="item in checklist" :key="item.label" class="check-item">
          <span class="check-icon" :class="{ done: item.done }">
            {{ item.done ? '✓' : '○' }}
          </span>
          <span class="check-label" :class="{ done: item.done }">{{ item.label }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const hints = {
  '/about':   'This will be my personal page — personality, curiosity, AuDHD and all.',
  '/career':  'This will be my professional page — medtech journey, tech stack, projects.',
  '/projects':'This will showcase my projects in detail.',
  '/blog':    'This will be where I write — thoughts, ideas, things I learn.',
  '/cv':      'This will have my CV — abstract version on the page, downloadable for recruiters.',
  '/contact': 'This will have a contact form with categories for different types of enquiries.',
}

const pageHint = computed(() => hints[route.path] || 'This page is coming soon.')

const checklist = [
  { label: 'Design system & tokens',      done: true  },
  { label: 'Navigation & sidebar',         done: true  },
  { label: 'Hero section with slider',     done: true  },
  { label: 'Currently section',            done: true  },
  { label: 'Skills section',               done: true  },
  { label: 'Projects section',             done: true },
  { label: 'Companies section',            done: true },
  { label: 'About page',                   done: false },
  { label: 'Career page',                  done: false },
  { label: 'Blog',                         done: false },
  { label: 'CV page',                      done: false },
  { label: 'Contact form',                 done: false },
  { label: 'Self-hosted server & CI/CD',   done: false },
]

const completion = computed(() => {
  const done = checklist.filter(i => i.done).length
  return Math.round((done / checklist.length) * 100)
})
</script>

<style scoped>
.construction {
  min-height: calc(100vh - 56px);
  max-width: var(--max-width);
  margin: 0 auto;
  padding: var(--space-16) var(--space-6);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-16);
  align-items: center;
}

.construction-eyebrow {
  display: block;
  margin-bottom: var(--space-4);
}

.construction-title {
  font-family: var(--font-display);
  font-size: var(--text-4xl);
  line-height: var(--leading-tight);
  color: var(--text-primary);
  margin-bottom: var(--space-6);
}

.construction-title em {
  font-style: italic;
  color: var(--accent-primary);
}

.construction-sub {
  font-size: var(--text-base);
  color: var(--text-secondary);
  line-height: var(--leading-normal);
  margin-bottom: var(--space-6);
  max-width: 100%;
}

.construction-meta {
  margin-bottom: var(--space-8);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-sm);
  color: var(--text-muted);
  font-style: italic;
}

.meta-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent-warm);
  flex-shrink: 0;
}

.btn-home {
  display: inline-block;
  background: var(--accent-primary);
  color: var(--bg-primary);
  font-size: var(--text-sm);
  font-weight: 500;
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-pill);
  text-decoration: none;
  transition: opacity var(--transition-fast);
}

.btn-home:hover { opacity: 0.85; }

/* ── Visual side ── */
.construction-visual {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
}

.progress-wrap {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.progress-label {
  display: flex;
  justify-content: space-between;
  font-size: var(--text-xs);
  color: var(--text-muted);
}

.progress-bar {
  height: 4px;
  background: var(--border-subtle);
  border-radius: var(--radius-pill);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--accent-primary);
  border-radius: var(--radius-pill);
  transition: width 1s ease;
}

.checklist {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.check-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  font-size: var(--text-sm);
  color: var(--text-muted);
}

.check-icon {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--text-muted);
  width: 16px;
  flex-shrink: 0;
}

.check-icon.done { color: var(--accent-primary); }
.check-label.done { color: var(--text-primary); }

/* ── Mobile ── */
@media (max-width: 768px) {
  .construction {
    grid-template-columns: 1fr;
    gap: var(--space-12);
  }
}
</style>