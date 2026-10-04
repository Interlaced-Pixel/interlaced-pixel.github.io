import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

export const prerender = true;

const publicPages = [
	'/',
	'/about/',
	'/services/',
	'/projects/',
	'/projects/pixelnow-mac/',
	'/projects/macpicard/',
	'/blog/',
	'/contact/',
	'/privacy/',
];

const escapeXml = (value: string): string =>
	value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;');

export const GET: APIRoute = async ({ site }) => {
	const origin = site ?? new URL('https://interlacedpixel.com');
	const posts = await getCollection('blog');
	const staticUrls = publicPages.map((path) => ({
		url: new URL(path, origin).href,
		lastModified: undefined,
	}));
	const articleUrls = posts.map((post) => ({
		url: new URL(`/blog/${post.slug}/`, origin).href,
		lastModified: post.data.updatedDate ?? post.data.date,
	}));
	const entries = [...staticUrls, ...articleUrls]
		.map(({ url, lastModified }) => {
			const lastModifiedTag = lastModified
				? `<lastmod>${lastModified.toISOString()}</lastmod>`
				: '';
			return `<url><loc>${escapeXml(url)}</loc>${lastModifiedTag}</url>`;
		})
		.join('');
	const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries}</urlset>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
		},
	});
};
