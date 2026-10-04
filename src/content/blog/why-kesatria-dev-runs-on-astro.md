---
title: 'Why kesatria.dev exists, and why it runs on Astro'
description: 'What this blog is for, why I rebuilt an old Laravel blog as a static Astro site, and the small decisions I made before writing a single post.'
pubDate: 2026-10-09T19:00:00+07:00
draft: true
---

<!-- TODO(adwi): hero image (1200x630 crops well for social cards). -->

This is the first post on kesatria.dev, so it's a good place to say what the site is for and how it's built.

## What this blog is for

I'm a software engineer in Malang. Most of my work is web platforms and backend systems, but a growing share of what I build sits off the screen: microcontrollers, sensors, small devices that make a noise when you tap a card on them. Lately I also spend a lot of time figuring out where AI actually fits in day-to-day engineering.

kesatria.dev is where I write that down. Expect four kinds of posts:

- **Web and software architecture.** How things are put together and why.
- **Hardware and IoT.** ESP32, Arduino, MicroPython, and whatever is on the breadboard.
- **AI in engineering workflows.** What works, what doesn't, and where I draw lines.
- **Engineering lessons.** The decisions that only make sense in hindsight.

A new post goes up every Friday at 7 PM Western Indonesia Time (WIB).

## Why write in public

Part of it is positioning. I want one place on the internet that shows how I think and work as an engineer.

The bigger reason is simpler. What I've learned shouldn't disappear with me. Writing it down is the most durable way I know to pass it on.

And yes, AI is everywhere now. It helped draft this post, too. But the ideas, the experiences, and the decisions come from a person. I don't believe AI will replace people. I think it will exist alongside us and leave us more time for the things that matter.

## Where it came from

kesatria.dev didn't start from nothing. Before this, there was a Laravel 5 blog for Kesatria Keyboard, my mechanical keyboard project, running on paid shared hosting. It worked, but it was a full PHP application with a database, an admin panel, and an upgrade path that I kept postponing. That's a lot of machinery for something that mostly serves text.

So I rewrote it as a static site and moved everything (domains, DNS, hosting) to Cloudflare. The keyboard brand now lives under kesatria.dev too.

<!-- TODO(adwi): the old blog's database is backed up; worth saying whether the old keyboard posts will be migrated. -->

## Why Astro

I wanted three things: content first, very little JavaScript sent to readers, and tooling I already live in.

**Content first.** Posts are Markdown files in the repo. Astro's content collections validate each post's frontmatter against a schema, so a typo in a date or a missing description fails the build instead of shipping:

```ts
schema: ({ image }) =>
	z.object({
		title: z.string(),
		description: z.string(),
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		heroImage: z.optional(image()),
		draft: z.boolean().default(false),
	}),
```

**Little JavaScript by default.** Astro renders pages to HTML at build time and only ships JavaScript for components that explicitly need it. A blog post doesn't need a client-side framework to display paragraphs, so this one ships none.

**Familiar tooling.** It's TypeScript, components, and npm packages. I looked at two alternatives:

- **Next.js** is excellent for applications, but for a blog it brings a runtime and conventions I'd be working around rather than using.
- **Hugo** is fast and mature, but its Go templates are one more language to keep in my head for a site I touch once a week.

<!-- TODO(adwi): confirm these were the alternatives you actually weighed; swap in your real ones if not. -->

The output is plain HTML, CSS, and images, served from Cloudflare Pages. No server, no database, nothing to patch.

## Small decisions before the first post

A few things I set up early that are easy to skip and annoying to add later:

- **Type checking with `astro check`.** It catches broken props and bad imports in `.astro` files that a plain build would let through.
- **Dependabot, minus one upgrade.** Dependencies update weekly, but TypeScript major versions are blocked. TypeScript 7 is the native compiler rewrite, and it drops the programmatic API that `astro check` relies on. Until that's supported, staying on 6.x is the safer default.
- **The boring essentials.** A `robots.txt` pointing to the sitemap, a real 404 page, an RSS feed, and footer links that go somewhere.
- **Structured data.** The site describes itself and its author to search engines with JSON-LD. That turned out to be interesting enough for its own post, which is next week.

## Scheduled posts on a static site

Astro has no built-in way to publish a post at a set time, so I built it: every post has a `pubDate`, production builds skip anything still in the future, and a small Cloudflare Worker rebuilds the site every evening. I can push a post days early and it appears on Friday at 7 PM on its own. I'll write up the details in a later post.

## What's next

- **Next Friday:** structured data for a personal blog, and why some of my social accounts are deliberately left out of it.
- **After that:** a small Arduino project that brings an elevator "ding" home.

If you want to follow along, there's an [RSS feed](/rss.xml).
