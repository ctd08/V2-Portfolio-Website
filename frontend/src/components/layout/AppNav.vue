<template>

  <!-- Top bar -->
  <header class="topbar">
    <button class="ct-btn" @click="toggleSidebar" :class="{ active: sidebarOpen }">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <line x1="3" y1="6" x2="21" y2="6"/>
        <line x1="3" y1="12" x2="21" y2="12"/>
        <line x1="3" y1="18" x2="21" y2="18"/>
      </svg>
      <span class="ct-text">CT</span>
    </button>

    <RouterLink to="/" class="topbar-name">Cristina Tutunariu</RouterLink>

    <nav class="topbar-actions">
      <button class="icon-btn" @click="toggleTimeCapsule" title="Time capsule">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <ellipse cx="12" cy="12" rx="10" ry="4" />
          <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
          <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
          <circle cx="12" cy="12" r="1.5" fill="currentColor" />
        </svg>
      </button>

      <button class="icon-btn" @click="toggleTheme" :title="isDark ? 'Switch to light' : 'Switch to dark'">
        <svg v-if="isDark" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="5"/>
          <line x1="12" y1="1" x2="12" y2="3"/>
          <line x1="12" y1="21" x2="12" y2="23"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="1" y1="12" x2="3" y2="12"/>
          <line x1="21" y1="12" x2="23" y2="12"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
        <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      </button>

      <RouterLink class="contact-link" to="/contact">Contact</RouterLink>
    </nav>
  </header>

  <!-- Backdrop -->
  <Transition name="fade">
    <div v-if="sidebarOpen" class="backdrop" @click="closeSidebar" />
  </Transition>

  <!-- Sidebar -->
  <Transition name="slide">
    <aside v-if="sidebarOpen" class="sidebar">
      <nav class="sidebar-nav">
        <RouterLink to="/about" @click="closeSidebar">About</RouterLink>
        <RouterLink to="/career" @click="closeSidebar">Career</RouterLink>
        <RouterLink to="/projects" @click="closeSidebar">Projects</RouterLink>
        <RouterLink to="/blog" @click="closeSidebar">Blog</RouterLink>
        <RouterLink to="/cv" @click="closeSidebar">CV</RouterLink>
      </nav>

      <div class="sidebar-footer">
        <div class="sidebar-socials">
            <a href="https://www.linkedin.com/in/cristina-diana-tutunariu/" target="_blank" class="icon-btn" title="LinkedIn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                <rect x="2" y="9" width="4" height="12"/>
                <circle cx="4" cy="4" r="2"/>
            </svg>
            </a>
            <a href="https://github.com/ctd08" target="_blank" class="icon-btn" title="GitHub">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
            </svg>
            </a>
            <a href="mailto:cristina.tutunariu@yahoo.com" class="icon-btn" title="Email">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
            </svg>
            </a>
        </div>
        <span class="sidebar-version">v2 — 2026</span>
        </div>
    </aside>
  </Transition>

</template>

<script setup>
import { ref } from 'vue'
import { useTheme } from '@/composables/useTheme'
import { SpeedInsights } from "@vercel/speed-insights/vue"

const { isDark, toggleTheme } = useTheme()
const sidebarOpen = ref(false)

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value
}

function closeSidebar() {
  sidebarOpen.value = false
}

function toggleTimeCapsule() {
  console.log('time capsule clicked')
}
</script>

<style scoped>
/* ── Top bar ── */
.topbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  height: 56px;
  display: flex;
  align-items: center;
  padding: 0 var(--space-6);
  gap: var(--space-4);
  background: var(--bg-primary);
  border-bottom: 1px solid var(--border-subtle);
  transition: background var(--transition-theme);
}

.topbar-name {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  color: var(--text-primary);
  letter-spacing: 0.01em;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.topbar-actions {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

/* ── CT button ── */
.ct-btn {
  width: auto;
  height: 36px;
  padding: 0 var(--space-3);
  gap: var(--space-2);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid var(--border-default);
  transition: background var(--transition-fast), border-color var(--transition-fast);
  flex-shrink: 0;
  color : var(--text-primary);
}

.ct-btn:hover {
  background: var(--bg-secondary);
  border-color: var(--accent-primary);
}

.ct-btn.active {
  background: var(--accent-primary);
  border-color: var(--accent-primary);
}

.ct-btn.active .ct-text {
  color: var(--bg-primary);
}

.ct-text {
  font-family: var(--font-display);
  font-style: italic;
  font-size: var(--text-sm);
  color: var(--text-primary);
  line-height: 1;
  transition: color var(--transition-fast);
}

/* ── Icon buttons ── */
.icon-btn {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  border: 1px solid transparent;
  transition: color var(--transition-fast), background var(--transition-fast), border-color var(--transition-fast);
}

.icon-btn:hover {
  color: var(--text-primary);
  background: var(--bg-secondary);
  border-color: var(--border-subtle);
}

/* ── Contact link ── */
.contact-link {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--text-secondary);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-default);
  transition: color var(--transition-fast), border-color var(--transition-fast), background var(--transition-fast);
}

.contact-link:hover {
  color: var(--text-primary);
  border-color: var(--accent-primary);
  background: var(--bg-secondary);
}

/* ── Backdrop ── */
.backdrop {
  position: fixed;
  inset: 0;
  z-index: 149;
  background: rgba(0, 0, 0, 0.25);
}

/* ── Sidebar ── */
.sidebar {
  position: fixed;
  top: 56px;
  left: 0;
  bottom: 0;
  z-index: 150;
  width: 260px;
  background: var(--bg-surface);
  border-right: 1px solid var(--border-subtle);
  display: flex;
  flex-direction: column;
  padding: var(--space-8) var(--space-6);
  transition: background var(--transition-theme);
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  flex: 1;
}

.sidebar-nav a {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  color: var(--text-secondary);
  padding: var(--space-3) 0;
  border-bottom: 1px solid var(--border-subtle);
  transition: color var(--transition-fast);
}

.sidebar-nav a:hover {
  color: var(--text-primary);
}

.sidebar-nav a.router-link-active {
  color: var(--accent-primary);
}

/* ── Sidebar footer ── */
.sidebar-footer {
  padding-top: var(--space-6);
  border-top: 1px solid var(--border-subtle);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.sidebar-socials {
  display: flex;
  gap: var(--space-2);
}

.sidebar-version {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--text-muted);
}

/* ── Mobile ── */
@media (max-width: 768px) {
  .sidebar {
    width: 100%;
  }
}

/* ── Transitions ── */
.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--transition-base);
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform var(--transition-base);
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}
</style>