---
title: 'Why kesatria.dev exists, and why it runs on Astro'
description: 'What this blog is for, why I moved it to a static Astro site on Cloudflare, and the small decisions I made before writing a single post.'
pubDate: 2026-10-09T19:00:00+07:00
heroImage: '../../assets/blog/why-kesatria-dev-runs-on-astro.jpg'
draft: false
---

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

Honestly, this site started as a cost decision.

I had two domains with two different providers. kesatriakeyboard.com was with a local provider, and kesatria.dev was registered through Google Domains, which has since moved to Squarespace. Renewals there got expensive. The local provider was hard to maintain. Its domain was often bundled with hosting, but that hosting didn't offer much unless I upgraded to a pricier tier. For a personal hobby, paying more each year for less didn't make sense.

Then I remembered that Cloudflare has basically everything: a domain registrar, DNS, and static hosting with a free tier. I looked at the AWS ecosystem as well, but after working through its layers of services, it didn't make the cut for something this small.

So I moved both domains to Cloudflare and rebuilt the site as a static Astro site on Cloudflare Pages. Kesatria Keyboard, the name I've used online since school (the story is on the [about page](/about)), now lives under kesatria.dev too.

The posts from the old blog aren't coming over as they were. Some of them will come back as ideas for new posts, rewritten with what I know now.

## Why Astro

I wanted three things: content first, very little JavaScript sent to readers, and tooling that stays simple.

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

**Simple tooling.** It's TypeScript, components, and Markdown. I looked at two alternatives:

- **Next.js** is excellent for applications, but for a blog it brings a runtime and conventions I'd be working around rather than using.
- **Hugo** is the one I thought about longest. Go is my primary language at work, so Hugo would have been the natural pick. But I wanted this project to stay as simple as possible, and for a content site, Astro's components and Markdown are simpler to work with than Go's templating.

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
