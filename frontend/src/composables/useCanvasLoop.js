import { onMounted, onBeforeUnmount } from 'vue'

function parseColor(value, fallback) {
  const match = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(value.trim())
  if (!match) return fallback
  let hex = match[1]
  if (hex.length === 3) hex = hex.split('').map((c) => c + c).join('')
  const n = parseInt(hex, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

export function useCanvasLoop(canvasRef, { onResize, onFrame }) {
  let ctx = null
  let raf = 0
  let last = 0
  let width = 0
  let height = 0
  let colors = { accent: [74, 158, 106], warm: [200, 169, 110] }
  let resizeObserver = null
  let themeObserver = null
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

  function readColors() {
    const style = getComputedStyle(document.documentElement)
    colors = {
      accent: parseColor(style.getPropertyValue('--accent-primary'), colors.accent),
      warm: parseColor(style.getPropertyValue('--accent-warm'), colors.warm),
    }
  }

  function drawStatic() {
    ctx.clearRect(0, 0, width, height)
    onFrame(ctx, width, height, 0, colors)
  }

  function resize() {
    const canvas = canvasRef.value
    if (!canvas || !ctx) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    width = canvas.clientWidth
    height = canvas.clientHeight
    if (!width || !height) return
    canvas.width = Math.round(width * dpr)
    canvas.height = Math.round(height * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    onResize(width, height)
    if (motionQuery.matches) drawStatic()
  }

  function frame(now) {
    const dt = Math.min((now - last) / 1000, 0.05)
    last = now
    ctx.clearRect(0, 0, width, height)
    onFrame(ctx, width, height, dt, colors)
    raf = requestAnimationFrame(frame)
  }

  function start() {
    if (raf || motionQuery.matches || document.hidden) return
    last = performance.now()
    raf = requestAnimationFrame(frame)
  }

  function stop() {
    cancelAnimationFrame(raf)
    raf = 0
  }

  function handleVisibility() {
    if (document.hidden) stop()
    else start()
  }

  function handleMotion() {
    if (motionQuery.matches) {
      stop()
      drawStatic()
    } else {
      start()
    }
  }

  onMounted(() => {
    const canvas = canvasRef.value
    ctx = canvas.getContext('2d')
    readColors()
    resize()

    resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(canvas)

    themeObserver = new MutationObserver(() => {
      readColors()
      if (motionQuery.matches) drawStatic()
    })
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })

    document.addEventListener('visibilitychange', handleVisibility)
    motionQuery.addEventListener('change', handleMotion)
    start()
  })

  onBeforeUnmount(() => {
    stop()
    resizeObserver?.disconnect()
    themeObserver?.disconnect()
    document.removeEventListener('visibilitychange', handleVisibility)
    motionQuery.removeEventListener('change', handleMotion)
  })
}