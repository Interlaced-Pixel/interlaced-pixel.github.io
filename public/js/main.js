const themeToggle = document.querySelector('.theme-toggle');
const menuToggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.nav-links');

document.documentElement.classList.add('js-enabled');

function updateThemeControl() {
	if (!(themeToggle instanceof HTMLButtonElement)) return;
	const isDark = document.documentElement.dataset.theme === 'dark';
	themeToggle.setAttribute('aria-pressed', String(isDark));
	themeToggle.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
}

updateThemeControl();

themeToggle?.addEventListener('click', () => {
	const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
	document.documentElement.dataset.theme = nextTheme;
	try {
		window.localStorage.setItem('theme', nextTheme);
	} catch {
		return updateThemeControl();
	}
	updateThemeControl();
});

function closeMenu() {
	menu?.classList.remove('open');
	menuToggle?.setAttribute('aria-expanded', 'false');
	menuToggle?.setAttribute('aria-label', 'Open navigation');
}

menuToggle?.addEventListener('click', () => {
	const isOpen = menu?.classList.toggle('open') ?? false;
	menuToggle.setAttribute('aria-expanded', String(isOpen));
	menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
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

const contactForm = document.querySelector('#contact-form');
const formStatus = contactForm?.querySelector('.form-status');
const submitButton = contactForm?.querySelector('button[type="submit"]');

if (
	contactForm instanceof HTMLFormElement &&
	formStatus instanceof HTMLElement &&
	submitButton instanceof HTMLButtonElement
) {
	const originalButtonMarkup = submitButton.innerHTML;

	contactForm.addEventListener('submit', async (event) => {
		event.preventDefault();
		submitButton.disabled = true;
		submitButton.textContent = 'Sending…';
		formStatus.textContent = 'Sending your inquiry…';
		contactForm.setAttribute('aria-busy', 'true');
		let submissionSucceeded = false;

		try {
			const response = await fetch(contactForm.action, {
				method: 'POST',
				body: new FormData(contactForm),
				headers: { Accept: 'application/json' },
			});

			if (response.ok) {
				submissionSucceeded = true;
				window.location.assign('/thank-you/');
				return;
			}

			let payload = null;
			try {
				payload = await response.json();
			} catch {
				payload = null;
			}

			const messages = Array.isArray(payload?.errors)
				? payload.errors
					.map((error) => (typeof error?.message === 'string' ? error.message : ''))
					.filter(Boolean)
				: [];
			formStatus.textContent = messages.length
				? messages.join(' ')
				: 'We couldn’t send your inquiry. Please try again or email support@interlacedpixel.com.';
		} catch {
			formStatus.textContent = 'We couldn’t reach the form service. Please try again or email support@interlacedpixel.com.';
		} finally {
			contactForm.removeAttribute('aria-busy');
			if (!submissionSucceeded) {
				submitButton.disabled = false;
				submitButton.innerHTML = originalButtonMarkup;
				formStatus.focus();
			}
		}
	});
}
