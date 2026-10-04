---
title: 'JSON-LD for a personal blog: Person, WebSite, and BlogPosting as one graph'
description: 'How kesatria.dev describes itself to search engines with linked JSON-LD, and why some of my social accounts are deliberately left out.'
pubDate: 2026-10-16T19:00:00+07:00
draft: true
---

<!-- TODO(adwi): hero image. A simple diagram of the three nodes and their links would work. -->

Search engines read your HTML, but they also read structured data: a block of JSON-LD that says, in a vocabulary they understand, "this page is a blog post, written by this person, on this website." For a personal site, that's how you tell search engines that the author of these posts is the same person as the GitHub, LinkedIn, and X accounts with the same name.

Here's how kesatria.dev does it, plus one decision that has more to do with privacy than with SEO.

## Three entities, one graph

The site describes three things:

- **Person:** me, the author.
- **WebSite:** kesatria.dev itself.
- **BlogPosting:** each individual post.

There's also an **Organization** for Kesatria Keyboard, my keyboard brand, which I founded.

The simple approach is to repeat the full author details inside every post. That works, but it means the same person gets declared many times, with nothing saying it's the same person. Instead, the site-wide entities live once, in the base layout, and each one gets an `@id`:

```js
{
	'@context': 'https://schema.org',
	'@graph': [
		{
			'@type': 'WebSite',
			'@id': `${SITE_URL}/#website`,
			publisher: { '@id': `${SITE_URL}/#person` },
			// ...
		},
		{
			'@type': 'Person',
			'@id': `${SITE_URL}/#person`,
			name: AUTHOR_NAME,
			sameAs: AUTHOR_PROFILES,
			// ...
		},
		{
			'@type': 'Organization',
			'@id': `${SITE_URL}/#kesatria-keyboard`,
			founder: { '@id': `${SITE_URL}/#person` },
			// ...
		},
	],
}
```

An `@id` is just a URL used as a name. It doesn't need to resolve to a page. What matters is that the same string means the same entity everywhere it appears.

Each post then points at those nodes instead of redeclaring them:

```js
{
	'@type': 'BlogPosting',
	headline: title,
	datePublished: pubDate.toISOString(),
	author: {
		'@type': 'Person',
		'@id': `${SITE_URL}/#person`,
		name: AUTHOR_NAME,
		url: SITE_URL,
	},
	isPartOf: { '@id': `${SITE_URL}/#website` },
}
```

The `author` keeps a name and URL inline as well, so the block still makes sense to a parser that reads it on its own. The `@id` is what ties it back to the full Person node.

## `sameAs`: who is who

`sameAs` is the property that links an entity to its profiles elsewhere. It's the most useful part of the whole setup for a personal site, and the easiest to get wrong.

The rule I follow: **each account goes on the entity it actually identifies.**

- My personal GitHub, LinkedIn, and X go on the **Person**.
- The site's own Instagram account goes on the **WebSite**.
- Kesatria Keyboard's accounts go on the **Organization**.

Putting everything on the Person is tempting, because more links feel like more signal. But it's wrong: it tells search engines that a brand account *is* me. Keeping them separate, with the Organization's `founder` pointing to the Person, describes the actual relationship.

In code, that's three separate lists in `src/consts.ts` rather than one:

```ts
export const AUTHOR_PROFILES = [
	'https://github.com/adwiarifin',
	'https://www.linkedin.com/in/adwiarifin',
	'https://x.com/adwiarifin',
];
export const SITE_PROFILES = ['https://www.instagram.com/kesatria.dev'];
export const BRAND_PROFILES = [
	'https://www.instagram.com/kesatriakeyboard',
	'https://www.facebook.com/kesatriakeyboard',
];
```

## The accounts that aren't there

My personal Instagram and Facebook aren't in any of these lists, and that's deliberate.

I actually added my personal Instagram to the Person at first. It's my account, with my name, so it seemed to belong there. Then I took it out. Those accounts are private and for friends and family. Adding them to `sameAs` tells search engines, in the most explicit way available, that my private life and my public engineering work are the same entity. That's the opposite of what I want.

<!-- TODO(adwi): a line in your own words on why you keep this boundary. -->

So structured data turned out to be a privacy decision as much as an SEO one. The question isn't only "what can I link?" but "what do I want linked?" There's now a comment in the code so I don't undo it later:

```ts
// Instagram/Facebook @adwiarifin are deliberately absent: that tier is
// private, and `sameAs` would tie it to the public engineering identity.
```

## Two small details that matter

**Escape `<` in the JSON.** JSON-LD sits inside a `<script>` tag. If a post title ever contains `</script>`, the browser ends the tag right there and the rest spills into the page. Replacing `<` with its Unicode escape keeps the JSON valid and the tag intact:

```js
const json = JSON.stringify(structuredData).replace(/</g, '\\u003c');
```

**Keep the default social image at a stable URL.** The fallback Open Graph image lives in `public/`, not `src/assets/`. Astro adds a content hash to processed assets, so the URL changes whenever the image does. Social platforms cache link previews by image URL, so a stable path is easier to reason about.

## Checking it

<!-- TODO(adwi): run a post URL through https://validator.schema.org and Google's Rich Results Test once it's live; add a screenshot or the result here. -->

Structured data doesn't guarantee anything. Search engines treat it as a hint, not an instruction. But a clean, connected graph is the clearest hint you can give, and for a personal site that's mostly about one question: is this the same person?

Next week: something with a buzzer.
