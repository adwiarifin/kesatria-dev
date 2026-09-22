// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_URL = 'https://kesatria.dev';
export const SITE_TITLE = 'kesatria.dev';
export const SITE_DESCRIPTION = 'Adwi Arifin — builder. Systems, side-projects, and notes on making things.';

export const AUTHOR_NAME = 'Adwi Arifin';
export const AUTHOR_HANDLE = 'adwiarifin';
export const AUTHOR_JOB_TITLE = 'Software Engineer';
export const AUTHOR_DESCRIPTION =
	'Software engineer building web platforms, software systems, IoT and microcontroller projects, and AI integrations.';

export const AUTHOR_LOCATION = {
	locality: 'Malang',
	region: 'East Java',
	country: 'ID',
};

// Topics the Person entity is claimed to have knowledge of. Kept tight — a
// long list dilutes the signal rather than strengthening it.
export const AUTHOR_EXPERTISE = [
	'Software architecture',
	'Web development',
	'Internet of things',
	'Embedded systems',
	'AI integration',
	'TypeScript',
	'Node.js',
	'React',
	'Astro',
	'Python',
	'Docker',
	'PostgreSQL',
];

// Profiles used for `sameAs` entity reconciliation in JSON-LD. Each list is
// scoped to the entity it actually identifies: personal accounts on the
// Person, the site's own account on the WebSite, project accounts on the
// Organization. Canonical (post-redirect) URLs only, since `sameAs` matching
// prefers exact.
export const AUTHOR_PROFILES = [
	'https://github.com/adwiarifin',
	'https://www.linkedin.com/in/adwiarifin',
	'https://x.com/adwiarifin',
];
// Instagram/Facebook @adwiarifin are deliberately absent: that tier is
// private, and `sameAs` would tie it to the public engineering identity.

export const SITE_PROFILES = ['https://www.instagram.com/kesatria.dev'];

export const BRAND_NAME = 'Kesatria Keyboard';
export const BRAND_PROFILES = [
	'https://www.instagram.com/kesatriakeyboard',
	'https://www.facebook.com/kesatriakeyboard',
];
