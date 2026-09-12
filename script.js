// ── Hamburger menu ──────────────────────────────────────────────────────────
function toggleMenu() {
  document.querySelector(".menu-links").classList.toggle("open");
  document.querySelector(".hamburger-icon").classList.toggle("open");
}

document.addEventListener("click", (e) => {
  const nav = document.getElementById("hamburger-nav");
  if (nav && !nav.contains(e.target)) {
    document.querySelector(".menu-links")?.classList.remove("open");
    document.querySelector(".hamburger-icon")?.classList.remove("open");
  }
});

// ── Theme toggle ─────────────────────────────────────────────────────────────
const body = document.body;
const themeBtn = document.getElementById("theme-toggle");
const themeBtnMobile = document.getElementById("theme-toggle-mobile");

function setTheme(dark) {
  body.classList.toggle("dark-mode", dark);
  if (themeBtn) themeBtn.textContent = dark ? "☀️ Light Mode" : "🌙 Dark Mode";
  if (themeBtnMobile) themeBtnMobile.textContent = dark ? "☀️" : "🌙";
  localStorage.setItem("theme", dark ? "dark" : "light");
}

// Default to dark mode unless user explicitly chose light
const savedTheme = localStorage.getItem("theme");
setTheme(savedTheme !== "light");

themeBtn?.addEventListener("click", () => setTheme(!body.classList.contains("dark-mode")));
themeBtnMobile?.addEventListener("click", () => setTheme(!body.classList.contains("dark-mode")));

// ── Scroll progress bar ──────────────────────────────────────────────────────
const progressBar = document.getElementById("scroll-progress");
window.addEventListener("scroll", () => {
  const scrolled = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
  if (progressBar) progressBar.style.width = (scrolled * 100) + "%";
}, { passive: true });

// ── Web Audio – soft chime ────────────────────────────────────────────────────
let audioCtx = null;
let isMuted = localStorage.getItem("soundMuted") === "true";
let audioUnlocked = false;

const soundBtn = document.getElementById("sound-toggle");
if (soundBtn) {
  soundBtn.textContent = isMuted ? "🔇" : "🔊";
  soundBtn.addEventListener("click", () => {
    isMuted = !isMuted;
    soundBtn.textContent = isMuted ? "🔇" : "🔊";
    localStorage.setItem("soundMuted", isMuted);
  });
}

function unlockAudio() {
  if (audioUnlocked) return;
  audioUnlocked = true;
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}
document.addEventListener("click", unlockAudio, { once: true });
document.addEventListener("keydown", unlockAudio, { once: true });

function playChime(freq, duration = 0.7, vol = 0.1) {
  if (isMuted || !audioCtx) return;
  if (audioCtx.state === "suspended") audioCtx.resume();

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  const osc2 = audioCtx.createOscillator(); // overtone
  const gain2 = audioCtx.createGain();

  osc.connect(gain); gain.connect(audioCtx.destination);
  osc2.connect(gain2); gain2.connect(audioCtx.destination);

  osc.type = "sine";
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

  osc2.type = "sine";
  osc2.frequency.setValueAtTime(freq * 2, audioCtx.currentTime); // octave overtone

  gain.gain.setValueAtTime(0, audioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(vol, audioCtx.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

  gain2.gain.setValueAtTime(0, audioCtx.currentTime);
  gain2.gain.linearRampToValueAtTime(vol * 0.3, audioCtx.currentTime + 0.02);
  gain2.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration * 0.6);

  osc.start(); osc.stop(audioCtx.currentTime + duration);
  osc2.start(); osc2.stop(audioCtx.currentTime + duration);
}

// Section → note frequency (pentatonic-ish chord tones)
const sectionNotes = {
  about:      523.25,  // C5
  experience: 659.25,  // E5
  projects:   783.99,  // G5
  contact:    1046.50, // C6
};

// ── Scroll reveal ─────────────────────────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("active");

    const id = entry.target.id;
    if (sectionNotes[id]) setTimeout(() => playChime(sectionNotes[id]), 120);

    // Stagger child items
    const items = entry.target.querySelectorAll(".stagger-item");
    items.forEach((item, i) => {
      setTimeout(() => item.classList.add("visible"), i * 110);
    });

    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

// ── Typing animation ──────────────────────────────────────────────────────────
const roles = ["Frontend Developer", "React Specialist", "Problem Solver"];
let roleIdx = 0, charIdx = 0, deleting = false;
const typingEl = document.querySelector(".typing-text");

function type() {
  if (!typingEl) return;
  const current = roles[roleIdx];

  if (deleting) {
    typingEl.textContent = current.substring(0, charIdx - 1);
    charIdx--;
  } else {
    typingEl.textContent = current.substring(0, charIdx + 1);
    charIdx++;
  }

  if (!deleting && charIdx === current.length) {
    setTimeout(() => { deleting = true; }, 2200);
  } else if (deleting && charIdx === 0) {
    deleting = false;
    roleIdx = (roleIdx + 1) % roles.length;
  }

  setTimeout(type, deleting ? 55 : 100);
}

type();

// ── 3D card tilt on hover ─────────────────────────────────────────────────────
document.querySelectorAll(".details-container").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(700px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-8px)`;
    card.style.transition = "transform 0.05s ease";
  });

  card.addEventListener("mouseleave", () => {
    card.style.transition = "transform 0.4s ease, box-shadow 0.3s ease";
    card.style.transform = "";
  });
});
