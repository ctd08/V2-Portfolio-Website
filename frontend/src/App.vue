<template>
  <AppNav />
  <ScrollProgress />
  <main class="app-main">
    <RouterView />
  </main>
  <AppFooter />
  <ScrollToTop />
  <SpeedInsights />
</template>

<script setup>
import AppNav from '@/components/layout/AppNav.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import ScrollProgress from '@/components/ui/ScrollProgress.vue'
import ScrollToTop from '@/components/ui/ScrollToTop.vue'
import { SpeedInsights } from "@vercel/speed-insights/vue"
</script>

<style>
.app-main {
  padding-top: 56px;
}
</style>