
## Overview

This document tracks the decisions, mistakes, fixes, and lessons learned throughout the building of V2-Portfolio-Website. It is written as a living log — updated as the project grows.

---
*Started on* March 24, 2026

## Phase 1 — Planning and direction

### Goals defined

- Build a professional portfolio website, treated as a real project from day one
- Use it as a learning vehicle for: advanced CSS/animations, CI/CD, self-hosted deployment, Docker, Linux
- Visual direction: bold, dark forest green aesthetic — serious but not sterile, informative but human
- Target audience: development, medtech, collaborators, users who look for inspiration, learners

### Stack decided

| Layer | Choice | Reason |
|---|---|---|
| Frontend framework | Vue 3 + Vite | Only framework with prior experience; solid foundation |
| Styling | Vanilla CSS with custom properties | Full control, no framework overhead |
| Animation | GSAP (planned) | Industry standard, plays well with Vue transitions |
| Hosting | Hetzner VPS (primary) + Vercel (mirror) | Learn real infrastructure; Vercel as reliability fallback |
| Web server | Caddy | Auto SSL, minimal config, beginner-friendly |
| Containerisation | Docker | Portable, reproducible deployments |
| CI/CD | GitHub Actions | Push to main → build → deploy automatically |

### Visual direction — mood board

- **Background**: near-black with green tint (`#0c110d`)
- **Primary accent**: forest green (`#2d6a4f`, `#4a9e6a`)
- **Warm accent**: amber/sand (`#c8a96e`) — stops it feeling too cold or too "hacker"
- **Light mode surface**: warm off-white (`#f3f4ef`)
- **Typography**: DM Serif Display (headings) + DM Sans (body)
- **Motion philosophy**: restrained — fade + upward drift on scroll, fast hovers (150ms), no parallax

---

## Phase 2 — Project structure

### Folder structure designed

```
V2-Portfolio-Website/
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   │   ├── fonts/
│   │   │   ├── images/
│   │   │   └── icons/
│   │   ├── styles/
│   │   │   ├── tokens.css
│   │   │   ├── reset.css
│   │   │   ├── typography.css
│   │   │   └── main.css
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── AppNav.vue
│   │   │   │   └── AppFooter.vue
│   │   │   ├── ui/
│   │   │   │   ├── BaseButton.vue
│   │   │   │   └── BaseTag.vue
│   │   │   └── sections/
│   │   │       ├── HeroSection.vue
│   │   │       ├── ProjectsSection.vue
│   │   │       └── AboutSection.vue
│   │   ├── views/
│   │   │   ├── HomeView.vue
│   │   │   └── ProjectView.vue
│   │   ├── composables/
│   │   │   └── useTheme.js
│   │   ├── data/
│   │   │   └── projects.js
│   │   ├── router/
│   │   │   └── index.js
│   │   ├── App.vue
│   │   └── main.js
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── backend/
│   └── .gitkeep
├── .github/
│   └── workflows/
│       └── deploy.yml
├── docs/
├── Dockerfile
├── .dockerignore
├── .gitignore
└── README.md
```

### Key structural decisions

**Why `styles/` instead of one `style.css`?**
A single CSS file grows unmanageable. Splitting by responsibility keeps things clear: `tokens.css` holds all CSS variables (colours, spacing, fonts), `reset.css` normalises browser defaults, `typography.css` handles font faces and scale, and `main.css` imports all three.

**Why `components/layout/`, `components/ui/`, `components/sections/`?**
Three clear jobs: `layout/` wraps pages structurally (nav, footer), `ui/` holds small reusable primitives prefixed `Base`, and `sections/` holds the large content blocks that make up each page.

**Why `composables/`?**
Vue 3 composables are functions that encapsulate reusable stateful logic. `useTheme.js` manages light/dark mode in one place, shared across any component that needs it. Future additions: `useScrollPosition.js`, `useActiveSection.js`.

**Why `data/projects.js`?**
Content separated from templates. Updating the portfolio means editing one file, not hunting through components.

**Why `backend/` with `.gitkeep`?**
Git does not track empty folders — only files. `.gitkeep` is a blank dummy file that forces Git to acknowledge the folder, preserving the intended structure for anyone who clones the repo.

---

## Phase 3 — Git setup

### Problems encountered and fixed

#### Problem 1 — Embedded Git repository
Vite scaffolded the project inside `frontend/portfolio/` and created its own `.git` there. Running `git add .` from the root triggered a warning about embedded repositories.

**Fix:**
```bash
rm -rf frontend/.git
```

#### Problem 2 — Double nesting (`frontend/portfolio/`)
Vite created `frontend/portfolio/` when scaffolded inside an existing folder. The extra nesting added no value.

**Fix:**
```bash
mv frontend/portfolio/* frontend/
mv frontend/portfolio/.* frontend/ 2>/dev/null; true
rmdir frontend/portfolio
```
Note: `rmdir` failed at first because `.vscode/` was inside. Moved it first, then removed the empty folder.

#### Problem 3 — GitHub repo initialised with a README
Creating the GitHub repo with a README generates a commit that the local repo doesn't have. Pushing fails with "fetch first".

**Fix:**
```bash
git pull origin main --allow-unrelated-histories --no-rebase
git push origin main
```
Also set globally to avoid future prompts:
```bash
git config --global pull.rebase false
```

#### Problem 4 — Ghost folders in GitHub (`V2-Portfolio-Website/` nested, `frontend/portfolio` persisting)
Caused by the initial `git init` being run one level too high, and the old history being merged in. The old structure was baked into Git history and wouldn't go away with a normal push.

**Fix:** Delete the GitHub repo, nuke the local `.git`, and reinitialise cleanly.
```bash
rm -rf .git
git init
git add .
git commit -m "chore: initial project structure"
```
Then create a new blank GitHub repo (no README) and push fresh.

#### Problem 5 — Wrong GitHub account pushing
Git was configured with the wrong user credentials, causing pushes to go to the wrong account.

**Fix — set correct identity globally:**
```bash
git config --global user.name "YourName"
git config --global user.email "your@email.com"
```

**Fix — set up SSH key to avoid password prompts:**
```bash
ssh-keygen -t ed25519 -C "your@email.com"
cat ~/.ssh/id_ed25519.pub
# Paste output into GitHub → Settings → SSH and GPG keys → New SSH key

git remote set-url origin git@github.com:ctd08/V2-Portfolio-Website.git
```
SSH keys authenticate silently from this point — no password prompts, always the correct account.

### Commit convention adopted — Conventional Commits

| Prefix | Use for |
|---|---|
| `chore:` | Setup, structure, tooling — no logic changed |
| `feat:` | New feature |
| `fix:` | Bug fix |
| `style:` | CSS / visual changes only |
| `docs:` | Documentation changes |
| `refactor:` | Restructuring without behaviour change |

---

## Concepts learned in this phase

**Hetzner** — German cloud hosting provider. Rents you a slice of a real Linux server (VPS) with root access. Comparable to DigitalOcean or AWS EC2. Not a web server — just the machine you install a web server on.

**Caddy / Nginx / Apache** — web server software installed *on* the VPS. Receives HTTP requests and serves your app to visitors. Caddy is preferred for solo projects because it handles SSL certificates automatically.

**Composables** — Vue 3 functions (`useX()`) that encapsulate reusable stateful logic. Replaces mixins from Vue 2. Keeps components thin and logic shareable.

**`.gitkeep`** — not an official Git feature. A blank file by convention, used to force Git to track an otherwise empty directory.

**Conventional Commits** — a commit message convention that makes history readable and enables automated tooling (changelogs, semantic versioning) later.

**SSH keys** — a pair of cryptographic keys (public + private). You give GitHub the public key; your machine keeps the private key. Git uses them to authenticate silently without a password.

---
**April 3rd - 4th** 

## Phase 5 — First component: AppNav

### Files created / modified

- `frontend/src/components/layout/AppNav.vue` — main navigation component
- `frontend/src/composables/useTheme.js` — light/dark mode toggle logic
- `frontend/src/App.vue` — wired AppNav and RouterView
- `frontend/vite.config.js` — added `@` path alias
- `frontend/src/router/index.js` — fixed broken route, added HomeView
- `frontend/src/views/HomeView.vue` — placeholder view to test nav

### What was built

**Top bar** — fixed, full width, always visible:
- CT button (top-left) — italic serif initials, toggles the sidebar, turns green when active
- Full name centered absolutely so it stays truly centered regardless of surrounding elements
- Right side: time capsule icon, light/dark toggle, Contact link

**Sidebar** — slides in from the left on CT click:
- Floats over content as an overlay, doesn't push the layout
- Links in order: About, Career, Projects, Blog, CV
- Footer: social icons (LinkedIn, GitHub, Email) above a divider, version string below
- 260px wide on desktop, full width on mobile

**Theme toggle** — sun/moon icon, switches between light and dark mode

### Problems encountered and fixed

**`@` alias not configured**
Vite doesn't set up the `@` path alias by default. Added `resolve.alias` to `vite.config.js` pointing `@` to `src/`.

**Router had undefined `component`**
The router file had `{ path: '/', component }` with no import — left over from scaffold. Fixed by importing `HomeView` and referencing it properly.

**`HomeView.vue` was empty**
Vue can't render an empty file. Added a minimal placeholder template to unblock testing.

**Name not centering in flexbox**
Setting `text-align: center` doesn't work when siblings have unequal widths — the CT button on the left and actions on the right push the name off-center. Fixed with `position: absolute; left: 50%; transform: translateX(-50%)` to take it out of the flex flow entirely and center it relative to the topbar.

**Options API vs Composition API**
Original `App.vue` used the older Options API (`export default { name: 'App' }`). Replaced with Composition API (`<script setup>`) to stay consistent with Vue 3 best practices throughout the project.

### Concepts learned

**`<script setup>`**
Vue 3's Composition API syntax. Cleaner than Options API — no need to return anything, imports are automatically available in the template. This is the modern standard for Vue 3.

**`scoped` styles**
Adding `scoped` to a `<style>` tag means those CSS rules only apply to that component. Vue adds a unique attribute to every element to achieve this, preventing style leakage between components.

**`<Transition>`**
Vue's built-in animation wrapper. When a `v-if` toggles, Vue applies CSS classes like `.slide-enter-from` and `.slide-leave-to` automatically. Clean animations with no JavaScript needed.

**`router-link-active`**
A class Vue Router automatically adds to any `<RouterLink>` whose path matches the current route. Used to highlight the active nav link with no extra logic.

**`position: absolute` centering trick**
`left: 50%` moves an element so its left edge is at the parent's center. `transform: translateX(-50%)` shifts it back by half its own width, achieving true centering regardless of the element's width.

**`inset: 0`**
CSS shorthand for `top: 0; right: 0; bottom: 0; left: 0`. Used on the backdrop to cover the full screen.

**`watchEffect`**
A Vue 3 composable utility that runs a function immediately and re-runs it whenever any reactive value it reads changes. Used in `useTheme.js` to keep `data-theme` on `<html>` in sync with the toggle state.

### Commits
- `feat: add AppNav with sidebar, theme toggle and social links`

**4th March**
## Phase 6 — Layout components and scroll UX

### Files created / modified

- `frontend/src/components/layout/AppFooter.vue` — footer with copyright and social links
- `frontend/src/components/ui/ScrollProgress.vue` — reading progress bar below topbar
- `frontend/src/components/ui/ScrollToTop.vue` — scroll to top button, appears after 40% scroll
- `frontend/src/App.vue` — added AppFooter, ScrollProgress, ScrollToTop
- `frontend/src/components/layout/AppNav.vue` — name now links to home, hamburger icon added to CT button, icon colour fixed for dark mode

### What was built

**AppFooter** — minimal footer with copyright on the left and social icons (LinkedIn, GitHub, Email) on the right. Consistent icon hover behaviour with the rest of the UI.

**ScrollProgress** — a 2px fixed bar sitting just below the topbar. Fills left to right as the user scrolls. Uses `--accent-primary` which is visible in both light and dark mode. Updates on every scroll event, transitions at 0.1s linear so it feels instant rather than laggy.

**ScrollToTop** — fixed to the bottom-right corner. Hidden until the user has scrolled past 40% of the page, then fades up into view. Clicking it smoothly scrolls back to the top. Fades out when scrolling back near the top.

**Nav name → home link** — wrapped `topbar-name` in a `<RouterLink to="/">` so clicking the name always returns to home.

**Hamburger icon in CT button** — added a small hamburger SVG to the left of the CT initials. Button changed from fixed square to auto width with padding to accommodate both. Icon uses `color: var(--text-primary)` so it inherits the correct colour in both light and dark mode via `stroke="currentColor"`.

### Problems encountered and fixed

**Hamburger icon invisible in dark mode**
The SVG used `stroke="currentColor"` but the button had no explicit `color` set, so it fell back to black in both modes. Fixed by adding `color: var(--text-primary)` to `.ct-btn` and adding `color` to its transition so it switches smoothly with the theme.

### Concepts learned

**`onMounted` / `onUnmounted`**
Vue lifecycle hooks. `onMounted` runs when the component is added to the DOM — used to register event listeners. `onUnmounted` runs when the component is removed — used to clean them up. Always remove event listeners on unmount to prevent memory leaks.

**Memory leaks from event listeners**
Every `addEventListener` keeps a reference to its callback alive. If the component is destroyed but the listener isn't removed, it keeps firing on every scroll event indefinitely. `onUnmounted(() => window.removeEventListener(...))` prevents this.

**`scrollHeight - innerHeight`**
The total scrollable distance of a page. `document.documentElement.scrollHeight` is the full document height including content outside the viewport. Subtracting `window.innerHeight` (the visible area) gives the actual scrollable range. Dividing `window.scrollY` by this gives a 0–1 progress ratio.

**Linear vs eased transitions on progress indicators**
Easing (ease-in, ease-out) on a progress bar makes it feel laggy and inaccurate — it visually lags behind the actual scroll position. `linear` keeps it in sync with the user's finger or scroll wheel.

### Commits
- `feat: added AppFooter`
- `feat: added ScrollToTop and ScrollProgress elem ents`
- `fix: hamburger icon colour in dark mode`
- `made topbar-name as a link to homeview`

**4th March**
## Phase 7 — Hero section

### Files created / modified

- `frontend/src/components/sections/HeroSection.vue` — split slider hero section
- `frontend/src/views/HomeView.vue` — wired HeroSection in

### What was built

**HeroSection — split slider**
A draggable divider splits the hero into two sides. Left is the creative/personal side, right is the logical/professional side. As the user drags the handle, `clip-path: inset()` clips each panel simultaneously creating the reveal effect. The text content below — eyebrow, headline subtitle, and CTA buttons — transitions reactively based on which side is dominant (past 50%).

### Page architecture decision — `/about` vs `/career`
Originally both hero sides pointed toward an "About" page which would have caused a conflict — same URL, different expected content. Resolved by keeping them as two distinct routes already in the sidebar:
- `/about` → personal: personality, AuDHD, music, books, neuropsychology, philosophy
- `/career` → professional: medtech journey, tech stack, projects, papers, courses (future)

No conditional redirections needed — each button already goes somewhere distinct.

### Concepts learned

**`clip-path: inset()`**
Clips an element to show only a rectangular portion of itself. `inset(0 X% 0 0)` clips from the right, `inset(0 0 0 X%)` clips from the left. Updating both simultaneously as the slider moves creates the split reveal effect.

**`computed()`**
A Vue 3 reactive value that automatically recalculates whenever its dependencies change. `activeMode` recalculates every time `sliderPos` changes — no manual updates needed anywhere.

**`mode="out-in"` on `<Transition>`**
Makes the old content fade out completely before the new content fades in. Without this both states would be briefly visible at the same time.

**Touch events vs mouse events**
Mouse events use `e.clientX`. Touch events use `e.touches[0].clientX`. Both need handling separately for the slider to work on mobile.

**`Math.min(Math.max(value, 5), 95)`**
Clamps a value between two bounds — prevents the handle disappearing off either edge.

### Planned page content

| Route | Content |
|---|---|
| `/about` | Personality, AuDHD, music, books, neuropsychology, philosophy |
| `/career` | Medtech journey, tech stack, projects, papers, courses (future) |
| `/blog` | Writing, thoughts, ideas |
| `/cv` | Downloadable CV |

### Commits
- `feat: add HeroSection with split slider`

## Phase 8 — Time capsule, planning and ideas session

### Files modified
- `frontend/src/components/layout/AppNav.vue` — time capsule now navigates to V1

### What was done

**Time capsule wired to V1**
Replaced the `console.log` placeholder in `toggleTimeCapsule()` with `window.location.href` pointing to the V1 Netlify site. Navigates in the same tab intentionally — the user uses the browser back button to return, which fits the time travel metaphor.

**BTTF transition animation — saved for later**
Explored the idea of a full Back to the Future themed transition when clicking the time capsule. Vision: 3D DeLorean model with opening door, interior dashboard view with accurate time circuit display, driving sequence with sparks, warp effect landing on V1, and a sci-fi floating notification on arrival with a return button.

Decided on a phased approach:
- Phase A (later): BTTF time circuit screen + CSS sparks + sci-fi floating notification
- Phase B (even later): Full 3D car model and driving sequence in Three.js

Parked until the portfolio is otherwise complete.

**GitHub Actions workflow**
Added `deploy.yml` with a build check job — installs dependencies with `npm ci`, runs `npm run build` inside `frontend/`. Stops failed workflow notifications from GitHub. Full VPS deploy step to be added once Hetzner is set up.

### Ideas and architecture decisions

**Home page scroll narrative decided**
Hero → Skills/logos → Companies worked with → Recent projects → Contact CTA button

**CV view architecture**
- Abstract CV rendered on the page, not a static PDF equivalent
- Positions deep-link to blog posts or project pages for context
- Download button for recruiters
- Personal info intentionally omitted — available on request via contact form

**Contact form categories**
- Getting in touch
- Requesting personal info
- Requesting services
- Feedback / critique
- Report an issue

**Post-server roadmap**
- Personal analytics dashboard — own the data, no Google Analytics
- Contact form messages routed to dashboard
- Automated confirmation emails via Resend or Nodemailer
- Personalised notifications for new content

**Now page added to plan**
A `/now` page in the Derek Sivers tradition — answers "what am I focused on right now?" Updated periodically. Fits the personality of the site and sits naturally next to Blog in the sidebar.

**V1 review — what to carry into V2**
- The opening "black box" paragraph — strong personal voice, rework as hero subtitle
- "Servus" as greeting — already implemented, distinctly personal
- KORA internship story — medtech roots, core content for `/career`
- Bilingual CV detail — shows European context

### Concepts learned

**`window.location.href`**
Navigates the current tab to a new URL. Unlike `window.open('url', '_blank')` which opens a new tab, `href` replaces the current page — correct for the time travel metaphor where the user travels away from V2.

**`npm ci` vs `npm install`**
`ci` installs exactly what is in `package-lock.json` without updating anything. Makes builds reproducible and faster in CI environments. Always use `npm ci` in GitHub Actions, never `npm install`.

**Now page convention**
A `/now` page answers "what are you focused on right now?" — a concept popularised by Derek Sivers. Common in the developer and indie maker community. Updated every few months, signals an active and thoughtful person behind the site.

### Commits
- `fix: wire time capsule to V1 website`
- `ci: add build check workflow`
- `docs: update journey log with phase 8`

## Next steps

### Frontend — home view
- [ ] Build `ProjectsSection.vue` + populate `projects.js` with real data
- [ ] Build skills/logos section (staggered fade-in on scroll, SVG icons, light/dark mode)
- [ ] Build companies section (logo + name + year range)
- [ ] Build contact CTA section at bottom of home
- [ ] Wire all sections into `HomeView.vue`

### Frontend — individual views
- [ ] `AboutView.vue` — personality, AuDHD, music, books, neuropsychology, philosophy
- [ ] `CareerView.vue` — medtech journey, tech stack, projects, papers, courses (future)
- [ ] `ProjectView.vue` — individual project pages
- [ ] `BlogView.vue` — writing and thoughts
- [ ] `CVView.vue` — abstract CV on page, download button, no personal info
- [ ] `ContactView.vue` — form with categories: Getting in touch, Requesting personal info, Requesting services, Feedback / critique, Report an issue
- [ ] `NowView.vue` — what I am focused on right now, updated periodically

### Frontend — navigation
- [ ] Add Now page to sidebar
- [ ] Wire time capsule to BTTF transition animation (Phase A: time circuit + sci-fi notification, Phase B: full 3D car sequence — saved for later)

### Infrastructure
- [ ] Write `Dockerfile`
- [ ] Set up Hetzner VPS — Ubuntu, Docker, Caddy
- [ ] Write `deploy.yml` GitHub Actions workflow — full deploy to VPS
- [ ] Update DNS to point domain to VPS

### Post-server
- [ ] Build personal analytics dashboard (own data, no Google Analytics)
- [ ] Wire contact form messages to dashboard
- [ ] Set up automated emails on form submission (Resend or Nodemailer)
- [ ] Personalised notifications for new content
