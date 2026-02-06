// Interlaced Pixel - Main JS
'use strict';

document.addEventListener('DOMContentLoaded', () => {

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

    // ── Lightning / Thunder background ──
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const BOLT_COLORS = ['#4A90D9', '#F5C542', '#E86B8A']; // blue, yellow, pink
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

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
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

    requestAnimationFrame(animate);
});
