<template>
  <div class="career">

    <!-- Cover -->
    <div class="cover-wrap">
      <img :src="coverImg" alt="Cristina Tutunariu" class="cover-img" />
      <div class="cover-overlay"></div>
    </div>

    <!-- Content -->
    <div class="career-content">

      <!-- Intro -->
      <section class="career-section">
        <p class="section-eyebrow">Who I am</p>
        <h1 class="career-title">
          I spent most of my childhood<br>
          wondering how things worked<br>
          <em>and never asking out loud.</em>
        </h1>
      </section>

      <!-- Origin story -->
      <section class="career-section">
        <p class="section-eyebrow">How I got here</p>
        <div class="story">
          <p>I didn't start in tech. I started in dance, tennis, languages, and at some point seriously considered neuropsychology. I changed direction more times than I'd like to admit — but looking back, the thread was always the same: I wanted to understand how things work.</p>
          <p>Somewhere along the way I chose the "safer" path at school. Business over engineering. Easier, I thought. It wasn't really my direction, but I learned I loved the logic of it. IT kept coming up. I kept ignoring it. Then I stopped ignoring it.</p>
          <p>In 2023, last minute and a little lost, I applied for computer engineering. First year was rough. Third semester it clicked. And after 3 years of computer engineering and a lot of self-doubt, today I managed to turn on my first LED on a breadboard.</p>
        </div>

        <div class="led-wrap">
          <img :src="ledImg" alt="First LED on a breadboard" class="led-img" />
          <p class="led-caption">My first LED. Green, obviously.</p>
        </div>
      </section>

      <!-- What drives me -->
      <section class="career-section">
        <p class="section-eyebrow">What drives me</p>
        <p class="story-single">Medical devices that solve real problems. Taking everyday technology apart, finding the constraints, making it better. The intersection of hardware, software, and human health — with a quiet interest in aerospace that never fully went away.</p>
        <p class="story-single">What draws me to medtech specifically is the weight of it. A device that works in a hospital or in a patient's home has to work — not mostly, not usually, but always. That kind of constraint forces a different quality of thinking, and I find that more interesting than building things where failure is just a bug to fix later.</p>
        <p class="story-single">There's also a quieter interest in aerospace that never fully went away. Devices that need to function under extreme conditions, in environments humans weren't designed for — that intersection with health monitoring and life support sits somewhere I'd like to explore one day.</p>
        <div class="interest-chips">
          <span class="chip accent">Medical devices</span>
          <span class="chip accent">Embedded systems</span>
          <span class="chip accent">Innovation</span>
          <span class="chip">Aerospace</span>
          <span class="chip">Neuropsychology</span>
          <span class="chip">Systems thinking</span>
        </div>
      </section>

      <!-- How I work -->
      <section class="career-section">
        <p class="section-eyebrow">How I work</p>
        <div class="philo-grid">
          <div class="philo-card">
            <svg class="philo-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>
            <h3 class="philo-title">Quality over quantity</h3>
            <p class="philo-desc">I take my time understanding things deeply before moving forward.</p>
          </div>
          <div class="philo-card">
            <svg class="philo-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            <h3 class="philo-title">Purpose over obligation</h3>
            <p class="philo-desc">I don't work for the sake of working. Something needs to be better than it is.</p>
          </div>
          <div class="philo-card">
            <svg class="philo-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
            <h3 class="philo-title">Structure enables freedom</h3>
            <p class="philo-desc">I believe in systems and process — not as constraints, but as foundations.</p>
          </div>
          <div class="philo-card">
            <svg class="philo-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            <h3 class="philo-title">Small and trusted</h3>
            <p class="philo-desc">I work best alone or with someone I trust. Depth over breadth.</p>
          </div>
        </div>
      </section>

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
import coverImg from '@/assets/images/about-cover.png'
import ledImg from '@/assets/images/about-led.jpg'
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

/* ── Story ── */
.story { display: flex; flex-direction: column; gap: var(--space-4); margin-bottom: var(--space-12); }
.story p { font-size: var(--text-base); color: var(--text-secondary); line-height: var(--leading-normal); max-width: 100%; }
.story-single { font-size: var(--text-base); color: var(--text-secondary); line-height: var(--leading-normal); margin-bottom: var(--space-4); }

/* ── LED ── */
.led-wrap { max-width: 480px; margin: 0 auto; }
.led-img { width: 100%; border-radius: var(--radius-lg); display: block; margin-bottom: var(--space-2); }
.led-caption { font-size: var(--text-xs); color: var(--text-muted); font-family: var(--font-mono); letter-spacing: 0.04em; text-align: center; }

/* ── Chips ── */
.interest-chips { display: flex; flex-wrap: wrap; gap: var(--space-2); }
.chip { display: inline-block; font-size: var(--text-xs); padding: var(--space-1) var(--space-3); border-radius: var(--radius-pill); border: 1px solid var(--border-default); color: var(--text-secondary); background: var(--bg-secondary); }
.chip.accent { border-color: rgba(74,158,106,0.3); color: var(--accent-primary); background: rgba(74,158,106,0.08); }

/* ── Philosophy ── */
.philo-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-4); }
.philo-card { padding: var(--space-6); border-radius: var(--radius-lg); border: 1px solid var(--border-subtle); background: var(--bg-secondary); transition: border-color var(--transition-fast), background var(--transition-fast); }
.philo-card:hover { border-color: var(--accent-primary); background: var(--bg-surface); }
.philo-icon { color: var(--accent-primary); margin-bottom: var(--space-3); display: block; }
.philo-title { font-size: var(--text-base); font-weight: 500; color: var(--text-primary); margin-bottom: var(--space-2); }
.philo-desc { font-size: var(--text-sm); color: var(--text-muted); line-height: var(--leading-normal); max-width: 100%; }

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