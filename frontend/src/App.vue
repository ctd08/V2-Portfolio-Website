<template>
  <AppNav />
  <main class="app-main">
    <RouterView />
  </main>
</template>

<script setup>
import AppNav from '@/components/layout/AppNav.vue'
</script>

<style>
.app-main {
  padding-top: 56px;
}
</style>