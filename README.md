# 🚀 Nitika's Portfolio

A cinematic, premium developer portfolio built with a **futuristic space aesthetic** — combining immersive 3D visuals, real-time GitHub data, and silky-smooth interactions.

> Inspired by Apple × NASA × Interstellar. Built with performance, personality, and precision.

---

## ✨ Features

### 🎨 Design
- **Asymmetrical Hero Layout** — cinematic split-column with a 3D energy core
- **Glassmorphism UI** — frosted panels, neon glows, and dark depth throughout
- **Scroll-based Theme Shifts** — colour palette transitions from deep space blues to nebula purples as you scroll
- **Premium Typography** — Google Fonts (Inter, mono accents) with sliding silver sheen animations

### 🌌 3D & Canvas
- **React Three Fiber** — real-time WebGL 3D scenes on the Hero and Projects sections
- **HeroObject** — three-layer wireframe icosahedron with orbital rings and mouse-reactive tilt
- **Project Mockups** — floating 3D browser frames with live project screenshots as textures (WebP optimised)
- **Galaxy Background** — procedural starfield with deterministic seeded PRNG and scroll-synced colour interpolation
- **Smart WebGL Management** — project canvases lazy-mount via `useInView` to prevent GPU context exhaustion; DPR capped at `[1, 1.5]`

### 🖱️ Cursor
- **Energy Ribbon Cursor** — replaces the default cursor with a spring-physics silk-light trail
- **Catmull-Rom Spline** — 36-point smooth interpolation for organic fluid motion
- **Additive Blending** — three glow passes (halo, medium, core) create a comet-tail effect
- **Hover Reactivity** — ribbon changes brightness and width over buttons, links, and 3D screens
- **Accessibility** — only activates on fine-pointer devices; respects `prefers-reduced-motion`; touch devices retain native cursor

### 💻 Sections
| Section | Description |
|---------|-------------|
| **Hero** | Asymmetric layout with 3D core, animated greeting sequence, and particle scroll indicator |
| **About** | Profile photo (Next.js `<Image>`, WebP), personal bio with mouse-tilt via `useMotionValue`/`useSpring` |
| **Skills** | 3D keycap keyboard with physical key-press interaction (press 1-8 or initial letters); mobile quick-badge fallback |
| **Projects** | Two featured projects with 3D browser mockups; canvases unmount when off-screen to save GPU |
| **GitHub** | Live contribution calendar, streaks, and profile stats via server-side cached API route (1h ISR) |
| **Education** | Academic background at Newton School of Technology |
| **Contact** | Contact form with `validateContactForm` validation, 5 MB file limits, anti-spam honeypot, FormSubmit.co integration |

### 🐙 Live GitHub Integration
- Server-side `/api/github-contributions` route with 1-hour ISR caching — no client-side rate limits
- GitHub-exact dark mode colour palette (`#161b22` → `#39d353`)
- Animated tooltip on hover showing contribution count and date
- Clickable calendar cells link to the day on GitHub
- Current streak & longest streak calculation (extracted to `src/lib/portfolio-utils.ts`)
- Auto-filters to today's date — no future grey blocks

### ⌨️ Easter Egg — Terminal Mode
Press `~` anywhere on the page to open an interactive terminal overlay. Supported commands:
```
about · skills · projects · education · github · contact · resume · clear · exit · help
```
Typing `~` or backtick in form inputs does **not** trigger the terminal.

### 🔒 Security & Headers
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

---

## 🛠 Tech Stack

| Category | Technologies |
|----------|-------------|
| **Framework** | Next.js 16 (App Router, Turbopack) |
| **3D / WebGL** | React Three Fiber, Three.js, @react-three/drei |
| **Animation** | Framer Motion, CSS keyframes |
| **Smooth Scroll** | Lenis |
| **Styling** | Tailwind CSS 4, Vanilla CSS |
| **Language** | TypeScript 5 |
| **Icons** | Lucide React |
| **Fonts** | Google Fonts (Inter) |
| **APIs** | GitHub REST API, GitHub Contributions HTML scraping |
| **Testing** | Node.js native test runner (`node:test`) |

---

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/batranitika505-tech/portfolio.git
cd portfolio

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run lint` | ESLint check |
| `npm test` | Run unit tests (Node.js native test runner) |
| `npx tsc --noEmit` | Type-check without emitting |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── github-contributions/
│   │       └── route.ts       # Server-side GitHub data with 1h ISR cache
│   ├── globals.css            # Design tokens, keyframes, scrollbar, cursor media query
│   ├── layout.tsx             # Root layout with cursor & providers
│   └── page.tsx               # Page composition
├── components/
│   ├── canvas/
│   │   ├── Galaxy.tsx         # Procedural starfield (seeded PRNG)
│   │   ├── HeroObject.tsx     # 3D energy core with orbital rings
│   │   └── Scene.tsx          # Scroll-reactive lighting & background
│   ├── providers/
│   │   └── LenisProvider.tsx  # Smooth scroll wrapper
│   ├── sections/
│   │   ├── Hero.tsx           # Cinematic hero with 3D canvas
│   │   ├── About.tsx          # Profile card with mouse tilt
│   │   ├── Skills.tsx         # 3D keyboard with keycap interaction
│   │   ├── Projects.tsx       # 3D mockups (lazy-mount via useInView)
│   │   ├── Github.tsx         # Live GitHub integration
│   │   ├── Education.tsx      # Academic background
│   │   └── Contact.tsx        # Contact form with validation
│   └── ui/
│       ├── CustomCursor.tsx   # Light ribbon cursor (useSyncExternalStore)
│       ├── Navbar.tsx         # Glassmorphic floating pill nav
│       └── InteractiveTerminal.tsx  # ~ key terminal overlay
├── lib/
│   └── portfolio-utils.ts     # Shared: calculateStreaks, parseTerminalCommand, validateContactForm
public/
├── profile.webp               # Optimised profile photo
├── first.webp                 # Online Course Platform screenshot
├── second.webp                # MCON Renovation Firm screenshot
├── resume.pdf                 # Downloadable resume
tests/
└── portfolio-utils.test.ts    # Unit tests (Node native test runner)
```

---

## 🌐 Deployment

Deployed on **Vercel**. Push to `main` to trigger a new production build.

```bash
npm run build   # Verify production build locally
git push        # Auto-deploys to Vercel
```

---

## 📄 License

MIT © Nitika

---

<p align="center">Made with ✨ and a lot of ☕</p>
