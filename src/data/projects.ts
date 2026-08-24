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
	featured?: boolean;
	image?: string;
	logo?: string;
	downloadHref?: string;
	repoHref?: string;
	screenshots?: Screenshot[];
}

export const projects: Project[] = [
	{
		slug: 'opennow-mac',
		name: 'OpenNOW',
		eyebrow: 'Native cloud gaming',
		description:
			'A native Apple Silicon client for GeForce NOW: catalog, launch, stream, record, and switch NVIDIA accounts without leaving the Mac desktop.',
		longDescription:
			'OpenNOW is a SwiftUI macOS app for browsing, launching, streaming, and recording GeForce NOW sessions. It replaces the browser-bound experience with a native catalog, OAuth sign-in, multi-account switching, WebRTC streaming, local recordings, and diagnostics built for M-series Macs.',
		highlights: [
			'Native SwiftUI catalog with a six-image hero, search, filters, favorites, and library rails',
			'OAuth sign-in plus multi-account NVIDIA login, with sessions isolated per account',
			'Native WebRTC streaming with input, microphone, audio, video enhancement, and HUD diagnostics',
			'Local gameplay recordings with saved metadata and a recordings browser',
			'Settings for account, connections, gameplay, server location, upscaling, system, and diagnostics',
		],
		tags: ['Swift', 'macOS', 'WebRTC', 'GeForce NOW'],
		status: 'Featured · v1.53',
		href: '/projects/opennow-mac/',
		action: 'View the project',
		accent: 'cyan',
		icon: 'ON',
		featured: true,
		image: '/images/opennow/opennow-catalog.jpg',
		logo: '/images/opennow/icon.png',
		downloadHref: 'https://github.com/Interlaced-Pixel/OpenNOW-Mac/releases/latest',
		repoHref: 'https://github.com/Interlaced-Pixel/OpenNOW-Mac',
		screenshots: [
			{
				src: '/images/opennow/opennow-catalog.jpg',
				alt: 'OpenNOW catalog with a cinematic hero and game rails',
				caption: 'Catalog home — hero rotation, search, and game rails',
			},
			{
				src: '/images/opennow/opennow-detail.jpg',
				alt: 'OpenNOW game detail with store picker and Play button',
				caption: 'Game detail — store ownership, launch, and library actions',
			},
			{
				src: '/images/opennow/opennow-stream.jpg',
				alt: 'OpenNOW streaming session with latency and FPS overlay',
				caption: 'Native stream — WebRTC playback with live diagnostics',
			},
			{
				src: '/images/opennow/opennow-settings.jpg',
				alt: 'OpenNOW settings showing multi-account NVIDIA login',
				caption: 'Settings — multi-account login and stream preferences',
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

export const featuredProject = projects.find((project) => project.featured) ?? projects[0];
export const supportingProjects = projects.filter((project) => !project.featured);
