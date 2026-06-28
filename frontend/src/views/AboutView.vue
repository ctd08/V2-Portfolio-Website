<template>
  <div class="about">

    <!-- Cover -->
    <div class="cover-wrap">
      <img :src="coverImg" alt="Cristina Tutunariu" class="cover-img" />
      <div class="cover-overlay"></div>
    </div>

    <!-- Content -->
    <div class="about-content">

      <!-- Intro -->
      <section class="about-section">
        <p class="section-eyebrow">Who I am</p>
        <h1 class="about-title">
          I spent most of my childhood<br>
          wondering how things worked and never asking out loud. <br>
          <em>Now I build them.</em>
        </h1>
      </section>

      <!-- Origin story -->
      <section class="about-section">
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
        <section class="about-section">
        <p class="section-eyebrow">What drives me</p>
        <p class="story-single">
            I want to build medical devices that solve real problems — not just incremental improvements, but things that genuinely change what's possible for doctors and patients. The kind of work where you take a constraint seriously, sit with it long enough, and come out the other side with something that didn't exist before.
        </p>
        <p class="story-single">
            What draws me to medtech specifically is the weight of it. A device that works in a hospital or in a patient's home has to work — not mostly, not usually, but always. That kind of constraint forces a different quality of thinking, and I find that more interesting than building things where failure is just a bug to fix later.
        </p>
        <p class="story-single">
            There's also a quieter interest in aerospace that never fully went away. Devices that need to function under extreme conditions, in environments humans weren't designed for — that intersection with health monitoring and life support sits somewhere I'd like to explore one day.
        </p>
        <div class="interest-chips" style="margin-top: var(--space-6)">
            <span class="chip accent">Medical devices</span>
            <span class="chip accent">Embedded systems</span>
            <span class="chip accent">Aerospace</span>
            <span class="chip accent">Neuropsychology</span>
            <span class="chip accent">Neuroscience</span>
            <span class="chip accent">PCB Design</span>
            <span class="chip accent">Signal processing</span>
            <span class="chip accent">Robotics</span>
            <span class="chip accent">Machine learning</span>
        </div>
        </section>

      <!-- How I work -->
      <section class="about-section">
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

      <!-- Projects CTA -->
      <section class="about-section">
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
import coverImg from '@/assets/images/about-cover.png'
import ledImg from '@/assets/images/about-led.jpg'
</script>

<style scoped>
.about {
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
  object-position: center top;
}

.cover-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 40%, var(--bg-primary) 100%);
}

/* ── Content ── */
.about-content {
  padding: 0 var(--space-6);
  max-width: 780px;
  margin: 0 auto;
}

.about-section {
  padding: var(--space-16) 0;
  border-bottom: 1px solid var(--border-subtle);
}

.about-section:last-child {
  border-bottom: none;
}

.section-eyebrow {
  font-size: var(--text-xs);
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--accent-primary);
  margin-bottom: var(--space-4);
}

/* ── Intro ── */
.about-title {
  font-family: var(--font-display);
  font-size: clamp(var(--text-3xl), 4vw, var(--text-5xl));
  line-height: var(--leading-tight);
  color: var(--text-primary);
  font-weight: 400;
}

.about-title em {
  font-style: italic;
  color: var(--accent-primary);
}

/* ── Story ── */
.story {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  max-width: 640px;
  margin-bottom: var(--space-12);
}

.story p {
  font-size: var(--text-base);
  color: var(--text-secondary);
  line-height: var(--leading-normal);
  max-width: 100%;
}

.story-single {
  font-size: var(--text-base);
  color: var(--text-secondary);
  line-height: var(--leading-normal);
  max-width: 640px;
  margin-bottom: var(--space-6);
}

/* ── LED photo ── */
.led-wrap {
  max-width: 480px;
  margin: 0 auto;
}

.led-img {
  width: 100%;
  border-radius: var(--radius-lg);
  display: block;
  margin-bottom: var(--space-2);
  object-position: center;
}

.led-caption {
  font-size: var(--text-xs);
  color: var(--text-muted);
  font-family: var(--font-mono);
  letter-spacing: 0.04em;
}

/* ── Interest chips ── */
.interest-chips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.chip {
  display: inline-block;
  font-size: var(--text-xs);
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-pill);
  border: 1px solid var(--border-default);
  color: var(--text-secondary);
  background: var(--bg-secondary);
}

.chip.accent {
  border-color: rgba(74, 158, 106, 0.3);
  color: var(--accent-primary);
  background: rgba(74, 158, 106, 0.08);
}

/* ── Philosophy grid ── */
.philo-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-4);
}

.philo-card {
  padding: var(--space-6);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-subtle);
  background: var(--bg-secondary);
  transition: border-color var(--transition-fast), background var(--transition-fast);
}

.philo-card:hover {
  border-color: var(--accent-primary);
  background: var(--bg-surface);
}

.philo-icon {
  color: var(--accent-primary);
  margin-bottom: var(--space-3);
  display: block;
}

.philo-title {
  font-size: var(--text-base);
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: var(--space-2);
}

.philo-desc {
  font-size: var(--text-sm);
  color: var(--text-muted);
  line-height: var(--leading-normal);
  max-width: 100%;
}

/* ── CTA ── */
.cta-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-8);
  padding: var(--space-8) var(--space-8);
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-subtle);
}

.cta-title {
  font-size: var(--text-lg);
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: var(--space-1);
}

.cta-sub {
  font-size: var(--text-sm);
  color: var(--text-muted);
  max-width: 100%;
}

.btn-primary {
  display: inline-block;
  background: var(--accent-primary);
  color: var(--bg-primary);
  font-size: var(--text-sm);
  font-weight: 500;
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-pill);
  text-decoration: none;
  white-space: nowrap;
  flex-shrink: 0;
  transition: opacity var(--transition-fast);
}

.btn-primary:hover {
  opacity: 0.85;
}

/* ── Mobile ── */
@media (max-width: 768px) {
  .philo-grid {
    grid-template-columns: 1fr;
  }

  .cta-bar {
    flex-direction: column;
    align-items: flex-start;
  }

  .cover-wrap {
    height: 50vh;
    min-height: 320px;
  }
}
</style>