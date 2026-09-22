<template>
  <div class="career">

    <!-- Cover -->
    <div class="cover-wrap">
      <img :src="coverImg" alt="Cristina Tutunariu" class="cover-img" />
      <div class="cover-overlay"></div>
    </div>

    <!-- Content -->
    <div class="career-content">


      <!-- Timeline -->
      <section class="career-section">
        <p class="section-eyebrow">Experience</p>
        <div class="legend">
          <div class="legend-item">
            <div class="legend-dot edu"></div>
            <span>Education</span>
          </div>
          <div class="legend-item">
            <div class="legend-dot work"></div>
            <span>Work</span>
          </div>
          <div class="legend-item">
            <div class="legend-dot both"></div>
            <span>Overlap</span>
          </div>
        </div>

        <div class="timeline">
          <div class="timeline-line"></div>

          <div
            v-for="entry in timeline"
            :key="entry.id"
            class="tl-entry fade-in"
            :ref="el => { if (el) fadeEls.push(el) }"
          >
            <!-- Left slot -->
            <div class="tl-left">
              <RouterLink
                v-if="entry.side === 'left'"
                :to="entry.link"
                class="tl-card"
                :class="entry.type"
              >
                <div class="card-year">{{ entry.year }}</div>
                <div class="card-title">{{ entry.title }}</div>
                <div class="card-sub">{{ entry.sub }}</div>
                <span class="card-tag" :class="entry.type">
                  {{ entry.type === 'edu' ? 'Education' : 'Work' }}
                </span>
              </RouterLink>
            </div>

            <!-- Dot -->
            <div class="tl-dot-wrap">
              <div
                class="tl-dot"
                :class="entry.overlap ? 'both' : entry.type"
              ></div>
            </div>

            <!-- Right slot -->
            <div class="tl-right">
              <RouterLink
                v-if="entry.side === 'right'"
                :to="entry.link"
                class="tl-card"
                :class="entry.type"
              >
                <div class="card-year">{{ entry.year }}</div>
                <div class="card-title">{{ entry.title }}</div>
                <div class="card-sub">{{ entry.sub }}</div>
                <span class="card-tag" :class="entry.type">
                  {{ entry.type === 'edu' ? 'Education' : 'Work' }}
                </span>
              </RouterLink>

              <RouterLink
                v-if="entry.overlap"
                :to="entry.overlap.link"
                class="tl-card work"
                style="margin-top: var(--space-2)"
              >
                <div class="card-year">{{ entry.overlap.year }}</div>
                <div class="card-title">{{ entry.overlap.title }}</div>
                <div class="card-sub">{{ entry.overlap.sub }}</div>
                <span class="card-tag work">Work</span>
              </RouterLink>
            </div>
          </div>
        </div>
      </section>

      <!-- Projects CTA -->
      <section class="career-section">
        <div class="cta-bar">
          <div>
            <p class="cta-title">Want to see what I've built so far?</p>
            <p class="cta-sub">Projects range from embedded systems to web applications.</p>
          </div>
          <RouterLink to="/projects" class="btn-primary">See my projects →</RouterLink>
        </div>
      </section>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import coverImg from '@/assets/images/evolution.png'
import { timeline } from '@/data/timeline.js'

const fadeEls = ref([])
let observer = null

onMounted(() => {
  observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible')
        observer.unobserve(e.target)
      }
    })
  }, { threshold: 0.1 })

  fadeEls.value.forEach((el, i) => {
    el.style.transitionDelay = `${i * 80}ms`
    observer.observe(el)
  })
})

onUnmounted(() => {
  if (observer) observer.disconnect()
})
</script>

<style scoped>
.career {
  max-width: var(--max-width);
  margin: 0 auto;
  padding-bottom: var(--space-24);
}

/* ── Cover ── */
.cover-wrap {
  position: relative;
  width: 100%;
  height: 70vh;
  min-height: 480px;
  max-height: 700px;
  overflow: hidden;
}
.cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center center;
}
.cover-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 40%, var(--bg-primary) 100%);
}

/* ── Content ── */
.career-content {
  padding: 0 var(--space-6);
  max-width: 780px;
  margin: 0 auto;
}

.career-section {
  padding: var(--space-16) 0;
  border-bottom: 1px solid var(--border-subtle);
}
.career-section:last-child { border-bottom: none; }

.section-eyebrow {
  font-size: var(--text-xs);
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--accent-primary);
  margin-bottom: var(--space-4);
}

/* ── Intro ── */
.career-title {
  font-family: var(--font-display);
  font-size: clamp(var(--text-3xl), 4vw, var(--text-5xl));
  line-height: var(--leading-tight);
  color: var(--text-primary);
  font-weight: 400;
}
.career-title em { font-style: italic; color: var(--accent-primary); }


/* ── Legend ── */
.legend { display: flex; gap: var(--space-6); margin-bottom: var(--space-8); flex-wrap: wrap; }
.legend-item { display: flex; align-items: center; gap: var(--space-2); font-size: var(--text-sm); color: var(--text-secondary); }
.legend-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
.legend-dot.edu { background: var(--accent-primary); }
.legend-dot.work { background: var(--accent-warm); }
.legend-dot.both { background: var(--color-green-300); }

/* ── Timeline ── */
.timeline {
  position: relative;
  padding: var(--space-4) 0;
}
.timeline-line {
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 1px;
  background: var(--border-default);
  transform: translateX(-50%);
}

.tl-entry {
  display: grid;
  grid-template-columns: 1fr 40px 1fr;
  gap: 0;
  margin-bottom: var(--space-8);
  align-items: start;
}

.tl-left { padding-right: var(--space-6); display: flex; justify-content: flex-end; }
.tl-right { padding-left: var(--space-6); display: flex; flex-direction: column; }

.tl-dot-wrap {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 16px;
  z-index: 1;
}
.tl-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
  border: 2px solid var(--bg-primary);
}
.tl-dot.edu { background: var(--accent-primary); }
.tl-dot.work { background: var(--accent-warm); }
.tl-dot.both { background: var(--color-green-300); }

/* ── Cards ── */
.tl-card {
  display: block;
  text-decoration: none;
  padding: var(--space-4) var(--space-5);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-subtle);
  background: var(--bg-secondary);
  transition: border-color var(--transition-fast), background var(--transition-fast);
  max-width: 280px;
}
.tl-card:hover { border-color: var(--accent-primary); background: var(--bg-surface); }

.card-year { font-size: var(--text-xs); color: var(--text-muted); font-family: var(--font-mono); margin-bottom: var(--space-1); }
.card-title { font-size: var(--text-sm); font-weight: 500; color: var(--text-primary); margin-bottom: 2px; }
.card-sub { font-size: var(--text-xs); color: var(--text-secondary); line-height: 1.5; margin-bottom: var(--space-2); }
.card-tag { display: inline-block; font-size: 10px; padding: 2px 8px; border-radius: var(--radius-sm); font-family: var(--font-mono); }
.card-tag.edu { background: rgba(74,158,106,0.1); color: var(--accent-primary); }
.card-tag.work { background: rgba(200,169,110,0.1); color: var(--accent-warm); }

/* ── Fade in ── */
.fade-in { opacity: 0; transform: translateY(16px); transition: opacity 0.5s ease, transform 0.5s ease; }
.fade-in.visible { opacity: 1; transform: translateY(0); }

/* ── CTA ── */
.cta-bar { display: flex; align-items: center; justify-content: space-between; gap: var(--space-8); padding: var(--space-8); background: var(--bg-secondary); border-radius: var(--radius-lg); border: 1px solid var(--border-subtle); }
.cta-title { font-size: var(--text-lg); font-weight: 500; color: var(--text-primary); margin-bottom: var(--space-1); }
.cta-sub { font-size: var(--text-sm); color: var(--text-muted); }
.btn-primary { display: inline-block; background: var(--accent-primary); color: var(--bg-primary); font-size: var(--text-sm); font-weight: 500; padding: var(--space-3) var(--space-6); border-radius: var(--radius-pill); text-decoration: none; white-space: nowrap; flex-shrink: 0; transition: opacity var(--transition-fast); }
.btn-primary:hover { opacity: 0.85; }

/* ── Mobile ── */
@media (max-width: 768px) {
  .philo-grid { grid-template-columns: 1fr; }
  .cta-bar { flex-direction: column; align-items: flex-start; }
  .timeline-line { left: 16px; }
  .tl-entry { grid-template-columns: 32px 1fr; }
  .tl-left { display: none; }
  .tl-right { padding-left: var(--space-4); }
  .tl-card { max-width: 100%; }
}
</style>