const themeToggle = document.querySelector('.theme-toggle');
const menuToggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.nav-links');

themeToggle?.addEventListener('click', () => {
	const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
	document.documentElement.dataset.theme = nextTheme;
	localStorage.setItem('theme', nextTheme);
});

function closeMenu() {
	menu?.classList.remove('open');
	menuToggle?.setAttribute('aria-expanded', 'false');
}

menuToggle?.addEventListener('click', () => {
	const isOpen = menu?.classList.toggle('open') ?? false;
	menuToggle.setAttribute('aria-expanded', String(isOpen));
});

menu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

document.addEventListener('keydown', (event) => {
	if (event.key === 'Escape') {
		closeMenu();
	}
});

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealElements = document.querySelectorAll('.reveal');

if (reducedMotion || !('IntersectionObserver' in window)) {
	revealElements.forEach((element) => element.classList.add('visible'));
} else {
	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.classList.add('visible');
					observer.unobserve(entry.target);
				}
			});
		},
		{ threshold: 0.12, rootMargin: '0px 0px -30px' },
	);

	revealElements.forEach((element) => observer.observe(element));
}
