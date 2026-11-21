<template>
  <AmbientBackground/>
  <AppNav />
  <ScrollProgress />
  <main class="app-main">
    <RouterView />
  </main>
  <AppFooter />
  <ScrollToTop />
</template>

<script setup>
import AmbientBackground from '@/components/background/AmbientBackground.vue'
import AppNav from '@/components/layout/AppNav.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import ScrollProgress from '@/components/ui/ScrollProgress.vue'
import ScrollToTop from '@/components/ui/ScrollToTop.vue'

</script>

<style>
.app-main {
  padding-top: 56px;
}
</style>