<template>
  <section class="currently">
    <p class="section-eyebrow">Right now</p>
    <div class="currently-strip">
      <div v-for="item in items" :key="item.label" class="curr-item">
        <div class="curr-dot" :class="item.color"></div>
        <div class="curr-content">
          <span class="curr-label">{{ item.label }}</span>
          <span class="curr-value">{{ item.value }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { currently } from '@/data/currently.js'

const items = currently
</script>

<style scoped>
.currently {
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

.currently-strip {
  display: flex;
  gap: var(--space-4);
  flex-wrap: wrap;
}

.curr-item {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4) var(--space-6);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-subtle);
  background: var(--bg-secondary);
  flex: 1;
  min-width: 200px;
  transition: border-color var(--transition-fast), background var(--transition-theme);
}

.curr-item:hover {
  border-color: var(--accent-primary);
  background: var(--bg-surface);
}

.curr-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.curr-dot.green { background: var(--accent-primary); }
.curr-dot.amber { background: var(--accent-warm); }

.curr-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.curr-label {
  font-size: var(--text-xs);
  color: var(--text-muted);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.curr-value {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--text-primary);
  line-height: 1.4;
}
</style>