---
title: 'AI in my daily engineering workflow: where it helps, and where I keep control'
description: 'How I work with an AI coding agent: plan first, one commit per change, a human on every push. A real example from building this blog.'
pubDate: 2026-10-30T19:00:00+07:00
draft: true
---

<!-- TODO(adwi): hero image. -->

I use an AI coding agent every day. Opinions about AI in software range from "it writes everything now" to "it's autocomplete with a marketing budget." My experience sits somewhere in between, and it depends almost entirely on how I set the work up.

This post uses one real example: building the scheduled publishing that put this very post online on a Friday evening without me pushing anything.

<!-- TODO(adwi): name the tools you actually use day to day (e.g. Claude Code), and roughly since when. -->

## The example: scheduled posts on a static site

kesatria.dev is a static Astro site. Astro has no built-in way to publish a post at a set time, and the site only rebuilds when I push. I wanted to write posts ahead of time and have them appear on Friday at 7 PM WIB on their own.

The whole thing came together in one session with an AI agent, and how that session ran is a good summary of how I work with these tools.

## Plan before code

I didn't start by asking for code. I started by describing the problem and asking for options.

The agent laid out two parts: a build-time filter that hides posts whose `pubDate` is still in the future, and something that triggers a rebuild on a schedule. For the trigger, its first suggestion was a GitHub Actions cron job.

When I asked for the option that made the most sense long term, it changed its recommendation, for a reason I hadn't thought of: **GitHub disables scheduled workflows in public repositories after 60 days without activity.** If I stopped writing for two months, publishing would silently stop. A Cloudflare Worker with a cron trigger doesn't have that problem, fires on time, and keeps everything with the provider that already hosts the site.

It also suggested running the rebuild **every day**, not only on Fridays. That way the schedule lives in each post's `pubDate` instead of in the infrastructure. If I ever move to Tuesdays, I change frontmatter, not cron.

Those two points were the most valuable part of the session, and neither was code.

Then I asked for a written plan with the work split into items, and approved it before anything was changed.

## One commit per change

My rule: every work item gets its own commit. No large mixed commits. When something breaks three months from now, I want `git log` to point at one small change with a clear message.

The plan had six items, and the history reads exactly like that:

```text
docs: add content ideas backlog
feat: add draft flag to blog schema
feat: hide future and draft posts from production build
fix: format post dates in Asia/Jakarta timezone
feat: add daily publish cron worker
docs: document scheduled publishing workflow
```

Feature code and documentation are kept in separate commits. Files are staged one by one, never with `git add .`.

## It made a mistake, and the checks caught it

The second commit added a `draft` field to the blog schema. It looked trivial, and it broke type checking: the About page reuses the blog post layout, and that layout's props now required a `draft` value the About page doesn't have.

The agent committed first and ran `astro check` after, which was the wrong order. But the check did run, the error was clear, and the fix was a one-line type change. Since the commit hadn't been pushed yet, it was folded into the same commit, and the history stayed clean, with every commit passing the check.

The lesson isn't "AI makes mistakes." People do too. The lesson is that **the guardrails you'd want for a junior engineer work for an agent as well**: type checks, builds, and small commits that are easy to inspect and easy to undo.

## Where I keep control

Some things I don't hand over, regardless of how good the tool is:

- **Pushing.** The agent commits locally. Nothing reaches GitHub until I say so.
- **Accounts and secrets.** Creating the Cloudflare deploy hook, logging in to Wrangler, and storing the hook URL as a secret were all done by me. The agent told me the steps; it didn't need my credentials.
- **Anything irreversible.** Deleting, overwriting, or publishing something outside the repo requires an explicit yes from me.
- **Taste and voice.** <!-- TODO(adwi): your own take on how much of your writing or design you let AI shape. -->

## Where it helps, and where it doesn't

**Where it helps:**

- Laying out options with trade-offs I'd otherwise have to dig up myself, like the 60-day GitHub Actions limit.
- Mechanical work done correctly across several files: adding a helper, updating three call sites, adjusting `tsconfig` and `.gitignore`.
- Testing its own work. It created temporary posts dated in the past, in the future, and as drafts, built the site, and checked that only the right ones ended up in the blog index, the RSS feed, and the sitemap.

**Where it doesn't:**

- **It can't supply experience I haven't given it.** The Arduino post from last week was built from my memory of a project whose documentation was lost. The agent could structure and explain it, but every real detail had to come from me.
- **It doesn't know my constraints unless I state them.** It didn't know my private social accounts shouldn't be linked to this site until I said so. Once I did, it kept to it.
- **Being confident isn't the same as being right.** It's often confident. The checks are what tell me whether it's right.

<!-- TODO(adwi): decide how you want to disclose AI involvement in your posts, including this series, and say it here in your own words. -->

## A month in

That's the first month of kesatria.dev:

1. [Why this site exists and why it runs on Astro](/blog/why-kesatria-dev-runs-on-astro/)
2. [JSON-LD for a personal blog](/blog/json-ld-for-a-personal-blog/)
3. [Bringing the elevator "ding" home](/blog/elevator-ding-arduino-nfc-buzzer/)
4. This post

<!-- TODO(adwi): teaser for November once the next month's plan is picked from docs/ideas.md. -->
