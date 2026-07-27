# kesatria.dev

Personal site of Adwi Arifin — systems, side-projects, and notes on making things. Built with [Astro](https://astro.build).

Live at [kesatria.dev](https://kesatria.dev).

## Structure

```text
├── public/                  # static assets served as-is (favicon)
├── src/
│   ├── assets/              # images & fonts processed by Astro
│   ├── components/          # BaseHead, Header, Footer, HeaderLink, FormattedDate
│   ├── content/blog/        # blog posts (Markdown / MDX)
│   ├── layouts/             # BlogPost.astro
│   ├── pages/               # routes: /, /about, /blog, /blog/[slug], /rss.xml
│   ├── styles/global.css
│   ├── consts.ts            # SITE_TITLE, SITE_DESCRIPTION
│   └── content.config.ts    # blog collection schema
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
pubDate: 'Jul 27 2026'
updatedDate: 'Jul 28 2026'      # optional
heroImage: '../../assets/your-image.jpg'   # optional
---

Post body here.
```

Posts show up automatically on `/blog` and in `/rss.xml`, sorted newest first.

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
