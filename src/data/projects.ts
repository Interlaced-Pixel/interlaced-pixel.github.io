export interface Project {
	name: string;
	eyebrow: string;
	description: string;
	tags: string[];
	status: string;
	href: string;
	action: string;
	accent: 'cyan' | 'amber' | 'violet';
	icon: string;
}

export const projects: Project[] = [
	{
		name: 'socks-proxy',
		eyebrow: 'Portable infrastructure',
		description:
			'A dependency-free SOCKS5 proxy built in C. Ship one small binary across Linux, macOS, and Windows.',
		tags: ['C', 'SOCKS5', 'Cross-platform'],
		status: 'Stable · v1.0',
		href: 'https://github.com/Interlaced-Pixel/socks-proxy',
		action: 'View source',
		accent: 'cyan',
		icon: 'SP',
	},
	{
		name: 'coverage-status',
		eyebrow: 'Developer experience',
		description:
			'A focused VS Code extension that surfaces LCOV coverage directly in the status bar while you work.',
		tags: ['TypeScript', 'VS Code', 'LCOV'],
		status: 'Published extension',
		href: 'https://marketplace.visualstudio.com/items?itemName=InterlacedPixel.code-coverage-status',
		action: 'Open in Marketplace',
		accent: 'amber',
		icon: 'CS',
	},
	{
		name: 'http-c',
		eyebrow: 'Networking library',
		description:
			'A compact modern C++ HTTP library for performance-sensitive networking and systems projects.',
		tags: ['C++17', 'HTTP/1.1', 'Networking'],
		status: 'Alpha',
		href: 'https://github.com/Interlaced-Pixel/http-c',
		action: 'View source',
		accent: 'violet',
		icon: 'HC',
	},
];
