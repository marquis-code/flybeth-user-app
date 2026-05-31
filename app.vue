<!-- <template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <GlobalToastContainer />
  </div>
</template>

<script setup lang="ts">
import GlobalToastContainer from '@/components/core/GlobalToastContainer.vue'
</script> -->

<template>
  <div class="coming-soon">
    <!-- Animated background blobs -->
    <div class="blob blob-1" />
    <div class="blob blob-2" />
    <div class="blob blob-3" />

    <!-- Floating decorative icons -->
    <div class="floaters" aria-hidden="true">
      <span class="float f1">✈️</span>
      <span class="float f2">🌴</span>
      <span class="float f3">🗺️</span>
      <span class="float f4">⛵</span>
      <span class="float f5">🌊</span>
      <span class="float f6">🏔️</span>
    </div>

    <main class="content">
      <!-- Badge -->
      <div class="badge">
        <span class="badge-dot" />
        Launching Soon
      </div>

      <!-- Logo / Brand -->
      <div class="brand">
        <!-- <div class="logo-ring"> -->
          <img src="@/assets/img/logo.png" class="h-14 w-auto" />
        <!-- </div> -->
        <!-- <h1 class="brand-name">
          <span class="brand-light">fly</span><span class="brand-bold">beth</span>
        </h1> -->
      </div>

      <!-- Headline -->
      <div class="headline-wrap">
        <h2 class="headline">
          Your Next Adventure<br />
          <span class="headline-accent">Awaits You</span>
        </h2>
        <p class="subtext">
          We're crafting an extraordinary travel experience just for you.
          Destinations curated with love, journeys built for memories.
        </p>
      </div>

      <!-- Countdown -->
      <!-- <div class="countdown-wrap">
        <div
          v-for="unit in countdown"
          :key="unit.label"
          class="countdown-block"
        >
          <div class="countdown-num">{{ unit.value }}</div>
          <div class="countdown-label">{{ unit.label }}</div>
        </div>
      </div> -->

      <!-- Email capture -->
      <!-- <div class="email-section">
        <p class="email-hint">Be the first to explore. No spam, ever. 🌍</p>
        <div class="email-form">
          <input
            v-model="email"
            type="email"
            placeholder="your@email.com"
            class="email-input"
            :class="{ error: emailError }"
            @keyup.enter="subscribe"
          />
          <button class="email-btn" @click="subscribe">
            <span v-if="!submitted">Notify Me</span>
            <span v-else>✓ You're in!</span>
          </button>
        </div>
        <p v-if="emailError" class="error-msg">Please enter a valid email address.</p>
      </div> -->

      <!-- Socials -->
      <!-- <div class="socials">
        <a href="#" class="social-link" aria-label="Instagram">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="social-icon">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
            <circle cx="12" cy="12" r="4"/>
            <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
          </svg>
        </a>
        <a href="#" class="social-link" aria-label="Twitter / X">
          <svg viewBox="0 0 24 24" fill="currentColor" class="social-icon">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </a>
        <a href="#" class="social-link" aria-label="Facebook">
          <svg viewBox="0 0 24 24" fill="currentColor" class="social-icon">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        </a>
      </div> -->
    </main>

    <!-- Bottom tagline -->
    <footer class="footer-tagline">
      © 2026 Flybeth
    </footer>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'

// --- Countdown ---
const launchDate = new Date('2025-09-01T00:00:00')

const countdown = reactive([
  { label: 'Days', value: '00' },
  { label: 'Hours', value: '00' },
  { label: 'Mins', value: '00' },
  { label: 'Secs', value: '00' },
])

let timer = null

function updateCountdown() {
  const now = new Date()
  const diff = launchDate - now
  if (diff <= 0) {
    countdown[0].value = '00'
    countdown[1].value = '00'
    countdown[2].value = '00'
    countdown[3].value = '00'
    return
  }
  const pad = n => String(Math.floor(n)).padStart(2, '0')
  countdown[0].value = pad(diff / (1000 * 60 * 60 * 24))
  countdown[1].value = pad((diff / (1000 * 60 * 60)) % 24)
  countdown[2].value = pad((diff / (1000 * 60)) % 60)
  countdown[3].value = pad((diff / 1000) % 60)
}

onMounted(() => {
  updateCountdown()
  timer = setInterval(updateCountdown, 1000)
})
onUnmounted(() => clearInterval(timer))

// --- Email ---
const email = ref('')
const submitted = ref(false)
const emailError = ref(false)

function subscribe() {
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)
  if (!valid) { emailError.value = true; return }
  emailError.value = false
  submitted.value = true
  // TODO: connect to your email service — Flybeth
}
</script>

<style scoped>
/* ── Tokens ─────────────────────────────── */
:root {
  --sky: #e0f2fe;
  --ocean: #0ea5e9;
  --coral: #fb923c;
  --sand: #fef3c7;
  --deep: #0c1a2e;
  --white: #ffffff;
}

/* ── Base ───────────────────────────────── */
.coming-soon {
  position: relative;
  min-height: 100svh;
  background: linear-gradient(160deg, #e0f7ff 0%, #fef9ec 50%, #ffe8d6 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  font-family: 'Georgia', serif;
  padding: 2rem 1.25rem 1rem;
}

/* ── Background blobs ───────────────────── */
.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.45;
  pointer-events: none;
  animation: drift 14s ease-in-out infinite alternate;
}
.blob-1 {
  width: 420px; height: 420px;
  background: #bae6fd;
  top: -120px; left: -80px;
  animation-delay: 0s;
}
.blob-2 {
  width: 360px; height: 360px;
  background: #fed7aa;
  bottom: -100px; right: -60px;
  animation-delay: -5s;
}
.blob-3 {
  width: 280px; height: 280px;
  background: #fde68a;
  top: 40%; left: 55%;
  animation-delay: -9s;
}
@keyframes drift {
  from { transform: translate(0, 0) scale(1); }
  to   { transform: translate(30px, 20px) scale(1.08); }
}

/* ── Floating emojis ────────────────────── */
.floaters { position: absolute; inset: 0; pointer-events: none; }
.float {
  position: absolute;
  font-size: 1.6rem;
  opacity: 0.2;
  animation: floatUp 8s ease-in-out infinite;
}
.f1 { left: 6%;  top: 15%; animation-delay: 0s;    font-size: 2rem; }
.f2 { left: 88%; top: 20%; animation-delay: 1.5s; }
.f3 { left: 12%; top: 70%; animation-delay: 3s;   font-size: 1.4rem; }
.f4 { left: 80%; top: 65%; animation-delay: 2s; }
.f5 { left: 50%; top: 8%;  animation-delay: 4s;   font-size: 1.8rem; }
.f6 { left: 72%; top: 85%; animation-delay: 0.8s; }

@keyframes floatUp {
  0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.18; }
  50%       { transform: translateY(-18px) rotate(6deg); opacity: 0.28; }
}

/* ── Main content ───────────────────────── */
.content {
  position: relative;
  z-index: 10;
  max-width: 640px;
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  animation: fadeUp 0.9s ease both;
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(28px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ── Badge ──────────────────────────────── */
.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  background: rgba(255,255,255,0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(14,165,233,0.25);
  color: #0369a1;
  font-family: 'Helvetica Neue', sans-serif;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 0.4rem 1rem;
  border-radius: 999px;
}
.badge-dot {
  width: 7px; height: 7px;
  background: #22c55e;
  border-radius: 50%;
  box-shadow: 0 0 0 3px rgba(34,197,94,0.25);
  animation: pulse 2s infinite;
}
@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 3px rgba(34,197,94,0.25); }
  50%       { box-shadow: 0 0 0 6px rgba(34,197,94,0.1); }
}

/* ── Brand ──────────────────────────────── */
.brand {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}
.logo-ring {
  width: 72px; height: 72px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0ea5e9, #fb923c);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  box-shadow: 0 12px 32px rgba(14,165,233,0.35);
  animation: spin-slow 12s linear infinite;
}
@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
.brand-name {
  font-family: 'Georgia', serif;
  font-size: clamp(2.4rem, 8vw, 3.5rem);
  letter-spacing: -0.03em;
  line-height: 1;
  margin: 0;
  color: #0c1a2e;
}
.brand-light { font-weight: 300; color: #0ea5e9; }
.brand-bold  { font-weight: 700; color: #fb923c; }

/* ── Headline ───────────────────────────── */
.headline-wrap { display: flex; flex-direction: column; gap: 0.75rem; }
.headline {
  font-family: 'Georgia', serif;
  font-size: clamp(1.7rem, 6vw, 2.8rem);
  font-weight: 700;
  color: #0c1a2e;
  line-height: 1.2;
  margin: 0;
}
.headline-accent {
  background: linear-gradient(90deg, #0ea5e9, #fb923c);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.subtext {
  font-family: 'Helvetica Neue', sans-serif;
  font-size: clamp(0.9rem, 3vw, 1.05rem);
  color: #475569;
  line-height: 1.7;
  max-width: 480px;
  margin: 0 auto;
}

/* ── Countdown ──────────────────────────── */
.countdown-wrap {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: center;
}
.countdown-block {
  background: rgba(255,255,255,0.75);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(14,165,233,0.18);
  border-radius: 1.2rem;
  padding: 0.9rem 1.2rem 0.7rem;
  min-width: 72px;
  box-shadow: 0 4px 16px rgba(14,165,233,0.1);
  transition: transform 0.2s;
}
.countdown-block:hover { transform: translateY(-3px); }
.countdown-num {
  font-family: 'Georgia', serif;
  font-size: clamp(1.7rem, 5vw, 2.4rem);
  font-weight: 700;
  color: #0c1a2e;
  line-height: 1;
  letter-spacing: -0.02em;
}
.countdown-label {
  font-family: 'Helvetica Neue', sans-serif;
  font-size: 0.65rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #94a3b8;
  margin-top: 0.3rem;
}

/* ── Email ──────────────────────────────── */
.email-section { width: 100%; max-width: 440px; display: flex; flex-direction: column; gap: 0.6rem; }
.email-hint {
  font-family: 'Helvetica Neue', sans-serif;
  font-size: 0.8rem;
  color: #64748b;
}
.email-form {
  display: flex;
  gap: 0.5rem;
  background: rgba(255,255,255,0.8);
  backdrop-filter: blur(10px);
  border: 1.5px solid rgba(14,165,233,0.25);
  border-radius: 999px;
  padding: 0.35rem 0.35rem 0.35rem 1.2rem;
  box-shadow: 0 4px 20px rgba(14,165,233,0.12);
  transition: border-color 0.2s, box-shadow 0.2s;
}
.email-form:focus-within {
  border-color: #0ea5e9;
  box-shadow: 0 4px 24px rgba(14,165,233,0.22);
}
.email-input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-family: 'Helvetica Neue', sans-serif;
  font-size: 0.9rem;
  color: #0c1a2e;
  min-width: 0;
}
.email-input::placeholder { color: #94a3b8; }
.email-input.error { color: #ef4444; }
.email-btn {
  background: linear-gradient(135deg, #0ea5e9, #0284c7);
  color: white;
  border: none;
  border-radius: 999px;
  padding: 0.6rem 1.3rem;
  font-family: 'Helvetica Neue', sans-serif;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  transition: transform 0.15s, box-shadow 0.15s;
  box-shadow: 0 4px 12px rgba(14,165,233,0.35);
}
.email-btn:hover {
  transform: scale(1.04);
  box-shadow: 0 6px 18px rgba(14,165,233,0.45);
}
.error-msg {
  font-family: 'Helvetica Neue', sans-serif;
  font-size: 0.75rem;
  color: #ef4444;
}

/* ── Socials ────────────────────────────── */
.socials { display: flex; gap: 0.75rem; }
.social-link {
  width: 40px; height: 40px;
  display: flex; align-items: center; justify-content: center;
  border-radius: 50%;
  background: rgba(255,255,255,0.7);
  border: 1px solid rgba(14,165,233,0.2);
  color: #0369a1;
  text-decoration: none;
  transition: transform 0.2s, background 0.2s, color 0.2s;
}
.social-link:hover {
  transform: translateY(-3px);
  background: #0ea5e9;
  color: white;
}
.social-icon { width: 17px; height: 17px; }

/* ── Footer ─────────────────────────────── */
.footer-tagline {
  position: relative;
  z-index: 10;
  margin-top: 2rem;
  font-family: 'Helvetica Neue', sans-serif;
  font-size: 0.72rem;
  color: #94a3b8;
  letter-spacing: 0.03em;
}

/* ── Mobile ─────────────────────────────── */
@media (max-width: 480px) {
  .content { gap: 1.5rem; }
  .countdown-block { min-width: 60px; padding: 0.75rem 0.9rem 0.6rem; }
  .email-form { padding: 0.3rem 0.3rem 0.3rem 1rem; }
  .email-btn { padding: 0.55rem 1rem; font-size: 0.8rem; }
  .float { display: none; }
  .blob { opacity: 0.3; }
}
</style>