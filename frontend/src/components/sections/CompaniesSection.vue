<template>
  <section class="companies">
    <p class="section-eyebrow">Where I've worked</p>

    <div class="companies-row">
      <RouterLink
        v-for="company in companies"
        :key="company.id"
        :to="`/career?filter=${company.id}`"
        class="company-pill"
      >
        <div class="company-logo">
          <img
            v-if="company.logo"
            :src="company.logo"
            :alt="company.name"
            class="logo-img"
          />
          <span v-else class="logo-placeholder">
            {{ company.name.charAt(0) }}
          </span>
        </div>
        <div class="company-info">
          <span class="company-name">{{ company.name }}</span>
          <span class="company-year">{{ company.year }}</span>
        </div>
      </RouterLink>
    </div>
  </section>
</template>

<script setup>
import { companies } from '@/data/companies.js'
</script>

<style scoped>
.companies {
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

.companies-row {
  display: flex;
  gap: var(--space-4);
  flex-wrap: wrap;
}

.company-pill {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4) var(--space-6);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-subtle);
  background: var(--bg-secondary);
  text-decoration: none;
  transition: border-color var(--transition-fast), background var(--transition-fast);
}

.company-pill:hover {
  border-color: var(--accent-primary);
  background: var(--bg-surface);
}

.company-logo {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-subtle);
  background: var(--bg-surface);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
}

.logo-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 4px;
  mix-blend-mode: multiply;
}

[data-theme="dark"] .logo-img {
  mix-blend-mode: screen;
}

.logo-placeholder {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  color: var(--text-muted);
}

.company-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.company-name {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--text-primary);
}

.company-year {
  font-size: var(--text-xs);
  color: var(--text-muted);
  font-family: var(--font-mono);
}
</style>