
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

## Next steps

- [ ] Write `tokens.css` — CSS variables for the full design system
- [ ] Write `reset.css` and `typography.css`
- [ ] Build `AppNav.vue` and `HeroSection.vue`
- [ ] Set up Vercel auto-deploy from GitHub
- [ ] Write `Dockerfile`
- [ ] Set up Hetzner VPS
- [ ] Write `deploy.yml` GitHub Actions workflow
