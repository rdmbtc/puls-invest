## Puls Invest — investor landing page

Single scrolling landing page at `/` (anchor navigation is explicit in the request), built as clean React + TypeScript components on the existing TanStack Start + Tailwind v4 stack. No backend needed — all data is local placeholder data.

### Design system (src/styles.css)
Add Puls tokens as OKLCH-equivalent CSS variables mapped in `@theme inline`, dark-first (set `.dark` on `<html>` / make dark the default `:root`):
- canvas `#0A0E1A`, surface `#121829`, raised `#1B2236`, border `#222B40`
- text `#EAF0FF`, muted `#9AA6C0`, subtle `#5E6A85`
- brand pink `#F472B6`, mint `#2DD4BF`, amber `#F59E0B`, no-red `#F87171`
- pulse gradient token `linear-gradient(90deg,#34E5C0,#F65FA9)`
- agent accents: mint, sky, violet, amber, pink, teal, indigo, rose
- fonts `--font-display` Playfair Display, `--font-sans` DM Sans, `--font-mono` JetBrains Mono, loaded via `<link>` tags in `__root.tsx` head (never `@import` a URL)
- `@utility` helpers: `gradient-text`, `glass`, `pulse-btn`, `card-surface`, aurora/drift keyframes, dot-grid + grain overlays, all wrapped in a `prefers-reduced-motion` guard

### Components (src/components/invest/)
```
AuroraBackground.tsx   aurora blobs + dot grid + SVG grain
Navbar.tsx             sticky frosted nav, condenses on scroll, mobile drawer
Hero.tsx               eyebrow pill, serif headline w/ italic gradient phrase, 2 CTAs
StatStrip.tsx          4 count-up stats (TVL $1.28M, 47.2% APY, paid out, 8 agents)
HowItWorks.tsx         4 numbered step cards + connectors
AgentBentoGrid.tsx     asymmetric grid, Vega featured
AgentCard.tsx          glyph, name, role badge, win rate/APY/30d ROI/TVL, address, Invest
Sparkline.tsx          deterministic seeded SVG polyline
TrustSection.tsx       split copy + bond/slash explainer card + pills
ProtocolStats.tsx      4 icon-badge stat cards
FaqAccordion.tsx       6 items, +/- rotate, single-open, keyboard accessible
FinalCta.tsx           glass card + radial brand glow
Footer.tsx             legal, links, back-to-top
InvestModal.tsx        mock USDC deposit: amount input, quick % chips, delegation
                       summary (20% fee split, est. yield), simulated
                       idle→pending→success states, focus trap + Esc close
ui/Eyebrow.tsx, ui/Button.tsx, ui/Reveal.tsx (IntersectionObserver fade+slide)
```
Shared data + types in `src/lib/agents.ts` (8 agents, accent, metrics, address, seed) and `src/lib/faq.ts` (reused for JSON-LD).

### Page + SEO
Rewrite `src/routes/index.tsx` to compose the sections, with `head()`: title, meta description, canonical `https://invest.pulsmarket.tech/`, og + twitter tags, and JSON-LD scripts for `WebApplication` and `FAQPage` (generated from `faq.ts`). `robots.txt` allows indexing. `__root.tsx` gets the font links, dark default, and generic site defaults only.

### Behavior details
- Count-up and scroll reveals run once on enter; frozen under `prefers-reduced-motion`
- Cursor-tracking spotlight on agent cards via CSS custom properties set on pointermove (no React state per frame)
- Grid + `min-w-0` / `shrink-0` on nav and card header rows for mobile safety
- Fixed-height stat/sparkline containers to avoid CLS
- Semantic landmarks, aria-labels, aria-expanded on nav/accordion, `role="dialog"` + labelled modal

### Deployment note
Vercel: framework preset detected from the repo, then add `invest.pulsmarket.tech` as a domain in Project → Settings → Domains and point a CNAME at Vercel. I'll include exact steps in the final reply.
