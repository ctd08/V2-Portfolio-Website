<template>
  <footer class="footer">
    <span class="footer-copy">© 2026 Cristina Tutunariu</span>

    <div class="footer-socials">
      <a href="https://www.linkedin.com/in/cristina-diana-tutunariu/" target="_blank" class="footer-icon" title="LinkedIn">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
          <rect x="2" y="9" width="4" height="12"/>
          <circle cx="4" cy="4" r="2"/>
        </svg>
      </a>
      <a href="https://github.com/ctd08" target="_blank" class="footer-icon" title="GitHub">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
        </svg>
      </a>
      <a href="mailto:cristina.tutunariu@yahoo.com" class="footer-icon" title="Email">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
          <polyline points="22,6 12,13 2,6"/>
        </svg>
      </a>
    </div>
  </footer>
</template>

<script setup>
</script>

<style scoped>
.footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-6) var(--space-6);
  border-top: 1px solid var(--border-subtle);
  margin-top: var(--space-24);
  transition: background var(--transition-theme);
}

.footer-copy {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--text-muted);
}

.footer-socials {
  display: flex;
  gap: var(--space-2);
}

.footer-icon {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  border: 1px solid transparent;
  transition: color var(--transition-fast), background var(--transition-fast), border-color var(--transition-fast);
}

.footer-icon:hover {
  color: var(--text-primary);
  background: var(--bg-secondary);
  border-color: var(--border-subtle);
}
</style>