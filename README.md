# kesatria.dev

Personal site of Adwi Arifin — systems, side-projects, and notes on making things. Built with [Astro](https://astro.build).

Live at [kesatria.dev](https://kesatria.dev).

## Structure

```text
├── docs/                    # ideas backlog, infra migration notes
├── public/                  # static assets served as-is (favicon)
├── src/
│   ├── assets/              # images & fonts processed by Astro
│   ├── components/          # BaseHead, Header, Footer, HeaderLink, FormattedDate
│   ├── content/blog/        # blog posts (Markdown / MDX)
│   ├── layouts/             # BlogPost.astro
│   ├── lib/posts.ts         # getPublishedPosts(): drops drafts and future posts
│   ├── pages/               # routes: /, /about, /blog, /blog/[slug], /rss.xml
│   ├── styles/global.css
│   ├── consts.ts            # SITE_TITLE, SITE_DESCRIPTION
│   └── content.config.ts    # blog collection schema
├── workers/publish-cron/    # Cloudflare Worker that rebuilds the site daily
├── astro.config.mjs
└── package.json
```

Files in `src/pages/` become routes based on their file name. `src/content/blog/` is a content collection — frontmatter is type-checked against the schema in `src/content.config.ts`.

## Writing a post

Drop a `.md` or `.mdx` file into `src/content/blog/`. The filename becomes the URL slug.

```markdown
---
title: 'Post title'
description: 'Shown in listings, meta tags, and the RSS feed.'
pubDate: 2026-10-09T19:00:00+07:00   # include the WIB offset
updatedDate: 2026-10-10T09:00:00+07:00   # optional
heroImage: '../../assets/your-image.jpg'   # optional
draft: true                          # optional, defaults to false
---

Post body here.
```

Posts show up on `/blog`, in `/rss.xml`, and in the sitemap, sorted newest first.

## Scheduled publishing

Astro has no scheduled posts, so publishing happens at build time. A production build only includes a post when `draft` is false and its `pubDate` has passed (`src/lib/posts.ts`). The dev server shows everything, so drafts and scheduled posts can be previewed locally.

To schedule a post, set a future `pubDate`, set `draft: false`, and push. It stays hidden until the first build after that time.

That build comes from `workers/publish-cron`, a Cloudflare Worker that calls the Pages deploy hook every day at 19:00 WIB (`0 12 * * *` UTC). The schedule lives in each post's `pubDate`, so changing the publishing day needs no infra change. The cron must not fire before the publish time, or a post due at 19:00 misses that day's build.

Set up or redeploy the Worker from `workers/publish-cron/`:

```sh
pnpm dlx wrangler@4 secret put DEPLOY_HOOK_URL   # Pages deploy hook for `main`
pnpm dlx wrangler@4 deploy
```

To test the handler locally, put a dummy `DEPLOY_HOOK_URL` in `.dev.vars`, run `pnpm dlx wrangler@4 dev --test-scheduled`, and open `http://localhost:8787/__scheduled?cron=0+12+*+*+*`.

This repo is public, so a pushed draft or scheduled post can be read on GitHub before it goes live. Keep anything that must stay hidden on a local branch until then.

Post ideas and the monthly plan live in `docs/ideas.md`.

## Commands

Run from the project root:

| Command           | Action                                           |
| :---------------- | :----------------------------------------------- |
| `pnpm install`    | Install dependencies                             |
| `pnpm dev`        | Start dev server at `localhost:4321`             |
| `pnpm build`      | Build production site to `./dist/`               |
| `pnpm preview`    | Preview the build locally before deploying       |
| `pnpm astro ...`  | Run CLI commands like `astro add`, `astro check` |

Requires Node >= 22.12.0 and pnpm.

## Features

- Sitemap and RSS feed
- Canonical URLs and Open Graph metadata
- Markdown & MDX support
- Self-hosted Atkinson Hyperlegible font

## Credit

Started from the Astro blog starter, which is based on [Bear Blog](https://github.com/HermanMartinus/bearblog/).
</content>
