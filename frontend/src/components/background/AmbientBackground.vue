<template>
  <div class="ambient" aria-hidden="true">
    <Transition name="ambient-fade">
      <div v-if="hasCircuit" class="layer circuit" :class="{ split: mode === 'both' }">
        <CircuitBackground />
      </div>
    </Transition>

    <Transition name="ambient-fade">
      <div v-if="hasStars" class="layer stars" :class="{ split: mode === 'both' }">
        <StarfieldBackground />
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import CircuitBackground from './CircuitBackground.vue'
import StarfieldBackground from './StarfieldBackground.vue'

const route = useRoute()
const mode = computed(() => route.meta.ambient ?? null)
const hasCircuit = computed(() => mode.value === 'circuit' || mode.value === 'both')
const hasStars = computed(() => mode.value === 'stars' || mode.value === 'both')
</script>

<style scoped>
.ambient {
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  overflow: hidden;
}

.layer {
  position: absolute;
  inset: 0;
  /* dim the centre so text stays readable, edges stay lively */
  -webkit-mask-image: radial-gradient(ellipse at center, rgba(0, 0, 0, 0.3) 0%, #000 80%);
  mask-image: radial-gradient(ellipse at center, rgba(0, 0, 0, 0.3) 0%, #000 80%);
}

/* home page: circuit on the left, stars on the right, fading into each other */
.circuit.split {
  right: auto;
  width: 65%;
  -webkit-mask-image: linear-gradient(to right, #000 55%, transparent 100%);
  mask-image: linear-gradient(to right, #000 55%, transparent 100%);
}

.stars.split {
  left: auto;
  width: 65%;
  -webkit-mask-image: linear-gradient(to left, #000 55%, transparent 100%);
  mask-image: linear-gradient(to left, #000 55%, transparent 100%);
}

.ambient-fade-enter-active,
.ambient-fade-leave-active {
  transition: opacity 0.8s ease;
}
.ambient-fade-enter-from,
.ambient-fade-leave-to {
  opacity: 0;
}
</style>