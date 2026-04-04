
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


## Next steps

- [ ] Build `HeroSection.vue`, `HomeView.vue`
- [ ] Build `ProjectsSection.vue` + populate `projects.js` with real data
- [ ] Build `AboutSection.vue`
- [ ] Build individual views: `AboutView.vue`, `CareerView.vue`, `ProjectView.vue`, `BlogView.vue`, `CVView.vue`
- [ ] Wire time capsule icon to v1 URL
- [ ] Set up Vercel auto-deploy from GitHub
- [ ] Write `Dockerfile`
- [ ] Set up Hetzner VPS — Ubuntu, Docker, Caddy
- [ ] Write `deploy.yml` GitHub Actions workflow
- [ ] Update DNS to point domain to VPS
