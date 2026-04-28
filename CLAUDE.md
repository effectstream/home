# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

EffectStream landing page - a React 19 + TypeScript SPA built with Vite, showcasing a multi-chain rollup framework. Uses Bun as the package manager.

## Commands

- `bun run dev` - Start Vite dev server
- `bun run build` - TypeScript check + Vite production build
- `bun run preview` - Serve the production build locally

No test framework, linter, or formatter is configured.

## Architecture

Single-page marketing site with two routes (`/` and `/interactive`) via React Router DOM.

- `src/main.tsx` - Entry point, sets up BrowserRouter
- `src/App.tsx` - Root layout with mouse-tracking aurora backdrop (3 animated blobs)
- `src/pages/` - Route-level components (InteractivePage for pipeline visualization)
- `src/components/` - All UI components, including a `pipeline/` subdirectory for the interactive chain pipeline visualization
- `src/assets/` - Static assets (chain logos as SVGs/PNGs)

## Styling

Pure CSS with CSS custom properties - no Tailwind or CSS-in-JS. The design system is defined in `src/index.css`:

- Dark theme with glass-morphism (backdrop-filter blur)
- Color palette: cyan `#06d6a0`, purple `#8b5cf6`, magenta `#ec4899`, teal `#19b17b`
- Fonts: Inter (body), JetBrains Mono (code), Outfit (headings)
- Each component has a co-located `.css` file

## Animations

Framer Motion is used throughout for scroll-triggered animations (whileInView), hover/tap states, staggered reveals, and spring physics. Animation patterns are consistent: fade-up with opacity transition, spring config (stiffness: 400, damping: 17).

## Deployment

Hosted on GitHub Pages at https://effectstream.github.io/home/

Vite builds to the `docs/` folder (served from `main` branch). To deploy:

```
bun run build
```

Then commit and push the updated `docs/` directory.

## Key Patterns

- No state management library - local React hooks (useState, useRef, useEffect) only
- Single external API call: GitHub stars count fetched in Header.tsx from the GitHub API
- All external links (docs, GitHub repo) are hardcoded strings
- Responsive breakpoint at 640px (mobile-first)
