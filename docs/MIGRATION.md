# Infra migration & consolidation

Context and running status for moving everything onto **Cloudflare** and retiring scattered
providers. Source of this plan: consolidation review, 2026-07.

## Why

Was paying ~IDR 1.28M/yr across 3 tangled providers (domain bought from host = lock-in + markup):

| Item | Old provider | Old cost/yr | Renews |
|------|-------------|-------------|--------|
| Domain `kesatria.dev` | Squarespace (ex-Google Domains) | 456,000 | Apr 9 |
| Domain `kesatriakeyboard.com` | Riau Cyber Solution (Suiten) | 222,456 | Sep 6 |
| Hosting "Basic Pro" (Laravel 5 blog) | IDCloudHost | 606,615 | Oct 10 |

Target: **1 provider (Cloudflare)** — registrar + DNS + Pages hosting. Hosting → ~free (static).
End cost ≈ domain fees only (~IDR 360k/yr). Rule going forward: **never buy a domain from your host.**

## Brand decision

Rewrite the old Laravel 5 keyboard blog as a fresh static Astro site. Consolidate under
`kesatria.dev` (short, `.dev` = builder signal, IG handle reserved). `kesatriakeyboard.com`
becomes product section + 301-redirects into `kesatria.dev`.

## Phases

### Phase 1 — domains → Cloudflare  ✅ DONE
- [x] Transfer `kesatria.dev` in to Cloudflare Registrar.
- [x] Transfer `kesatriakeyboard.com` in to Cloudflare Registrar.
- [x] Old DNS entries removed on Cloudflare (clean slate for Pages).

### Phase 2 — deploy Astro site  ◀ IN PROGRESS
- [ ] Push `kesatria-web` to GitHub.
- [ ] Cloudflare Pages → connect repo (build `pnpm build`, output `dist`). Static, no adapter.
- [ ] Add custom domain `kesatria.dev` (+ `www` redirect) in Pages.
- [ ] Verify HTTPS + build on push.

### Phase 3 — migrate content & retire old
- [ ] Dump old blog MySQL from IDCloudHost **before cancelling** (data lives there).
- [ ] Export posts → markdown into `src/content/blog/`.
- [ ] `kesatriakeyboard.com` → 301 redirect rule → `kesatria.dev` (Cloudflare Rules).
- [ ] **Cancel IDCloudHost before Oct 10 renewal** → save 606k/yr.

## Deploy notes

- Static output (blog template, no SSR) → **no `@astrojs/cloudflare` adapter needed**. Only add it
  if the site later needs SSR/server endpoints.
- Cloudflare Pages auto-detects Astro. Explicit settings if prompted: build `pnpm build`,
  output `dist`, Node 22+ (repo uses Node 24 locally).
