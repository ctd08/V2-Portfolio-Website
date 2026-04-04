<template>
  <AppNav />
  <main class="app-main">
    <RouterView />
  </main>
  <AppFooter />
</template>

<script setup>
import AppNav from '@/components/layout/AppNav.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
</script>

<style>
.app-main {
  padding-top: 56px;
}
</style>