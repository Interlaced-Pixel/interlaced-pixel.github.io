// Interlaced Pixel - Main JS
'use strict';

document.addEventListener('DOMContentLoaded', () => {

    // ── Dark Mode Toggle ──
    const themeToggle = document.querySelector('.theme-toggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    
    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        const icon = themeToggle?.querySelector('.material-icons-outlined');
        if (icon) {
            icon.textContent = theme === 'dark' ? 'light_mode' : 'dark_mode';
        }
    }
    
    // Initialize theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        setTheme(savedTheme);
    } else if (prefersDark.matches) {
        setTheme('dark');
    }
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            setTheme(current === 'dark' ? 'light' : 'dark');
        });
    }
    
    // Listen for system preference changes
    prefersDark.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });

    // ── Mobile Hamburger Menu ──
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.topbar-nav');
    const menuOverlay = document.querySelector('.menu-overlay');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            const isActive = hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            menuOverlay?.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', isActive);
            document.body.style.overflow = isActive ? 'hidden' : '';
        });
        
        menuOverlay?.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            menuOverlay.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
        
        // Close menu when link clicked
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                menuOverlay?.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });
    }

    // ── Scroll Reveal Animation ──
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        revealElements.forEach(el => revealObserver.observe(el));
    }

    // ── Hero Parallax Effect ──
    const heroSection = document.querySelector('.hero.parallax');
    if (heroSection) {
        const heroH1 = heroSection.querySelector('h1');
        const heroP = heroSection.querySelector('p');
        
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            const heroHeight = heroSection.offsetHeight;
            
            if (scrollY < heroHeight) {
                const parallaxAmount = scrollY * 0.3;
                if (heroH1) heroH1.style.transform = `translateY(${parallaxAmount}px)`;
                if (heroP) heroP.style.transform = `translateY(${parallaxAmount * 0.5}px)`;
            }
        }, { passive: true });
    }

    // ── Real-time Form Validation ──
    const formInputs = document.querySelectorAll('#contact-form input, #contact-form textarea');
    formInputs.forEach(input => {
        input.addEventListener('blur', () => {
            validateInput(input);
        });
        
        input.addEventListener('input', () => {
            if (input.classList.contains('touched')) {
                validateInput(input);
            }
        });
    });
    
    function validateInput(input) {
        input.classList.add('touched');
        const isValid = input.checkValidity();
        
        // Remove existing validation icons
        const existingIcon = input.parentElement.querySelector('.validation-icon');
        if (existingIcon) existingIcon.remove();
        
        // Add validation icon
        if (input.value.trim() !== '') {
            const icon = document.createElement('span');
            icon.className = `validation-icon material-icons-outlined ${isValid ? 'valid' : 'invalid'}`;
            icon.textContent = isValid ? 'check_circle' : 'error';
            
            // Wrap input if not already wrapped
            if (!input.parentElement.classList.contains('input-wrapper')) {
                const wrapper = document.createElement('div');
                wrapper.className = 'input-wrapper';
                input.parentNode.insertBefore(wrapper, input);
                wrapper.appendChild(input);
            }
            input.parentElement.appendChild(icon);
        }
    }

    // ── Smooth scroll for anchor links ──
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ── Active Section Highlighting ──
    const sections = document.querySelectorAll('section, header, footer, div#projects');
    const navLinks = document.querySelectorAll('.topbar-link');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.3
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remove active class from all links
                navLinks.forEach(link => link.classList.remove('active'));
                
                // Add active class to corresponding link
                const id = entry.target.getAttribute('id');
                if (id) {
                    const activeLink = document.querySelector(`.topbar-link[href="#${id}"]`);
                    if (activeLink) activeLink.classList.add('active');
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));

    // ── Lightning / Thunder background ──
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const BOLT_COLORS = ['#4A90D9', '#F5C542', '#E86B8A']; // blue, yellow, pink
    function hexToRgba(hex, a = 1) {
        const h = hex.replace('#','');
        const r = parseInt(h.substring(0,2),16);
        const g = parseInt(h.substring(2,4),16);
        const b = parseInt(h.substring(4,6),16);
        return `rgba(${r},${g},${b},${a})`;
    }

    let width, height;
    let bolts = [];
    let flashAlpha = 0;
    let flashColor = '#fff';

    // ── Thunder sound via Web Audio API ──
    let audioCtx = null;
    let audioUnlocked = false;

    function unlockAudio() {
        if (audioUnlocked) return;
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        audioUnlocked = true;
        // Remove listeners once unlocked
        window.removeEventListener('click', unlockAudio);
        window.removeEventListener('keydown', unlockAudio);
        window.removeEventListener('touchstart', unlockAudio);
    }

    // Unlock audio on first user interaction
    window.addEventListener('click', unlockAudio);
    window.addEventListener('keydown', unlockAudio);
    window.addEventListener('touchstart', unlockAudio);

    function playThunder() {
        if (!audioCtx || audioCtx.state === 'suspended') return;

        const duration = 1.2 + Math.random() * 0.8; // 1.2–2s rumble
        const now = audioCtx.currentTime;

        // White noise buffer
        const bufferSize = audioCtx.sampleRate * duration;
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1);
        }

        const noise = audioCtx.createBufferSource();
        noise.buffer = buffer;

        // Low-pass filter for deep rumble
        const lpFilter = audioCtx.createBiquadFilter();
        lpFilter.type = 'lowpass';
        lpFilter.frequency.value = 150 + Math.random() * 80;
        lpFilter.Q.value = 0.7;

        // Gentle bandpass for body
        const bpFilter = audioCtx.createBiquadFilter();
        bpFilter.type = 'bandpass';
        bpFilter.frequency.value = 60 + Math.random() * 40;
        bpFilter.Q.value = 0.5;

        // Volume envelope — quick attack, slow decay
        const gainNode = audioCtx.createGain();
        const volume = 0.12 + Math.random() * 0.08; // 0.12–0.20
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(volume, now + 0.04);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

        // Connect: noise → lowpass → bandpass → gain → output
        noise.connect(lpFilter);
        lpFilter.connect(bpFilter);
        bpFilter.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        noise.start(now);
        noise.stop(now + duration);
    }

    // ── Rain background (drops + splashes) ──
    const DROP_COUNT = 180;
    let drops = [];
    let splashes = [];
    let mouseX = 0, mouseY = 0;

    function initDrops() {
        drops = [];
        splashes = [];
        for (let i = 0; i < DROP_COUNT; i++) {
            const baseHex = BOLT_COLORS[Math.floor(Math.random() * BOLT_COLORS.length)];
            drops.push({
                x: Math.random() * width,
                y: Math.random() * height,
                length: 12 + Math.random() * 14,
                vy: 4 + Math.random() * 6,
                vx: (Math.random() - 0.5) * 0.8,
                width: Math.random() * 0.6 + 0.8,
                color: hexToRgba(baseHex, 0.18 + Math.random() * 0.18),
                baseHex: baseHex,
                phase: Math.random() * Math.PI * 2
            });
        }

        mouseX = width / 2;
        mouseY = height / 2;
    }

    // mouse-based subtle wind
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    window.addEventListener('mouseleave', () => {
        mouseX = width / 2;
        mouseY = height / 2;
    });

    function drawDrops(now) {
        const t = now * 0.001; // seconds
        const wind = (mouseX - width / 2) / width * 0.6; // -0.3..0.3

        // Update & draw drops
        for (let i = 0; i < drops.length; i++) {
            const d = drops[i];

            // gentle sway and wind
            d.vx += Math.sin(t * 1.5 + d.phase) * 0.002;
            d.x += d.vx + wind * 0.35;
            d.y += d.vy;

            // wrap horizontally
            if (d.x < -20) d.x = width + 20;
            if (d.x > width + 20) d.x = -20;

            // hit ground -> splash and reset to top
            if (d.y > height - 6) {
                splashes.push({ x: d.x, y: height - 6, r: 0, maxR: 4 + d.length * 0.12, alpha: 0.9, colorHex: d.baseHex });
                d.x = Math.random() * width;
                d.y = -Math.random() * 120;
                d.vy = 2 + Math.random() * 4;
                d.vx = (Math.random() - 0.5) * 0.5;
            }

            // draw drop
            ctx.save();
            ctx.strokeStyle = d.color;
            ctx.lineWidth = d.width;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(d.x, d.y);
            ctx.lineTo(d.x - (d.vx * 4), d.y - d.length);
            ctx.stroke();
            ctx.restore();
        }

        // Update & draw splashes
        for (let i = splashes.length - 1; i >= 0; i--) {
            const s = splashes[i];
            s.r += 0.6;
            s.alpha *= 0.92;
            if (s.alpha < 0.02 || s.r > s.maxR) {
                splashes.splice(i, 1);
                continue;
            }
            ctx.save();
            ctx.strokeStyle = hexToRgba(s.colorHex || '#4A90D9', 0.28 * s.alpha);
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        }
    }

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        initDrops();
    }
    window.addEventListener('resize', resize);
    resize();

    // ── Lightning bolt generator ──
    function createBolt(startX, startY, angle, depth) {
        const segments = [];
        let x = startX;
        let y = startY;
        const segLen = Math.random() * 12 + 8;
        const steps = Math.floor(Math.random() * 18) + 12;
        const color = BOLT_COLORS[Math.floor(Math.random() * BOLT_COLORS.length)];

        for (let i = 0; i < steps; i++) {
            const jitter = (Math.random() - 0.5) * 1.2;
            const nx = x + Math.cos(angle + jitter) * segLen;
            const ny = y + Math.sin(angle + jitter) * segLen;
            segments.push({ x1: x, y1: y, x2: nx, y2: ny });
            x = nx;
            y = ny;

            // Branch
            if (depth < 2 && Math.random() < 0.2) {
                const branchAngle = angle + (Math.random() - 0.5) * 1.5;
                const branch = createBolt(x, y, branchAngle, depth + 1);
                branch.segments.forEach(s => segments.push(s));
            }
        }

        return { segments, color, alpha: 1, lineWidth: depth === 0 ? 2.5 : depth === 1 ? 1.5 : 0.8 };
    }

    // ── Spawn a strike ──
    function spawnStrike() {
        const startX = Math.random() * width;
        const startY = 0;
        // Angle mostly downward with some variance
        const angle = Math.PI / 2 + (Math.random() - 0.5) * 0.6;
        const bolt = createBolt(startX, startY, angle, 0);
        bolt.birth = performance.now();
        bolt.lifetime = Math.random() * 300 + 150; // ms visible
        bolts.push(bolt);

        // Screen flash
        flashAlpha = 0.08 + Math.random() * 0.06;
        flashColor = bolt.color;

        // Thunder rumble with slight delay (light travels faster than sound)
        const thunderDelay = 100 + Math.random() * 300;
        setTimeout(playThunder, thunderDelay);

        // Sometimes double-strike
        if (Math.random() < 0.3) {
            setTimeout(() => {
                const bolt2 = createBolt(startX + (Math.random() - 0.5) * 40, 0, angle + (Math.random() - 0.5) * 0.3, 0);
                bolt2.birth = performance.now();
                bolt2.lifetime = Math.random() * 200 + 100;
                bolts.push(bolt2);
                flashAlpha = 0.06;
            }, 60 + Math.random() * 80);
        }
    }

    // ── Schedule random strikes ──
    function scheduleNext() {
        const delay = Math.random() * 3500 + 1500; // 1.5–5s
        setTimeout(() => {
            spawnStrike();
            scheduleNext();
        }, delay);
    }
    // Kick off first bolt quickly
    setTimeout(spawnStrike, 600);
    scheduleNext();

    // ── Click to trigger a bolt at cursor ──
    canvas.style.pointerEvents = 'none';
    window.addEventListener('click', (e) => {
        const angle = Math.PI / 2 + (Math.random() - 0.5) * 0.8;
        const bolt = createBolt(e.clientX, 0, angle, 0);
        bolt.birth = performance.now();
        bolt.lifetime = 250;
        bolts.push(bolt);
        flashAlpha = 0.07;
        flashColor = bolt.color;
        setTimeout(playThunder, 50);
    });

    // ── Draw loop ──
    function animate(now) {
        ctx.clearRect(0, 0, width, height);

        // Draw rain (drops + splashes)
        drawDrops(now);

        // Screen flash overlay
        if (flashAlpha > 0.001) {
            ctx.fillStyle = flashColor;
            ctx.globalAlpha = flashAlpha;
            ctx.fillRect(0, 0, width, height);
            ctx.globalAlpha = 1;
            flashAlpha *= 0.88; // fade out
        }

        // Draw & cull bolts
        bolts = bolts.filter(bolt => {
            const age = now - bolt.birth;
            if (age > bolt.lifetime) return false;

            const progress = age / bolt.lifetime;
            const alpha = 1 - progress;

            // Glow layer
            ctx.save();
            ctx.strokeStyle = bolt.color;
            ctx.lineWidth = bolt.lineWidth + 4;
            ctx.globalAlpha = alpha * 0.15;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.shadowColor = bolt.color;
            ctx.shadowBlur = 20;
            ctx.beginPath();
            bolt.segments.forEach(s => {
                ctx.moveTo(s.x1, s.y1);
                ctx.lineTo(s.x2, s.y2);
            });
            ctx.stroke();
            ctx.restore();

            // Core bolt
            ctx.save();
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = bolt.lineWidth;
            ctx.globalAlpha = alpha * 0.7;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.shadowColor = bolt.color;
            ctx.shadowBlur = 12;
            ctx.beginPath();
            bolt.segments.forEach(s => {
                ctx.moveTo(s.x1, s.y1);
                ctx.lineTo(s.x2, s.y2);
            });
            ctx.stroke();
            ctx.restore();

            return true;
        });

        requestAnimationFrame(animate);
    }

    // ── Contact form handling ──
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nameEl = document.getElementById('name');
            const emailEl = document.getElementById('email');
            const subjectEl = document.getElementById('subject');
            const messageEl = document.getElementById('message');
            const statusEl = document.getElementById('contact-status');

            const name = nameEl.value.trim();
            const email = emailEl.value.trim();
            const subject = subjectEl.value.trim();
            const message = messageEl.value.trim();

            // Basic validation
            if (!name || !email || !subject || !message) {
                statusEl.textContent = 'Please fill in all fields.';
                return;
            }
            const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRe.test(email)) {
                statusEl.textContent = 'Please enter a valid email address.';
                return;
            }

            // Build mailto fallback
            const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
            const mailto = `mailto:hello@interlaced-pixel.com?subject=${encodeURIComponent(subject)}&body=${body}`;

            // Store a copy locally
            try { localStorage.setItem('lastContact', JSON.stringify({ name, email, subject, message, time: Date.now() })); } catch (err) { /* ignore */ }

            statusEl.textContent = 'Opening mail client — if nothing happens, copy the message below.';

            // Try to open mail client
            window.location.href = mailto;

            // Open success modal with copy area
            openContactModal(subject, decodeURIComponent(body));
            statusEl.textContent = 'Opening mail client — modal ready for copying if needed.';
        });
    }

    // ── Puddle ripples (per-card canvas) ──
    const puddleCanvases = [];

    function initPuddles() {
        console.log('[puddles] initPuddles start');
        puddleCanvases.length = 0;
        const canvases = document.querySelectorAll('.puddle-canvas');
        console.log('[puddles] found canvases:', canvases.length);

        canvases.forEach((canvas, idx) => {
            const container = canvas.parentElement;
            if (!container) return;
            const ctx = canvas.getContext('2d');
            const obj = { container, canvas, ctx, ripples: [] };

            function resizeCanvas() {
                const dpr = window.devicePixelRatio || 1;
                const w = Math.max(2, Math.floor(container.clientWidth));
                const h = Math.max(2, Math.floor(container.clientHeight));
                canvas.width = w * dpr;
                canvas.height = h * dpr;
                canvas.style.width = w + 'px';
                canvas.style.height = h + 'px';
                ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            }

            resizeCanvas();

            container.addEventListener('click', (e) => {
                const rect = container.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const maxR = Math.max(rect.width, rect.height) * 0.85;

                // derive color: for cards check .card-icon, for modal default
                let hex = '#4A90D9';
                const icon = container.querySelector('.card-icon');
                if (icon) {
                    if (icon.classList.contains('yellow')) hex = '#F5C542';
                    if (icon.classList.contains('pink')) hex = '#E86B8A';
                } else if (container.classList.contains('modal-panel')) {
                    hex = '#4A90D9';
                }

                console.log(`[puddles] click on canvas ${idx} at`, x, y, 'color', hex);
                obj.ripples.push({ x, y, r: 0, maxR, t: performance.now(), duration: 700 + Math.random() * 400, colorHex: hex });
            });

            const ro = new ResizeObserver(resizeCanvas);
            ro.observe(container);

            puddleCanvases.push(obj);
        });

        // quick test ripple on first canvas
        if (puddleCanvases[0]) {
            const c = puddleCanvases[0];
            const rect = c.container.getBoundingClientRect();
            const x = rect.width * 0.5;
            const y = rect.height * 0.5;
            c.ripples.push({ x, y, r: 0, maxR: Math.max(rect.width, rect.height) * 0.6, t: performance.now(), duration: 900, colorHex: '#4A90D9' });
            console.log('[puddles] spawned test ripple on canvas 0');
        }

        console.log('[puddles] initPuddles done');
    }

    function drawPuddles(now) {
        puddleCanvases.forEach(obj => {
            const { canvas, ctx, ripples } = obj;
            const w = canvas.width / (window.devicePixelRatio || 1);
            const h = canvas.height / (window.devicePixelRatio || 1);
            ctx.clearRect(0, 0, w, h);

            for (let i = ripples.length - 1; i >= 0; i--) {
                const r = ripples[i];
                const elapsed = now - r.t;
                const progress = Math.min(1, elapsed / r.duration);
                const radius = r.maxR * easeOutCubic(progress);
                const alpha = 1 - progress;

                // draw faint glow
                ctx.save();
                ctx.beginPath();
                ctx.arc(r.x, r.y, radius * 0.9, 0, Math.PI * 2);
                ctx.strokeStyle = hexToRgba(r.colorHex, alpha * 0.14);
                ctx.lineWidth = 6 * (1 - progress) + 1;
                ctx.stroke();
                ctx.restore();

                // draw core ripple ring
                ctx.save();
                ctx.beginPath();
                ctx.arc(r.x, r.y, radius, 0, Math.PI * 2);
                ctx.strokeStyle = hexToRgba(r.colorHex, alpha * 0.9);
                ctx.lineWidth = 2.2 * (1 - progress) + 0.8;
                ctx.globalCompositeOperation = 'lighter';
                ctx.stroke();
                ctx.restore();

                if (progress >= 1) ripples.splice(i, 1);
            }
        });
    }

    function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

    // init puddles now and on resize
    initPuddles();
    window.addEventListener('resize', initPuddles);

    // ── Modal helpers ──
    const modalEl = document.getElementById('contact-modal');
    const copyBtn = modalEl ? document.getElementById('contact-copy-btn') : null;
    const closeBtn = modalEl ? document.getElementById('contact-modal-close') : null;
    const copyArea = modalEl ? document.getElementById('contact-copy') : null;
    let lastFocused = null;

    function openContactModal(subject, fullMessage) {
        if (!modalEl) return;
        lastFocused = document.activeElement;
        copyArea.value = `Subject: ${subject}\n\n${fullMessage}`;
        modalEl.setAttribute('aria-hidden', 'false');
        copyBtn.focus();
        document.addEventListener('keydown', onModalKey);
    }

    function closeContactModal() {
        if (!modalEl) return;
        modalEl.setAttribute('aria-hidden', 'true');
        document.removeEventListener('keydown', onModalKey);
        if (lastFocused) lastFocused.focus();
    }

    function onModalKey(e) {
        if (e.key === 'Escape') {
            closeContactModal();
        }
    }

    if (copyBtn) {
        copyBtn.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(copyArea.value);
                copyBtn.textContent = 'Copied!';
                setTimeout(() => { copyBtn.textContent = 'Copy'; }, 1200);
            } catch (err) {
                // fallback: select contents to help user
                copyArea.select();
            }
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => closeContactModal());
        modalEl.querySelector('.modal-overlay').addEventListener('click', () => closeContactModal());
    }

    // ── Reading Progress Bar ──
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) {
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            progressBar.style.width = scrollPercent + '%';
        }, { passive: true });
    }

    // ── Dynamic Back to Top Button ──
    // ── Circular Scroll Progress ──
    const progressPath = document.querySelector('.progress-wrap path');
    const pathLength = progressPath ? progressPath.getTotalLength() : 0;

    if (progressPath) {
        progressPath.style.transition = progressPath.style.WebkitTransition = 'none';
        progressPath.style.strokeDasharray = pathLength + ' ' + pathLength;
        progressPath.style.strokeDashoffset = pathLength;
        progressPath.getBoundingClientRect();
        progressPath.style.transition = progressPath.style.WebkitTransition = 'stroke-dashoffset 10ms linear';

        const updateProgress = function () {
            const scroll = window.scrollY || window.pageYOffset;
            const height = document.documentElement.scrollHeight - window.innerHeight;
            const progress = pathLength - (scroll * pathLength / height);
            progressPath.style.strokeDashoffset = progress;
        }

        updateProgress();
        window.addEventListener('scroll', updateProgress);

        const offset = 50;
        const duration = 550;

        window.addEventListener('scroll', function() {
            if (window.scrollY > offset) {
                document.querySelector('.progress-wrap').classList.add('active-progress');
            } else {
                document.querySelector('.progress-wrap').classList.remove('active-progress');
            }
        });

        document.querySelector('.progress-wrap').addEventListener('click', function(event) {
            event.preventDefault();
            window.scrollTo({top: 0, behavior: 'smooth'});
            return false;
        });
    }

    // ── Interactive Terminal Demo ──
    const terminalOutput = document.getElementById('terminal-output');
    if (terminalOutput) {
        const commands = [
            { cmd: 'socks-proxy --port 1080', output: 'Starting SOCKS5 server on 0.0.0.0:1080...\n[INFO] Server listening. Ready for connections.' },
            { cmd: 'curl --socks5 127.0.0.1:1080 https://checkip.amazonaws.com', output: '192.168.1.42' },
            { cmd: 'cat ~/.config/interlaced/config.json', output: '{\n  "theme": "dark",\n  "analytics": false,\n  "updates": "auto"\n}' },
        ];
        
        let cmdIndex = 0;
        let charIndex = 0;
        let isTyping = true;
        
        function typeTerminal() {
            if (cmdIndex >= commands.length) {
                cmdIndex = 0; // Loop
                terminalOutput.innerHTML = '';
            }
            
            const currentLine = commands[cmdIndex];
            const promptSpan = '<span class="prompt">➜  ~</span>';
            
            if (isTyping) {
                if (charIndex < currentLine.cmd.length) {
                    const currentCmd = currentLine.cmd.substring(0, charIndex + 1);
                    // Update the input line specifically
                    document.querySelector('.terminal-input-line').innerHTML = `${promptSpan} ${currentCmd}<span class="cursor">█</span>`;
                    charIndex++;
                    setTimeout(typeTerminal, 50 + Math.random() * 50);
                } else {
                    isTyping = false;
                    setTimeout(typeTerminal, 500);
                }
            } else {
                // Command finished, show output
                const cmdHtml = `<div>${promptSpan} ${currentLine.cmd}</div>`;
                const outputHtml = `<div style="color: #ccc; margin-bottom: 8px;">${currentLine.output}</div>`;
                terminalOutput.innerHTML += cmdHtml + outputHtml;
                
                // Reset input line
                document.querySelector('.terminal-input-line').innerHTML = `${promptSpan} <span class="cursor">█</span>`;
                
                cmdIndex++;
                charIndex = 0;
                isTyping = true;
                setTimeout(typeTerminal, 1500);
            }
        }
        
        // Start typing loop
        setTimeout(typeTerminal, 1000);
    }
    // ── Code Block Copy Button ──
    document.querySelectorAll('pre.highlight').forEach(pre => {
        // Wrap for positioning
        const wrapper = document.createElement('div');
        wrapper.className = 'code-wrapper';
        pre.parentNode.insertBefore(wrapper, pre);
        wrapper.appendChild(pre);

        const btn = document.createElement('button');
        btn.className = 'copy-code-btn';
        btn.textContent = 'Copy';
        wrapper.appendChild(btn);

        btn.addEventListener('click', () => {
            const code = pre.querySelector('code') ? pre.querySelector('code').innerText : pre.innerText;
            navigator.clipboard.writeText(code).then(() => {
                const originalText = btn.textContent;
                btn.textContent = 'Copied!';
                setTimeout(() => {
                    btn.textContent = originalText;
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy: ', err);
            });
        });
    });

    // ── Typewriter Effect ──
    const textElement = document.querySelector('.word-2');
    if (textElement) {
        const words = ["Performance", "Efficiency", "Speed", "Reliability"];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 100;

        function type() {
            const currentWord = words[wordIndex % words.length];
            
            if (isDeleting) {
                textElement.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 50;
            } else {
                textElement.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 150;
            }

            if (!isDeleting && charIndex === currentWord.length) {
                isDeleting = true;
                typeSpeed = 2000;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex++;
                typeSpeed = 500;
            }

            setTimeout(type, typeSpeed);
        }
        
        // Start typing if element exists and has content
        if(textElement.textContent) setTimeout(type, 1000);
    }

    // ── 3D Tilt Effect ──
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });

    // ── Button Ripple Effect ──
    document.querySelectorAll('.pid-btn, .topbar-btn, .card-link').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const circle = document.createElement('span');
            circle.classList.add('ripple');
            circle.style.left = x + 'px';
            circle.style.top = y + 'px';
            
            this.appendChild(circle);
            
            setTimeout(() => circle.remove(), 600);
        });
    });

    // ── Toast System ──
    window.showToast = function(message, type = 'success') {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            document.body.appendChild(container);
        }
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `<span class="material-icons-outlined">${type === 'success' ? 'check_circle' : 'error'}</span><span>${message}</span>`;
        container.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 100);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    };

    // ── Keyboard Shortucts ──
    document.addEventListener('keydown', (e) => {
        // Toggle Theme with 'T'
        if (e.key.toLowerCase() === 't' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
            const toggle = document.querySelector('.theme-toggle');
            if (toggle) toggle.click();
            const theme = document.documentElement.getAttribute('data-theme');
            showToast(`Switched to ${theme === 'dark' ? 'Dark' : 'Light'} Mode`);
        }
        
        // Help Modal with '?' (Shift + /)
        if (e.key === '?' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
             showToast('Shortcuts: T (Theme), ? (Help)', 'info');
        }
    });

    // ── Service Worker Registration ──
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js').then(registration => {
                console.log('SW registered: ', registration);
            }).catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
        });
    }

    // ── Blog Search ──
    const searchInput = document.getElementById('blog-search-input');
    const postList = document.querySelector('.post-list');
    
    if (searchInput && postList) {
        let posts = [];
        fetch('/search.json').then(res => res.json()).then(data => posts = data);
            
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const filtered = posts.filter(post => 
                post.title.toLowerCase().includes(term) || 
                post.excerpt.toLowerCase().includes(term)
            );
            renderPosts(filtered);
        });
        
        function renderPosts(items) {
            postList.innerHTML = items.map(post => `
                <li>
                    <div class="post-card">
                        <span class="post-meta">${post.date}</span>
                        <h2><a class="post-link" href="${post.url}">${post.title}</a></h2>
                        <div class="post-excerpt">${post.excerpt}</div>
                        <br>
                        <a class="btn" href="${post.url}">Read More</a>
                    </div>
                </li>
            `).join('');
            if (items.length === 0) postList.innerHTML = '<p class="text-center muted">No posts found.</p>';
        }
    }

    // ── Lightbox for Blog Images ──
    document.querySelectorAll('.post-content img').forEach(img => {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', () => {
            const lightbox = document.createElement('div');
            lightbox.id = 'lightbox';
            lightbox.style.cssText = `
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(0,0,0,0.9); display: flex; align-items: center;
                justify-content: center; z-index: 2000; cursor: zoom-out;
                opacity: 0; transition: opacity 0.3s ease;
            `;
            
            const imgClone = document.createElement('img');
            imgClone.src = img.src;
            imgClone.style.cssText = `max-width: 90%; max-height: 90%; border-radius: 8px; box-shadow: 0 0 20px rgba(0,0,0,0.5); transform: scale(0.9); transition: transform 0.3s ease;`;
            
            lightbox.appendChild(imgClone);
            document.body.appendChild(lightbox);
            
            // Trigger animation
            requestAnimationFrame(() => {
                lightbox.style.opacity = '1';
                imgClone.style.transform = 'scale(1)';
            });
            
            lightbox.addEventListener('click', () => {
                lightbox.style.opacity = '0';
                imgClone.style.transform = 'scale(0.9)';
                setTimeout(() => lightbox.remove(), 300);
            });
        });
    });

    // ── Cookie Consent ──
    if (!localStorage.getItem('cookieConsent')) {
        const banner = document.createElement('div');
        banner.className = 'cookie-banner';
        banner.style.cssText = `
            position: fixed; bottom: 20px; left: 20px; max-width: 350px;
            background: var(--surface); border: 1px solid var(--border);
            padding: 16px; border-radius: 8px; z-index: 1500;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            display: flex; flex-direction: column; gap: 12px;
            transform: translateY(100px); opacity: 0; transition: all 0.5s ease;
        `;
        banner.innerHTML = `
            <p style="margin: 0; font-size: 14px;">We use cookies to improve your experience. By using our site, you agree to our policies.</p>
            <div style="display: flex; gap: 8px;">
                <button id="acceptCookies" class="pid-btn pid-btn-primary" style="padding: 6px 12px; font-size: 12px;">Accept</button>
                <button id="closeCookies" class="pid-btn pid-btn-secondary" style="padding: 6px 12px; font-size: 12px;">Ignore</button>
            </div>
        `;
        document.body.appendChild(banner);
        
        requestAnimationFrame(() => {
            banner.style.transform = 'translateY(0)';
            banner.style.opacity = '1';
        });

        const closeBanner = () => {
            banner.style.transform = 'translateY(20px)';
            banner.style.opacity = '0';
            setTimeout(() => banner.remove(), 500);
        };

        document.getElementById('acceptCookies').onclick = () => {
            localStorage.setItem('cookieConsent', 'true');
            showToast('Cookies accepted!');
            closeBanner();
        };
        
        document.getElementById('closeCookies').onclick = closeBanner;
    }


    requestAnimationFrame(animate);
});
