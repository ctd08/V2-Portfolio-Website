
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


## Phase 9 — Skills section planning and icon research

### Decisions made

**Build order corrected**
Skills section depends on projects being tagged first. Revised order:
1. `projects.js` + `ProjectsSection.vue` with tags
2. Skills section with click-to-filter wired to projects
3. Companies section

**Skills section structure — four categories**

| Section | Animation | Behaviour |
|---|---|---|
| Languages I've worked in | Grid fade-in (option 1) | Clicks filter /projects |
| Frameworks I've worked in | Marquee (option 2) | Clicks filter /projects |
| Dev tools I've worked with | Staggered rows (option 3) | Display only |
| Collaboration tools I've worked with | Staggered rows (option 3) | Display only |

**"Currently learning" chips** added inside Frameworks section with dashed border style — Docker, Three.js.

**Framing decision**
All sections use "I've worked in / with" rather than claiming proficiency. Honest and credible.

**Icon library decided — Simple Icons**
`npm install simple-icons` — individual SVGs per brand, consistent style, correct brand colours, tree-shakeable.

**Icon availability confirmed**

Available: Python, JavaScript, C, C++, Vue, FastAPI, Docker, Git, GitHub, Linux, Debian, CMake, Jira, Confluence, Notion, MATLAB, LTSpice, VSCode

Text-only (no icon exists): VHDL, SEGGER, Scribe, Snagit

**Full skills inventory decided**

- Languages: Python, JavaScript, C, C++, VHDL
- Frameworks: Vue, FastAPI, Docker (learning), Three.js (learning)
- Dev tools: Git, GitHub, Linux, SEGGER, LTSpice, MATLAB, VSCode
- Collaboration tools: Jira, Confluence, Notion, Scribe, Snagit, MS Office

**npm and VSCode dropped from showcase reasoning**
npm is a default tool, not a skill signal. VSCode is an editor everyone uses. Neither adds meaningful information to a recruiter.

### Concepts learned

**Simple Icons**
An npm package with 3400+ SVG icons for popular brands. Each icon exported individually so bundlers can tree-shake unused ones. Provides the SVG path and official brand hex colour. Consistent style across all icons — critical for a skills section where mixed icon styles would look incomplete.

**Tree shaking**
A bundler optimisation that removes unused code from the final build. By importing only `{ siPython, siJavascript }` instead of the entire icon library, only those two icons end up in the bundle. Keeps the build size small.

**Icon availability strategy**
Not every tool has a brand icon. For niche tools (VHDL, SEGGER, Scribe, Snagit) — text-only chips are cleaner than using generic placeholder icons. Avoids misleading the visitor with an unrecognisable logo.

### Commits
- `docs: update journey log with phase 9`


## Phase 10 — Home page layout brainstorm and mockup

### Files created
- `docs/homepage_layout_mockup.html` — fully interactive home page layout mockup with working slider, theme toggle, sidebar, scroll progress, and fade-in animations

### Decisions made

**Full home page scroll narrative finalised**
| Order | Section | Notes |
|---|---|---|
| 1 | Hero zone | Split slider + greeting + buttons |
| 2 | Currently | Role + building + learning |
| 3 | Skills | Four categories, fade in on scroll |
| 4 | Projects | Minimal cards, moved before companies |
| 5 | Companies | Logo + name + year, clicks filter /career |
| 6 | Contact CTA | Button → /contact |

**Hero slider behaviour finalised**
- Start at 50/50: both sides show one continuous photo of Cristina standing back to back with herself in two different outfits, divider cuts through the middle
- Drag left past ~30%: left (professional) side becomes dominant → swaps to solo professional portrait (blazer, serious)
- Drag right past ~70%: right (personal) side becomes dominant → swaps to solo creative portrait (colourful, relaxed)
- Text, eyebrow and buttons react to whichever side is past 50%
- Implementation deferred until real photos are available — colour placeholders used in mockup

**Skills section simplified**
- No icons — tags only. Cleaner, faster to build, easier to maintain
- All four categories fade in on scroll
- Marquee only kicks in if a row genuinely overflows — not forced

**Comment section — deferred to post-server**
- Will live on blog posts and project pages only
- Needs moderation backend before going live
- Added to post-server issues list

**Companies section**
- Logo + name + year range
- Clicking navigates to /career filtered by that company
- Moved after projects in the scroll order

### Concepts learned

**`IntersectionObserver`**
A browser API that watches elements and fires a callback when they enter or leave the viewport. Used for the fade-in on scroll effect — much more performant than listening to the scroll event directly, since it doesn't fire on every pixel scrolled.

**`clip-path: inset()` for split reveal**
Both panels are absolutely positioned and cover the full stage. The left panel clips from the right, the right panel clips from the left. As the slider moves, both clip paths update simultaneously — giving the illusion of a single image being split and revealed.

**Image swap threshold logic**
The swap triggers on the dominant side — whichever side is getting bigger. `sliderPos < 30` means the left side occupies more than 70% of the stage and is dominant. `sliderPos > 70` means the right side is dominant. The starting back-to-back image is a single continuous photo designed to be split down the middle by the divider.

### Commits
- `docs: add home page layout mockup`
- `docs: update journey log with phase 10`

## Phase 11 — CurrentlySection component

### Files created / modified
- `frontend/src/components/sections/CurrentlySection.vue` — currently strip component
- `frontend/src/data/currently.js` — content data file
- `frontend/src/views/HomeView.vue` — wired CurrentlySection in

### What was built

**CurrentlySection**
Three item strip showing role, what I'm building, and what I'm learning. Each item has a coloured dot (green = active, amber = in progress), a label, and a value. Content lives in `currently.js` so it can be updated without touching the component.

Current content:
- Role: MedTech student · HiWi @ Institut für Digitale Medizin, UKA
- Building: A portfolio worth keeping
- Learning: Linux · Docker · CI/CD

**Data separation pattern**
Content that changes over time lives in `src/data/` as a plain JS export. The component just imports and renders it. This pattern will be used for projects, companies, and any other content-driven sections.

### Lessons learned

**`closes #N` in commit messages**
Adding `closes #N`, `fixes #N` or `resolves #N` to a commit message automatically closes the linked GitHub issue when pushed to main. The number must match the exact GitHub issue number — double check before pushing.

### Commits
- `feat: add CurrentlySection with data file, closes #25`
- `docs: update journey log with phase 11`

## Phase 12 — SkillsSection component

### Files created / modified
- `frontend/src/components/sections/SkillsSection.vue` — skills section with four categories and fade-in on scroll
- `frontend/src/data/skills.js` — skills data file
- `frontend/src/views/HomeView.vue` — wired SkillsSection in

### What was built

**SkillsSection**
Four category strip: Languages, Frameworks, Dev tools, Collaboration tools. All four fade in on scroll with a slight stagger between categories. Filterable chips (Languages and Frameworks) navigate to `/projects?filter=SkillName` on click. Non-filterable chips are display only. Learning chips have a dashed border and a small "learning" badge.

**Skills inventory finalised**
- Languages: Python, JavaScript, C, C++, CSS, Assembly, VHDL
- Frameworks: Vue, FastAPI, Docker (learning), Three.js (learning)
- Dev tools: Git, GitHub, Linux, VSCode, MATLAB, SEGGER, LTSpice
- Collaboration: Jira, Confluence, Notion, Scribe, Snagit, MS Office

### Decisions made

**Icons removed**
Simple Icons was installed and tested but removed for three reasons:
- No icons exist for VHDL, Assembly, SEGGER, Scribe, Snagit — breaks visual consistency
- Black icons (GitHub, Notion, Three.js) invisible in dark mode
- Mixed icon/no-icon chips read as unfinished rather than designed

Text-only chips are cleaner, consistent, and honest.

**CSS added to Languages**
CSS counts as a real skill given the custom design system built for this project. HTML excluded — markup, not a language.

**Assembly added to Languages**
Directly relevant to embedded systems work. Signals low-level understanding.

### Problems encountered and fixed

**Build failed on GitHub Actions**
`simple-icons` installed locally but not saved to `package.json`. Fixed with `npm install simple-icons --save`. Also ran `npm audit fix` to address 3 vulnerabilities.

**Node.js 20 deprecation warning**
GitHub Actions warning about Node.js 20 being deprecated in June 2026. Not urgent — tracked as Issue #29.

### Concepts learned

**`IntersectionObserver` with Vue template refs**
Collecting elements into a `ref([])` array using the callback ref pattern, then observing each one in `onMounted`. Each element gets a `transitionDelay` based on its index for a stagger effect.

**`router.push` with query params**
`router.push({ path: '/projects', query: { filter: 'Python' } })` navigates to `/projects?filter=Python`. Projects page will read `route.query.filter` to pre-filter the list.

**`npm install --save`**
Ensures the package is written to `package.json` so CI environments install it correctly.

### Commits
- `fix: add simple-icons to dependencies, fix vulnerabilities`
- `refactor: remove icons from skills section, text only chips`

## Phase 13 — Hero images and mobile fix

### Files modified
- `frontend/src/components/sections/HeroSection.vue` — real images wired into slider, refined swap logic and thresholds
- `frontend/src/assets/images/` — added back_to_back.png, serious_side.png, creative_side.png
- `frontend/src/components/layout/AppNav.vue` — topbar name hidden on mobile

### What was done

**Hero slider — real images**
Three images imported and wired into the two panels via computed properties:
- `back_to_back.png` — neutral starting image shown on both sides at 50/50
- `serious_side.png` — appears on left panel when `sliderPos < 35` (professional dominant)
- `creative_side.png` — appears on right panel when `sliderPos > 65` (personal dominant)

`background-size: contain` used instead of `cover` so the full image is visible. `background-image` CSS transition removed — browsers don't support transitioning background-image so it was doing nothing.

**Slider logic**
```js
const leftImage = computed(() =>
  sliderPos.value < 35 ? imgProfessional : imgBackToBack
)
const rightImage = computed(() =>
  sliderPos.value > 65 ? imgCreative : imgBackToBack
)
```

**Mobile fix — topbar name hidden**
On narrow screens the centered name was overlapping the theme toggle and time capsule icons. Fixed by hiding `.topbar-name` on screens below 640px. The CT button with hamburger and initials provides sufficient identity on mobile. Closes Issue #21.

### Concepts learned

**`background-size: contain` vs `cover`**
`cover` fills the entire container, cropping the image if needed. `contain` fits the entire image within the container, leaving empty space around it. For portrait photos where the full image needs to be visible, `contain` is the right choice.

**`background-image` is not transitionable**
CSS `transition` does not work on `background-image` — browsers cannot interpolate between two image values. The property was removed since it was silently doing nothing. For smooth image transitions, opacity-based crossfade with overlapping elements would be needed instead.

**Debugging computed properties**
Adding `console.log` inside a computed function is a quick way to verify it's firing and what value it's returning — useful when the visual result is unclear.

### Commits
- `feat: add real images to hero slider, fix: hide topbar name on mobile, closes #21`
- `docs: update journey log with phase 13`

## Phase 14 — ProjectsSection and CompaniesSection

### Files created / modified
- `frontend/src/data/projects.js` — projects data file
- `frontend/src/components/sections/ProjectsSection.vue` — project cards with carousel
- `frontend/src/data/companies.js` — companies data file with logos
- `frontend/src/components/sections/CompaniesSection.vue` — companies strip with logos
- `frontend/src/assets/images/igel-logo.svg` — downloaded via curl
- `frontend/src/assets/images/uka-logo.jpg` — saved manually
- `frontend/src/views/HomeView.vue` — wired both sections in
- `frontend/src/router/index.js` — added `/projects/:id` route
- `frontend/src/data/skills.js` — removed Three.js (not yet used)
- `frontend/src/components/sections/HeroSection.vue` — fixed button links to /projects and /career

### What was built

**ProjectsSection**
Horizontal card layout that becomes a carousel when cards overflow the screen width. Cards snap cleanly using `scroll-snap-type`. Scroll arrows appear dynamically only when there is content to scroll to. Each card has a green left border accent, title in display font, short description, and filterable tags. Featured project gets the green left border permanently.

Projects showcased:
- V2 Portfolio Website
- DrawMeMaybe
- Pipe Puzzle Solver
- Bonbon Automat

**CompaniesSection**
Two company pills with logo, name, and year range. Clicking navigates to `/career?filter=company-id` for future filtering. Logo handling is per-company using dynamic CSS classes to avoid styles leaking between logos.

Companies:
- Uniklinikum Augsburg (2023 · 2025–present) — two roles, one entry
- IGEL Technology (Aug 2025 – March 2026)

**UnderConstructionView**
Built and wired to all unfinished routes. Shows a page-specific hint based on `route.path`, a checklist of what's done and what's pending, and a live completion percentage. Closes Issue #24 (was incorrectly numbered — actually the construction view issue).

### Decisions made

**UKA shown once on home page**
Two separate roles at UKA (KORA 2023, MeDIHA 2025–present) but shown as one company entry on home. Career page will show both roles when filtered.

**KORA not listed separately**
Contract was with Uniklinikum Augsburg — KORA is the study name, not the employer.

**Three.js removed from skills**
Not yet used in any project. Will be added back when actually used.

**Logo handling strategy**
- IGEL: dark SVG, `object-fit: contain`, `filter: invert(1)` in dark mode only via `.logo-igel`
- UKA: jpg with white background, `object-fit: cover`, `object-position: 90% center` to crop to symbol via `.logo-uka`
- Each logo gets a company-specific class (`:class="logo-${company.id}"`) to avoid CSS interference between logos

### Problems encountered and fixed

**IGEL logo invisible in dark mode**
Dark SVG on dark background. Fixed with `filter: invert(1)` scoped to `[data-theme="dark"] .logo-igel`.

**UKA logo turned orange**
`filter: invert(1)` was applied globally to all `.logo-img` elements, inverting the UKA blue to orange. Fixed by scoping filters to individual company classes.

**Hero buttons linking to wrong routes**
"See my work" was linking to `/work` which didn't exist. "About me" was linking to `/about` instead of `/career`. Fixed both in `HeroSection.vue`.

### Concepts learned

**`scroll-snap-type` and `scroll-snap-align`**
CSS scroll snapping makes carousels snap cleanly to each card rather than stopping at arbitrary positions. `scroll-snap-type: x mandatory` on the container, `scroll-snap-align: start` on each card.

**Hiding scrollbars while keeping scroll**
`scrollbar-width: none` for Firefox, `::-webkit-scrollbar { display: none }` for Chrome/Safari. The element still scrolls — it just looks clean.

**`mix-blend-mode` for logo backgrounds**
`multiply` makes white pixels transparent in light mode. `screen` does the same in dark mode. Useful for logos with white backgrounds when you can't get a transparent version.

**`object-fit: cover` vs `contain`**
`cover` fills the container and crops excess — good for cropping to a specific part of an image. `contain` fits the whole image inside — good for logos that need to be fully visible.

**`object-position`**
Controls which part of the image is shown when using `object-fit: cover`. `90% center` shifts focus to the right side of the image — used to crop the UKA wordmark and show only the symbol.

**Dynamic CSS classes with `:class`**
`:class="\`logo-${company.id}\`"` generates unique classes per company (`logo-uka`, `logo-igel`). Allows per-logo CSS without affecting other logos.


## Next steps

### Frontend — home view
- [x] Build `ProjectsSection.vue` + populate `projects.js` with real data
- [x] Build skills/logos section (staggered fade-in on scroll, SVG icons, light/dark mode)
- [x] Build companies section (logo + name + year range)
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
