<template>
  <div class="contact">

    <!-- Cover -->
    <div class="cover-wrap">
      <img :src="coverImg" alt="Contact" class="cover-img" />
      <div class="cover-overlay"></div>
    </div>

    <!-- Form -->
    <div class="contact-content">
      <section class="contact-section">
        <p class="section-eyebrow">Get in touch</p>
        <h1 class="contact-title">
          Let's <em>talk.</em>
        </h1>
        <p class="contact-sub">Fill in the form below and I'll get back to you as soon as I can.</p>

        <form class="contact-form" @submit.prevent="submitForm">

          <div class="form-row">
            <div class="form-group">
              <label for="name">Name <span class="required">*</span></label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                placeholder="Your name"
                :class="{ error: errors.name }"
              />
              <span v-if="errors.name" class="error-msg">{{ errors.name }}</span>
            </div>

            <div class="form-group">
              <label for="email">Email <span class="required">*</span></label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                placeholder="your@email.com"
                :class="{ error: errors.email }"
              />
              <span v-if="errors.email" class="error-msg">{{ errors.email }}</span>
            </div>
          </div>

          <div class="form-group">
            <label for="subject">Subject <span class="required">*</span></label>
            <select
              id="subject"
              v-model="form.subject"
              :class="{ error: errors.subject }"
            >
              <option value="" disabled>Select a subject</option>
              <option value="Getting in touch">Getting in touch</option>
              <option value="Requesting personal info">Requesting personal info</option>
              <option value="Requesting services">Requesting services</option>
              <option value="Feedback / critique">Feedback / critique</option>
              <option value="Report an issue">Report an issue</option>
            </select>
            <span v-if="errors.subject" class="error-msg">{{ errors.subject }}</span>
          </div>

          <div class="form-group">
            <label for="message">Message <span class="required">*</span></label>
            <textarea
              id="message"
              v-model="form.message"
              placeholder="Your message..."
              rows="6"
              :class="{ error: errors.message }"
            ></textarea>
            <span v-if="errors.message" class="error-msg">{{ errors.message }}</span>
          </div>

          <div class="form-footer">
            <span class="required-note">* Required fields</span>
            <button type="submit" class="btn-submit" :disabled="loading">
              <span v-if="loading">Sending...</span>
              <span v-else>Send message →</span>
            </button>
          </div>

          <!-- Success message -->
          <Transition name="fade">
            <div v-if="success" class="success-msg">
              ✓ Message sent. I'll get back to you soon.
            </div>
          </Transition>

          <!-- Error message -->
          <Transition name="fade">
            <div v-if="serverError" class="server-error-msg">
              Something went wrong. Please try again or email me directly.
            </div>
          </Transition>

        </form>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import coverImg from '@/assets/images/connect_cover.png'

const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: '',
})

const errors = reactive({
  name: '',
  email: '',
  subject: '',
  message: '',
})

const loading = ref(false)
const success = ref(false)
const serverError = ref(false)

function validate() {
  let valid = true
  errors.name = ''
  errors.email = ''
  errors.subject = ''
  errors.message = ''

  if (!form.name.trim()) {
    errors.name = 'Name is required.'
    valid = false
  }

  if (!form.email.trim()) {
    errors.email = 'Email is required.'
    valid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Please enter a valid email address.'
    valid = false
  }

  if (!form.subject) {
    errors.subject = 'Please select a subject.'
    valid = false
  }

  if (!form.message.trim()) {
    errors.message = 'Message is required.'
    valid = false
  } else if (form.message.trim().length < 10) {
    errors.message = 'Message is too short.'
    valid = false
  }

  return valid
}

async function submitForm() {
  if (!validate()) return

  loading.value = true
  serverError.value = false
  success.value = false

  try {
    const res = await fetch('http://localhost:8000/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    if (!res.ok) throw new Error('Server error')

    success.value = true
    form.name = ''
    form.email = ''
    form.subject = ''
    form.message = ''

  } catch (e) {
    serverError.value = true
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.contact {
  max-width: var(--max-width);
  margin: 0 auto;
  padding-bottom: var(--space-24);
}

/* ── Cover ── */
.cover-wrap {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 7;
  overflow: hidden;
}
.cover-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center center;
  background: var(--bg-primary);
}
.cover-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 40%, var(--bg-primary) 100%);
}

/* ── Content ── */
.contact-content {
  padding: 0 var(--space-6);
  max-width: 640px;
  margin: 0 auto;
}

.contact-section {
  padding: var(--space-16) 0;
}

.section-eyebrow {
  font-size: var(--text-xs);
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--accent-primary);
  margin-bottom: var(--space-4);
}

.contact-title {
  font-family: var(--font-display);
  font-size: clamp(var(--text-3xl), 4vw, var(--text-5xl));
  line-height: var(--leading-tight);
  color: var(--text-primary);
  font-weight: 400;
  margin-bottom: var(--space-4);
}
.contact-title em { font-style: italic; color: var(--accent-primary); }

.contact-sub {
  font-size: var(--text-base);
  color: var(--text-secondary);
  margin-bottom: var(--space-10);
}

/* ── Form ── */
.contact-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-6);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

label {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--text-primary);
}

.required { color: var(--accent-primary); }

input, select, textarea {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-default);
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: var(--text-sm);
  transition: border-color var(--transition-fast), background var(--transition-fast);
  appearance: none;
}

input:focus, select:focus, textarea:focus {
  outline: none;
  border-color: var(--accent-primary);
  background: var(--bg-surface);
}

input.error, select.error, textarea.error {
  border-color: #c0625a;
}

textarea { resize: vertical; min-height: 140px; }

.error-msg {
  font-size: var(--text-xs);
  color: #c0625a;
  font-family: var(--font-mono);
}

/* ── Footer ── */
.form-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--space-4);
}

.required-note {
  font-size: var(--text-xs);
  color: var(--text-muted);
  font-family: var(--font-mono);
}

.btn-submit {
  display: inline-block;
  background: var(--accent-primary);
  color: var(--bg-primary);
  font-size: var(--text-sm);
  font-weight: 500;
  padding: var(--space-3) var(--space-8);
  border-radius: var(--radius-pill);
  border: none;
  cursor: pointer;
  transition: opacity var(--transition-fast);
  font-family: var(--font-body);
}
.btn-submit:hover { opacity: 0.85; }
.btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }

/* ── Messages ── */
.success-msg {
  padding: var(--space-4) var(--space-6);
  border-radius: var(--radius-md);
  background: rgba(74, 158, 106, 0.1);
  border: 1px solid rgba(74, 158, 106, 0.3);
  color: var(--accent-primary);
  font-size: var(--text-sm);
  font-family: var(--font-mono);
}

.server-error-msg {
  padding: var(--space-4) var(--space-6);
  border-radius: var(--radius-md);
  background: rgba(192, 98, 90, 0.1);
  border: 1px solid rgba(192, 98, 90, 0.3);
  color: #c0625a;
  font-size: var(--text-sm);
  font-family: var(--font-mono);
}

/* ── Transitions ── */
.fade-enter-active, .fade-leave-active { transition: opacity var(--transition-base); }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* ── Mobile ── */
@media (max-width: 640px) {
  .form-row { grid-template-columns: 1fr; }
  .form-footer { flex-direction: column; align-items: flex-start; }
}
</style>