import { type CollectionEntry, getCollection } from 'astro:content';

// Astro has no scheduled publishing, so it happens at build time: a post is
// built once its `pubDate` has passed and it isn't a draft. The site is
// rebuilt daily (see workers/publish-cron) so due posts go live on their own.
// In dev everything is returned so drafts and scheduled posts can be previewed.
export async function getPublishedPosts(): Promise<CollectionEntry<'blog'>[]> {
	const now = new Date();
	const posts = await getCollection(
		'blog',
		({ data }) => import.meta.env.DEV || (!data.draft && data.pubDate <= now),
	);
	return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}
