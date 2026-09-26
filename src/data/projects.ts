export interface Screenshot {
	src: string;
	alt: string;
	caption: string;
}

export interface Project {
	slug?: string;
	name: string;
	eyebrow: string;
	description: string;
	longDescription?: string;
	highlights?: string[];
	tags: string[];
	status: string;
	href: string;
	action: string;
	accent: 'cyan' | 'amber' | 'violet';
	icon: string;
	logo?: string;
	downloadHref?: string;
	repoHref?: string;
	screenshots?: Screenshot[];
}

export const projects: Project[] = [
	{
		slug: 'pixelnow-mac',
		name: 'PixelNOW',
		eyebrow: 'Native cloud gaming',
		description:
			'A native Apple Silicon client for GeForce NOW: catalog, launch, stream, record, and switch NVIDIA accounts without leaving the Mac desktop.',
		longDescription:
			'PixelNOW is a SwiftUI macOS app for browsing, launching, streaming, and recording GeForce NOW sessions. It replaces the browser-bound experience with a native catalog, OAuth sign-in, multi-account switching, WebRTC and NVST streaming, local recordings, and diagnostics built for M-series Macs.',
		highlights: [
			'Native SwiftUI catalog with a six-image hero, search, filters, favorites, and library rails',
			'OAuth sign-in plus multi-account NVIDIA login, with sessions isolated per account',
			'Native WebRTC and decoupled NVST streaming with hardware video enhancement, audio, and HUD diagnostics',
			'Local gameplay recordings with saved metadata and a recordings browser',
			'Settings for account, display, bitrate, server location, upscaling, and network QoS',
		],
		tags: ['Swift', 'macOS', 'WebRTC', 'GeForce NOW'],
		status: 'Available · macOS',
		href: '/projects/pixelnow-mac/',
		action: 'View the project',
		accent: 'cyan',
		icon: 'PN',
		logo: '/images/pixelnow/icon.png',
		downloadHref: 'https://github.com/Interlaced-Pixel/PixelNOW-Mac/releases/latest',
		repoHref: 'https://github.com/Interlaced-Pixel/PixelNOW-Mac',
		screenshots: [
			{
				src: '/images/pixelnow/pixelnow-catalog.jpg',
				alt: 'PixelNOW catalog interface displaying game library and detailed game information sidebar',
				caption: 'Catalog & Game Detail — native grid, search, and integrated game launcher sidebar',
			},
			{
				src: '/images/pixelnow/pixelnow-library.png',
				alt: 'PixelNOW library and player stats view showing game rails and detailed session tracking',
				caption: 'Library & Player Stats — game rails, active playtime tracking, and session diagnostics',
			},
		],
	},
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
