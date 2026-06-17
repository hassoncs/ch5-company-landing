# ch5me

CH5 LLC company homepage for ch5.me.

## Stack

- Astro static site
- React island for the homepage WebGL hero
- Three.js for the animated background

## Runtime

- Node 24.x

## Commands

- `pnpm dev` — local development
- `pnpm build` — production build
- `pnpm preview` — preview built site
- `pnpm astro check` — Astro type and content checks

## Deployment

- Source-of-truth remote: `hq` (`https://git.ch5.me/ch5/ch5-landing-page.git`)
- GitHub `origin` is mirror-only when present
- npm installs resolve through CH5 Verdaccio (`https://npm.ch5.me/`)
- Cloudflare Pages project: `ch5me`
- Deploy command: `wrangler pages deploy dist --project-name ch5me`
- Deploy secrets: repo-local Hush stores `CLOUDFLARE_API_TOKEN` and
  `CLOUDFLARE_ACCOUNT_ID`; Forgejo repo Actions secrets mirror the same names.
- If the `ch5.me` custom domain is stuck pending, check for old proxied `A` records on `@` or `www` from the previous host and replace them with proxied `CNAME` records to `ch5me.pages.dev`
- Local preview can collide with other Astro projects on `4321`; use `pnpm preview --host 127.0.0.1 --port 4327` when needed

## Conventions

- Keep the site lightweight and static-first
- Use Astro for layout and content sections
- Use React only for interactive or browser-only visuals
- Keep company copy factual and minimal
