document.addEventListener("DOMContentLoaded", () => {
  const pages = document.querySelectorAll(".page");
  const nextButtons = document.querySelectorAll("[data-next]");
  const noBtn = document.getElementById("no-btn");
  const yesBtn = document.getElementById("yes-btn");
  const questionSection = document.querySelector('[data-page="question"]');
  const confettiContainer = document.getElementById("confetti-container");
  const floatingHearts = document.querySelector(".floating-hearts");
  const bgMusic = document.getElementById("bg-music");
  const musicToggle = document.getElementById("music-toggle");
  let musicStarted = false;
  let fadeInterval = null;
  let confettiStarted = false;

  // Navigation handler
  const showPage = (name) => {
    pages.forEach((page) => {
      const active = page.dataset.page === name;
      page.classList.toggle("show", active);
      page.style.display = active ? "block" : "none";
    });
    if (name === "celebrate" && !confettiStarted) {
      startConfetti();
      confettiStarted = true;
    }
  };

  nextButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Start music only once, on the very first interaction (Start button)
      if (!musicStarted && btn.dataset.next === "message") {
        startMusic();
      }
      const target = btn.dataset.next;
      if (target) showPage(target);
    });
  });

  // Shy NO button logic
  if (noBtn && questionSection) {
    const moveButton = () => {
      const area = questionSection.getBoundingClientRect();
      const btnRect = noBtn.getBoundingClientRect();
      const maxX = area.width - btnRect.width - 16;
      const maxY = area.height - btnRect.height - 16;
      const randX = Math.random() * maxX - maxX / 2;
      const randY = Math.random() * maxY / 1.2; // keep vertically reasonable
      noBtn.style.transform = `translate(${randX}px, ${randY}px)`;
    };

    questionSection.addEventListener("mousemove", (e) => {
      const btnRect = noBtn.getBoundingClientRect();
      const dist = Math.hypot(
        e.clientX - (btnRect.left + btnRect.width / 2),
        e.clientY - (btnRect.top + btnRect.height / 2)
      );
      if (dist < 140) moveButton();
    });

    // Touch support
    noBtn.addEventListener("touchstart", (e) => {
      e.preventDefault();
      moveButton();
    });
  }

  // Confetti generator
  const startConfetti = () => {
    const colors = ["#ff6f91", "#ff9a9e", "#ffd166", "#9dd9d2", "#f8c8dc"];
    const pieces = 120;
    for (let i = 0; i < pieces; i++) {
      const piece = document.createElement("div");
      piece.className = "confetti";
      piece.style.left = Math.random() * 100 + "%";
      piece.style.background = colors[i % colors.length];
      piece.style.animationDelay = Math.random() * 2 + "s";
      piece.style.animationDuration = 3 + Math.random() * 2 + "s";
      piece.style.opacity = 0.9;
      confettiContainer.appendChild(piece);
    }
  };

  // Floating hearts in the background
  const spawnHearts = (count = 18) => {
    if (!floatingHearts) return;
    for (let i = 0; i < count; i++) {
      const h = document.createElement("div");
      h.className = "heart";
      h.style.left = Math.random() * 100 + "%";
      h.style.top = Math.random() * 100 + "%";
      h.style.opacity = 0.4 + Math.random() * 0.4;
      h.style.transform = `rotate(45deg) scale(${0.8 + Math.random() * 0.8})`;
      h.style.animationDuration = 8 + Math.random() * 6 + "s";
      h.style.animationDelay = Math.random() * 6 + "s";
      floatingHearts.appendChild(h);
    }
  };

  spawnHearts();

  // Start at intro
  showPage("intro");

  /* ---- Music controls ---- */
  function startMusic() {
    if (!bgMusic) return;
    musicStarted = true;
    bgMusic.volume = 0; // start silent, fade up
    bgMusic.muted = false;
    bgMusic.play().catch(() => {
      // If play is blocked, keep toggle visible for manual start
    });
    smoothFadeTo(0.45, 1200);
    updateMusicIcon();
  }

  function smoothFadeTo(targetVolume, duration = 1000) {
    if (!bgMusic) return;
    const start = bgMusic.volume;
    const delta = targetVolume - start;
    const startTime = performance.now();
    if (fadeInterval) cancelAnimationFrame(fadeInterval);

    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      bgMusic.volume = start + delta * progress;
      if (progress < 1) {
        fadeInterval = requestAnimationFrame(step);
      }
    };
    fadeInterval = requestAnimationFrame(step);
  }

  function toggleMusic() {
    if (!bgMusic) return;
    bgMusic.muted = !bgMusic.muted;
    updateMusicIcon();
    if (!bgMusic.paused && !bgMusic.muted && bgMusic.volume < 0.4) {
      smoothFadeTo(0.45, 600);
    }
  }

  function updateMusicIcon() {
    if (!musicToggle) return;
    musicToggle.textContent = bgMusic && !bgMusic.muted ? "🔊" : "🔇";
  }

  if (musicToggle) {
    musicToggle.addEventListener("click", () => {
      if (!musicStarted) {
        startMusic();
      } else {
        toggleMusic();
      }
    });
  }
});
