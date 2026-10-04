export interface Screenshot {
	src: string;
	alt: string;
	caption: string;
	width: number;
	height: number;
}

export interface Project {
	slug?: string;
	name: string;
	featured?: boolean;
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
		featured: true,
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
				width: 1024,
				height: 671,
			},
			{
				src: '/images/pixelnow/pixelnow-library.png',
				alt: 'PixelNOW library and player stats view showing game rails and detailed session tracking',
				caption: 'Library & Player Stats — game rails, active playtime tracking, and session diagnostics',
				width: 1024,
				height: 671,
			},
		],
	},
	{
		slug: 'macpicard',
		name: 'MacPicard',
		featured: true,
		eyebrow: 'Native music library tools',
		description:
			'A calmer way to clean up your music library. Identify music with MusicBrainz, review metadata and artwork, and preview file organization before saving changes.',
		longDescription:
			'MacPicard is a native macOS app for identifying, editing, and organizing music files with MusicBrainz. Review matches, stage metadata and artwork changes, and preview file moves before saving the result.',
		highlights: [
			'Identify albums and tracks with MusicBrainz release matching and built-in audio fingerprinting.',
			'Review proposed tags, track assignments, and artwork before applying changes.',
			'Edit metadata and artwork for individual tracks, albums, or full libraries.',
			'Run Picard-style scripts and preview file organization with collision checks.',
			'Import music into managed libraries while leaving source files unchanged.',
			'Play supported audio, search and filter collections, and manage multiple libraries.',
		],
		tags: ['SwiftUI', 'macOS', 'MusicBrainz', 'Audio'],
		status: 'In development · macOS 26+',
		href: '/projects/macpicard/',
		action: 'View the project',
		accent: 'violet',
		icon: 'MP',
		logo: '/images/macpicard/icon.png',
		repoHref: 'https://github.com/Interlaced-Pixel/MacPicard',
		screenshots: [
			{
				src: '/images/macpicard/library-browser.png',
				alt: 'MacPicard music library with an album sidebar and a track table showing metadata and artwork',
				caption: 'Library workspace — browse albums, review track metadata, and organize your collection.',
				width: 3008,
				height: 1808,
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
