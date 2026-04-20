# Learnings — landing-page-rewrite

## Project Conventions
- Astro static site, React only for browser-only interactivity
- Tailwind CSS with CSS variable design tokens
- `pnpm check` + `pnpm build` are the verification gates
- No automated test framework; browser QA is primary validation
- Liquid glass CSS utility classes already exist: `liquid-glass`, `liquid-glass-strong`
- Font classes: `font-heading` (italic), `font-body`
- BlurText component exists at `src/components/BlurText.tsx` for animated text reveals
- motion/react (Framer Motion) is already installed

## Content Guardrails
- BANNED: Services, Work, Process, Pricing, Get Started, Book a Call, View Pricing
- BANNED: fake stats (200+, 98%, 3.2x, 5 days), fake testimonials (Sarah Chen, Marcus Webb, Elena Voss)
- BANNED: fake logos (Stripe, Vercel, Linear, Notion, Figma)
- BANNED: agency/service framing, first-person founder voice
- REQUIRED: Firefly (hero anchor), FitBot, Waypoint, MacroBot, Slopcade, Hush
- TONE: Playful, truthful, CH5 voice, non-corporate, constellation-first

## Architecture Decisions
- Content data source: `src/data/projects.ts` (canonical project list)
- Fluid sim: React component, page-spanning background layer
- Pretext: scoped to one hero/section text interaction
- Reduced-motion: CSS `@media (prefers-reduced-motion: reduce)` + JS check

## Task 2 — Navbar + CtaFooter Rewrite

### Navbar
- 2 anchor links (`#projects`, `#about`) — labels are truthful, no dead links
- Mobile menu button had `aria-label` but no `onClick` handler — added empty `onClick={() => {}}` as placeholder (actual mobile menu implementation is separate work)

### CtaFooter
- Tagline changed from "Building things." → "Maker of Firefly, FitBot, cmux, and other things that run."
- This is truthful: CH5 is a personal maker company with products (Firefly, FitBot, cmux, Slopcade, Pencil, Waypoint, etc.) — not an agency or services firm
- Footer links (Privacy, Terms, Contact) are fine as-is

### Banned language audit
- Zero matches for: "How It Works", "You dream it", "We ship it", "vision", "ship", "launch in days", "strategy call"

## Task 3 — Rewrite Hero around Firefly

### Rewrote `src/components/Hero.tsx` (80 → 40 lines)
- Removed: "New" badge with "Introducing AI-powered web design"
- Removed: headline "The Website Your Brand Deserves"
- Removed: subhead "Stunning design. Blazing performance. Built by AI, refined by experts..."
- Removed: "Get Started" CTA button + ArrowUpRight icon
- Removed: "Watch the Film" link + Play icon
- Removed: entire "Trusted by the teams behind" logos section (Stripe, Vercel, Linear, Notion, Figma — fake)
- Removed: unused `ArrowUpRight`, `Play` lucide-react imports
- Replaced badge: "Privacy-first AI" (simple label, liquid-glass pill)
- Replaced headline: "Firefly" via BlurText animated reveal
- Replaced subhead: sourced from Firefly positioning — "A privacy-first AI assistant that reads your devices locally, masks what's sensitive, and shows up where you already work. The cloud only sees what it needs to."
- Hero content now sourced from `heroContent` export in `src/data/projects.ts` (single source of truth)
- Kept: video background, overlay gradient, BlurText animation, Framer Motion reveal transitions — future motion layers (Pretext, fluid) stack on top

### Updated `heroContent` in `src/data/projects.ts`
- headline: `"Firefly"` (single word, product name as headline)
- subhead: Firefly description sourced from app-portfolio.md, rewritten in CH5 voice
- badge: `"Privacy-first AI"` (replaces "Personal maker company")

### CH5 voice compliance
- Zero VC deck language: no "disrupting", "reimagining", "next-gen"
- No founder first-person voice
- No client-service framing — reads as product introduction
- Subhead is factual: what Firefly does, why it's different, in plain language
- Contractions used naturally ("what's", "can't")

### Verification
- `pnpm astro check`: 0 errors, 0 warnings
- `pnpm build`: success, 1 page built

## Issues
(none yet)

## Task 4 — Replace "How It Works" with CH5 worldview section

### Replaced StartSection.tsx (33 → 27 lines)
- Removed: badge "How It Works", headline "You dream it. We ship it.", subtext with "vision/ship it/days not quarters", CTA "Get Started"
- Added: badge "What Is CH5", headline "One person building, publicly.", subtext "CH5 is a personal maker company. Products, tools, and experiments. Each thing builds the next."
- CTA removed intentionally: emotional handoff into constellation section works better as natural scroll rather than a jump-to-contact link
- Kept BlurText for headline, liquid-glass badge, same layout shell

### Worldview framing
- Badge "What Is CH5" replaces process label — signals identity, not funnel step
- Headline is plain: one person, building openly. No consulting framing.
- Subtext names what we make: products, tools, experiments. The "each thing builds the next" line creates narrative continuity into the constellation section below

### Banned language audit
- Zero matches for: "How It Works", "You dream it", "We ship it", "vision", "ship", "launch in days", "strategy call"
