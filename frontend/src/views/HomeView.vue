<template>
  <div class="home">
    <HeroSection />
     <div class="home-content">
      <CurrentlySection />
      <SkillsSection />
    </div>
  </div>
</template>

<script setup>
import HeroSection from '@/components/sections/HeroSection.vue'
import CurrentlySection from '@/components/sections/CurrentlySection.vue'
import SkillsSection from '@/components/sections/SkillsSection.vue'
</script>

<style scoped>
.home-content {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 var(--space-6);
}
</style>