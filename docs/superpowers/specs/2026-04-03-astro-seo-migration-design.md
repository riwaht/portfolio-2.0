# Astro Migration for SEO — Design Spec

**Date:** 2026-04-03
**Goal:** Migrate Vite SPA portfolio to Astro for improved SEO and social sharing, with zero visual changes.

## Context

- Current stack: Vite + React 18 SPA
- Domain: riwashouse.live
- Deployed on Vercel
- 4 routes: `/`, `/projects`, `/journey`, `/house`
- Heavy use of Three.js/R3F on `/house`
- No current SEO setup (no meta descriptions, OG tags, sitemap, robots.txt, structured data)

## Architecture

Astro project with `@astrojs/react` integration. Each route is an `.astro` page that:
- Sets unique `<head>` meta/OG tags
- Imports existing React components via `client:load` or `client:only="react"`
- Outputs static HTML at build time
- Deploys to Vercel via `@astrojs/vercel` adapter

## Routes

| Route | Page | Astro File | Client Directive |
|-------|------|------------|-----------------|
| `/` | About (landing) | `src/pages/index.astro` | `client:load` |
| `/projects` | Projects & Blog | `src/pages/projects.astro` | `client:load` |
| `/journey` | Journey map | `src/pages/journey.astro` | `client:load` |
| `/house` | 3D House | `src/pages/house.astro` | `client:only="react"` |

## SEO Additions

### 1. Reusable SEO Component
An `SEO.astro` component in `src/components/` accepting:
- `title` (string)
- `description` (string)
- `image` (string, optional — defaults to a placeholder path)
- `url` (string — canonical URL)
- `type` (string — "website" or "article")

Renders: `<title>`, meta description, canonical, OG tags (og:title, og:description, og:image, og:url, og:type), Twitter Card tags (twitter:card, twitter:title, twitter:description, twitter:image).

### 2. Structured Data
- `WebSite` schema on all pages (in base layout)
- `Person` schema on home page (name, url, jobTitle)

### 3. Sitemap
- `@astrojs/sitemap` plugin with `site: "https://riwashouse.live"` in Astro config
- Auto-generates `sitemap.xml` at build time

### 4. robots.txt
Static file in `public/robots.txt`:
```
User-agent: *
Allow: /
Sitemap: https://riwashouse.live/sitemap-index.xml
```

### 5. Favicon Infrastructure
Keep existing `house-icon.svg`. Add `<link>` tags for apple-touch-icon in the base layout — user supplies the actual image file later.

## Migration Strategy

### What Changes
- `index.html` → Astro base layout (`src/layouts/BaseLayout.astro`)
- React Router removed — Astro file-based routing replaces it
- `main.jsx` simplified — no longer the app entry point
- `vite.config.js` → `astro.config.mjs`
- `vercel.json` updated for Astro
- `package.json` scripts updated

### What Stays the Same
- All React components (About, Projects, Journey, House, Navbar, Footer, etc.)
- `styles.css` and theming system (imported globally in base layout)
- All assets in `public/`
- Vercel Analytics + Speed Insights
- Visual appearance — zero changes to what the user sees

### Three.js Handling
- R3F components (`House.jsx`, `Model.jsx`, `Lighting.jsx`, etc.) use `client:only="react"` to skip SSR entirely
- This avoids any window/document/WebGL SSR errors
- The 3D scene renders client-side only, same as current behavior

### Dark Mode
- `DarkModeToggle.jsx` continues to work client-side
- Base layout sets a default theme; React hydration takes over

### Component Adjustments
- React Router's `<Link>` and `useNavigate` replaced with standard `<a>` tags or Astro's routing
- `react-router-dom` dependency removed
- Navbar component updated to use `<a href>` instead of `<Link to>`

## Per-Page Meta Tags

| Page | Title | Description |
|------|-------|-------------|
| `/` | Riwa Hoteit | Software engineer and creative developer. Building interactive experiences with React, Three.js, and more. |
| `/projects` | Projects — Riwa Hoteit | A collection of software projects and blog posts by Riwa Hoteit. |
| `/journey` | Journey — Riwa Hoteit | A visual timeline of places, experiences, and milestones. |
| `/house` | House — Riwa Hoteit | An interactive 3D house experience built with Three.js. |

## Deployment

- Vercel adapter: `@astrojs/vercel`
- Output: static (default) — pre-renders all pages at build time
- Build command: `astro build`
- Output directory: `dist/`

## Dependencies to Add
- `astro`
- `@astrojs/react`
- `@astrojs/sitemap`
- `@astrojs/vercel`

## Dependencies to Remove
- `react-router-dom`
- `vite` (Astro bundles its own)
- `@vitejs/plugin-react`

## Success Criteria
- All 4 pages render identically to current site
- Each page has unique title, description, OG tags in page source (view-source, not JS)
- `robots.txt` and `sitemap-index.xml` accessible
- JSON-LD structured data present in page source
- Social preview cards work when URL is pasted into LinkedIn/Twitter
- Vercel deployment succeeds
- Dark mode toggle works
- 3D house page loads and functions correctly
