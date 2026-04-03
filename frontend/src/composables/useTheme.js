import { ref, watchEffect } from 'vue'

const isDark = ref(true) // dark mode default

export function useTheme() {
  watchEffect(() => {
    document.documentElement.setAttribute(
      'data-theme',
      isDark.value ? 'dark' : 'light'
    )
  })

  function toggleTheme() {
    isDark.value = !isDark.value
  }

  return { isDark, toggleTheme }
}