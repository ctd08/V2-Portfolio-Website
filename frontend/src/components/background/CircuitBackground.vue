<template>
  <canvas ref="canvasRef" class="bg-canvas"></canvas>
</template>

<script setup>
import { ref } from 'vue'
import { useCanvasLoop } from '@/composables/useCanvasLoop'

const canvasRef = ref(null)

// ── Tuning knobs ──
const GRID = 28            // px between possible trace points
const DENSITY = 1 / 26000  // traces per px²
const MAX_TRACES = 40
const TRACE_ALPHA = 0.13
const PAD_ALPHA = 0.28
const PULSE_ALPHA = 0.7
const TAIL_DOTS = 7
const TAIL_SPACING = 6

// E, SE, S, SW, W, NW, N, NE: turning ±1 gives the 45° bends of a real PCB
const DIRS = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]]

let traces = []
const tmp = { x: 0, y: 0 }

function rand(a, b) {
  return a + Math.random() * (b - a)
}

function randInt(a, b) {
  return Math.floor(rand(a, b + 1))
}

function buildTrace(cols, rows) {
  let cx = randInt(1, cols - 1)
  let cy = randInt(1, rows - 1)
  let dir = randInt(0, 7)
  const segments = randInt(3, 6)
  const points = [{ x: cx * GRID, y: cy * GRID }]

  for (let i = 0; i < segments; i++) {
    const [dx, dy] = DIRS[dir]
    const diagonal = dx !== 0 && dy !== 0
    const room = Math.min(
      dx > 0 ? cols - cx : dx < 0 ? cx : Infinity,
      dy > 0 ? rows - cy : dy < 0 ? cy : Infinity,
    )
    const min = diagonal ? 1 : 3
    const max = Math.min(diagonal ? 3 : 9, room)

    if (max >= min) {
      const len = randInt(min, max)
      cx += dx * len
      cy += dy * len
      points.push({ x: cx * GRID, y: cy * GRID })
    }
    dir = (dir + (Math.random() < 0.5 ? 1 : 7)) % 8
  }

  const cum = [0]
  for (let i = 1; i < points.length; i++) {
    cum.push(cum[i - 1] + Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y))
  }

  return {
    points,
    cum,
    total: cum[cum.length - 1],
    pos: -rand(0, 800),     // negative = pulse is still waiting to start
    speed: rand(45, 100),   // px/s
    warm: Math.random() < 0.3,
  }
}

function createTraces(w, h) {
  const cols = Math.floor(w / GRID)
  const rows = Math.floor(h / GRID)
  if (cols < 6 || rows < 6) {
    traces = []
    return
  }
  const count = Math.min(MAX_TRACES, Math.floor(w * h * DENSITY))
  traces = Array.from({ length: count }, () => buildTrace(cols, rows)).filter(
    (t) => t.points.length > 1,
  )
}

function pointAt(trace, d) {
  const { points, cum } = trace
  for (let i = 1; i < points.length; i++) {
    if (d <= cum[i]) {
      const t = (d - cum[i - 1]) / (cum[i] - cum[i - 1])
      tmp.x = points[i - 1].x + (points[i].x - points[i - 1].x) * t
      tmp.y = points[i - 1].y + (points[i].y - points[i - 1].y) * t
      return
    }
  }
  const end = points[points.length - 1]
  tmp.x = end.x
  tmp.y = end.y
}

function drawPad(ctx, p) {
  ctx.beginPath()
  ctx.arc(p.x, p.y, 3, 0, Math.PI * 2)
  ctx.stroke()
}

function draw(ctx, w, h, dt, colors) {
  const [r, g, b] = colors.accent
  ctx.lineWidth = 1
  ctx.lineJoin = 'round'
  ctx.lineCap = 'round'

  for (const t of traces) {
    ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${TRACE_ALPHA})`
    ctx.beginPath()
    t.points.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)))
    ctx.stroke()

    ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${PAD_ALPHA})`
    drawPad(ctx, t.points[0])
    drawPad(ctx, t.points[t.points.length - 1])

    t.pos += t.speed * dt
    if (t.pos - TAIL_DOTS * TAIL_SPACING > t.total) t.pos = -rand(200, 1000)

    if (t.pos > 0) {
      const [pr, pg, pb] = t.warm ? colors.warm : colors.accent
      for (let k = 0; k < TAIL_DOTS; k++) {
        const d = t.pos - k * TAIL_SPACING
        if (d < 0 || d > t.total) continue
        pointAt(t, d)
        ctx.fillStyle = `rgba(${pr}, ${pg}, ${pb}, ${PULSE_ALPHA * (1 - k / TAIL_DOTS)})`
        ctx.beginPath()
        ctx.arc(tmp.x, tmp.y, 2 - k * 0.2, 0, Math.PI * 2)
        ctx.fill()
      }
    }
  }
}

useCanvasLoop(canvasRef, { onResize: createTraces, onFrame: draw })
</script>

<style scoped>
.bg-canvas {
  display: block;
  width: 100%;
  height: 100%;
}
</style>