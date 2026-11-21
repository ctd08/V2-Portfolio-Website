<template>
  <canvas ref="canvasRef" class="bg-canvas"></canvas>
</template>

<script setup>
import { ref } from 'vue'
import { useCanvasLoop } from '@/composables/useCanvasLoop'

const canvasRef = ref(null)

// ── Tuning knobs ──
const DENSITY = 1 / 9000   // stars per px²
const MAX_STARS = 180
const DRIFT = 4            // px/s for the nearest stars
const SHOT_MIN = 9         // seconds between shooting stars
const SHOT_MAX = 18

let stars = []
let shot = null
let clock = 0
let nextShot = rand(SHOT_MIN, SHOT_MAX)

function rand(a, b) {
  return a + Math.random() * (b - a)
}

function createStars(w, h) {
  const count = Math.min(MAX_STARS, Math.floor(w * h * DENSITY))
  stars = Array.from({ length: count }, () => {
    const depth = Math.random() // 0 = far away, 1 = close
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      depth,
      r: 0.4 + depth * 1.1,
      alpha: 0.25 + depth * 0.5,
      phase: Math.random() * Math.PI * 2,
      speed: rand(0.4, 1.2),
      warm: Math.random() < 0.18,
    }
  })
}

function drawShootingStar(ctx, w, h, dt, colors) {
  if (!shot) {
    nextShot -= dt
    if (nextShot <= 0) {
      shot = { x: rand(w * 0.3, w), y: rand(0, h * 0.4), vx: -rand(380, 520), vy: rand(160, 240), life: 0 }
    }
    return
  }

  shot.life += dt
  shot.x += shot.vx * dt
  shot.y += shot.vy * dt
  const fade = Math.max(0, 1 - shot.life / 1.1)

  const speed = Math.hypot(shot.vx, shot.vy)
  const tailX = shot.x - (shot.vx / speed) * 70
  const tailY = shot.y - (shot.vy / speed) * 70
  const [r, g, b] = colors.warm

  const grad = ctx.createLinearGradient(shot.x, shot.y, tailX, tailY)
  grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${0.8 * fade})`)
  grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`)
  ctx.strokeStyle = grad
  ctx.lineWidth = 1.2
  ctx.beginPath()
  ctx.moveTo(shot.x, shot.y)
  ctx.lineTo(tailX, tailY)
  ctx.stroke()

  if (fade <= 0 || shot.x < -100 || shot.y > h + 100) {
    shot = null
    nextShot = rand(SHOT_MIN, SHOT_MAX)
  }
}

function draw(ctx, w, h, dt, colors) {
  clock += dt

  for (const s of stars) {
    s.x -= DRIFT * (0.3 + s.depth) * dt
    if (s.x < -2) s.x = w + 2

    const twinkle = 0.75 + 0.25 * Math.sin(clock * s.speed + s.phase)
    const [r, g, b] = s.warm ? colors.warm : colors.accent
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${s.alpha * twinkle})`
    ctx.beginPath()
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
    ctx.fill()
  }

  drawShootingStar(ctx, w, h, dt, colors)
}

useCanvasLoop(canvasRef, { onResize: createStars, onFrame: draw })
</script>

<style scoped>
.bg-canvas {
  display: block;
  width: 100%;
  height: 100%;
}
</style>