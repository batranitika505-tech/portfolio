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
- **Project Mockups** — floating 3D browser frames with live project screenshots as textures
- **Galaxy Background** — procedural starfield with scroll-synced colour interpolation

### 🖱️ Cursor
- **Energy Ribbon Cursor** — replaces the default cursor with a spring-physics silk-light trail
- **Catmull-Rom Spline** — 36-point smooth interpolation for organic fluid motion
- **Additive Blending** — three glow passes (halo, medium, core) create a comet-tail effect
- **Hover Reactivity** — ribbon changes brightness and width over buttons, links, and 3D screens

### 💻 Sections
| Section | Description |
|---------|-------------|
| **Hero** | Asymmetric layout with 3D core, animated greeting sequence, and particle scroll indicator |
| **About** | Profile photo, personal bio |
| **Skills** | Technology stack display |
| **Projects** | Two featured projects with clickable 3D browser mockups |
| **GitHub** | Live contribution calendar, streaks, and profile stats pulled from GitHub API |
| **Education** | Academic background |
| **Contact** | Contact form and links |

### 🐙 Live GitHub Integration
- Real-time contribution calendar using **GitHub Contributions API**
- GitHub-exact dark mode colour palette (`#161b22` → `#39d353`)
- Animated tooltip on hover showing contribution count and date
- Current streak & longest streak calculation
- Auto-filters to today's date — no future grey blocks

### ⌨️ Easter Egg — Terminal Mode
Press `~` anywhere on the page to open an interactive terminal overlay. Supported commands:
```
about · skills · projects · resume · contact · clear · help
```

---

## 🛠 Tech Stack

| Category | Technologies |
|----------|-------------|
| **Framework** | Next.js 16 (App Router) |
| **3D / WebGL** | React Three Fiber, Three.js, @react-three/drei |
| **Animation** | Framer Motion, CSS keyframes |
| **Smooth Scroll** | Lenis |
| **Styling** | Tailwind CSS, Vanilla CSS |
| **Language** | TypeScript |
| **Icons** | Lucide React |
| **Fonts** | Google Fonts (Inter) |
| **APIs** | GitHub REST API, GitHub Contributions API |

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

---

## 📁 Project Structure

```
src/
├── app/
│   ├── globals.css         # Design tokens, keyframes, scrollbar
│   ├── layout.tsx          # Root layout with cursor & providers
│   └── page.tsx            # Page composition
├── components/
│   ├── canvas/
│   │   ├── Galaxy.tsx      # Procedural starfield
│   │   ├── HeroObject.tsx  # 3D energy core with orbital rings
│   │   └── Scene.tsx       # Scroll-reactive lighting & background
│   ├── providers/
│   │   └── LenisProvider.tsx   # Smooth scroll wrapper
│   ├── sections/
│   │   ├── Hero.tsx        # Cinematic hero with 3D canvas
│   │   ├── About.tsx
│   │   ├── Skills.tsx
│   │   ├── Projects.tsx    # 3D mockups with screenshot textures
│   │   ├── Github.tsx      # Live GitHub integration
│   │   ├── Education.tsx
│   │   └── Contact.tsx
│   └── ui/
│       ├── CustomCursor.tsx     # Light ribbon cursor
│       ├── Navbar.tsx           # Glassmorphic floating pill nav
│       └── InteractiveTerminal.tsx  # ~ key terminal overlay
└── public/
    ├── profile.png
    ├── first.png           # Online Course Platform screenshot
    └── second.png          # MCON Renovation Firm screenshot
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
