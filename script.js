/* ============================================
   FASYA'S BIRTHDAY — script.js
   ============================================ */

/* ──────────────────────────────────────────
   CONFIG — ubah sesuai kebutuhan
────────────────────────────────────────── */
const BIRTHDAY = { month: 6, day: 5, year: 2026 }; // Juni = 6, 5 Juni 2026

/* ──────────────────────────────────────────
   UTILITIES
────────────────────────────────────────── */
const $ = id => document.getElementById(id);
const pad = n => String(n).padStart(2, '0');

function showSection(fromId, toId) {
  const from = $(fromId);
  const to   = $(toId);
  from.classList.remove('active');
  from.classList.add('exit');
  setTimeout(() => {
    from.classList.remove('exit');
    from.classList.add('hidden');
    to.classList.remove('hidden');
    requestAnimationFrame(() => {
      to.classList.add('active');
    });
  }, 500);
}

/* ──────────────────────────────────────────
   1. PETALS — falling rose petals
────────────────────────────────────────── */
(function spawnPetals() {
  const container = $('petalsContainer');
  const emojis = ['🌸', '🌹', '💮', '🪷', '✿', '❀'];
  for (let i = 0; i < 22; i++) {
    const p = document.createElement('div');
    p.className = 'petal';
    p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    p.style.left = `${Math.random() * 100}vw`;
    p.style.fontSize = `${0.7 + Math.random() * 1}rem`;
    p.style.opacity = `${0.3 + Math.random() * 0.5}`;
    p.style.animationDuration = `${5 + Math.random() * 9}s`;
    p.style.animationDelay = `-${Math.random() * 12}s`;
    container.appendChild(p);
  }
})();

/* ──────────────────────────────────────────
   2. STARS — in birthday section
────────────────────────────────────────── */
(function spawnStars() {
  const c = $('starsContainer');
  for (let i = 0; i < 40; i++) {
    const s = document.createElement('div');
    s.className = 'star';
    const size = 1.5 + Math.random() * 3;
    s.style.cssText = `
      width:${size}px; height:${size}px;
      top:${Math.random()*100}%;
      left:${Math.random()*100}%;
      animation-duration:${1.5+Math.random()*3}s;
      animation-delay:${Math.random()*3}s;
    `;
    c.appendChild(s);
  }
})();

/* ──────────────────────────────────────────
   3. COUNTDOWN vs BIRTHDAY CHECK
────────────────────────────────────────── */
function isBirthdayToday() {
  const now = new Date();
  return now.getMonth() + 1 === BIRTHDAY.month && now.getDate() === BIRTHDAY.day && now.getFullYear() === BIRTHDAY.year;
}

function hasBirthdayPassed() {
  const now = new Date();
  const eventDate = new Date(BIRTHDAY.year, BIRTHDAY.month - 1, BIRTHDAY.day, 23, 59, 59);
  return now > eventDate;
}

function getNextBirthday() {
  const now = new Date();
  let year = now.getFullYear();
  const bday = new Date(year, BIRTHDAY.month - 1, BIRTHDAY.day, 0, 0, 0);
  if (now >= bday) bday.setFullYear(year + 1);
  return bday;
}

function updateCountdownNote() {
  const note = $('countdownNote');
  if (!note) return;
  const nextBirthday = getNextBirthday();
  note.textContent = `${BIRTHDAY.day} Juni ${nextBirthday.getFullYear()} · Hari yang paling indah`;
}

function updateCountdown() {
  const diff = getNextBirthday() - new Date();
  if (diff <= 0) return;
  const days    = Math.floor(diff / 86400000);
  const hours   = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  $('cd-days').textContent    = pad(days);
  $('cd-hours').textContent   = pad(hours);
  $('cd-minutes').textContent = pad(minutes);
  $('cd-seconds').textContent = pad(seconds);
}

function init() {
  updateCountdownNote();

  if (isBirthdayToday() || hasBirthdayPassed()) {
    // Langsung ke section ulang tahun pada tanggal ulang tahun asli atau setelahnya
    $('countdownSection').classList.remove('active');
    $('countdownSection').classList.add('hidden');
    $('birthdaySection').classList.remove('hidden');
    $('birthdaySection').classList.add('active');
  } else {
    // Tampilkan countdown untuk event yang belum tiba
    $('countdownSection').classList.add('active');
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }
}
init();

/* ──────────────────────────────────────────
   4. SWIPE BUTTON — geser ke section kue
────────────────────────────────────────── */
(function initSwipe() {
  const track = $('swipeTrack');
  const thumb = $('swipeThumb');
  const label = $('swipeLabel');
  let dragging = false, startX = 0, currentX = 0;
  const MAX = () => track.offsetWidth - thumb.offsetWidth - 8;

  function onStart(e) {
    dragging = true;
    startX = (e.touches ? e.touches[0].clientX : e.clientX) - currentX;
    thumb.style.transition = 'none';
  }
  function onMove(e) {
    if (!dragging) return;
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - startX;
    const clamped = Math.max(0, Math.min(x, MAX()));
    currentX = clamped;
    thumb.style.left = (4 + clamped) + 'px';
    const ratio = clamped / MAX();
    label.style.opacity = 1 - ratio;
    if (ratio >= 0.92) triggerCakeSection();
  }
  function onEnd() {
    if (!dragging) return;
    dragging = false;
    thumb.style.transition = 'left 0.3s ease';
    if (currentX / MAX() < 0.92) {
      currentX = 0;
      thumb.style.left = '4px';
      label.style.opacity = 1;
    }
  }

  thumb.addEventListener('mousedown',  onStart);
  thumb.addEventListener('touchstart', onStart, { passive: true });
  window.addEventListener('mousemove',  onMove);
  window.addEventListener('touchmove',  onMove, { passive: true });
  window.addEventListener('mouseup',   onEnd);
  window.addEventListener('touchend',  onEnd);
})();

function triggerCakeSection() {
  showSection('birthdaySection', 'cakeSection');
}

/* ──────────────────────────────────────────
   5. CANDLES — blow to extinguish
────────────────────────────────────────── */
let candlesOut = 0;
const totalCandles = 3;
let blownOut = false;

function blowOutNextCandle() {
  if (blownOut) return;
  const flames = ['flame1', 'flame2', 'flame3'];
  if (candlesOut < totalCandles) {
    $(flames[candlesOut]).classList.add('out');
    candlesOut++;
    if (candlesOut === totalCandles) {
      blownOut = true;
      setTimeout(showBirthdayPopup, 700);
    }
  }
}

/* Manual blow button */
$('manualBlowBtn').addEventListener('click', () => {
  blowOutNextCandle();
});

/* Mic / audio detection */
$('micBtn').addEventListener('click', startListening);

let audioCtx = null;
let analyser = null;
let micStream = null;
let listening = false;

function startListening() {
  if (blownOut) return;
  if (listening) { stopListening(); return; }

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    $('blowHint').textContent = 'Browser tidak mendukung mic. Tiup manual saja ya! 🎂';
    return;
  }

  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      micStream = stream;
      audioCtx  = new (window.AudioContext || window.webkitAudioContext)();
      analyser  = audioCtx.createAnalyser();
      analyser.fftSize = 512;
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      listening = true;
      $('micBtn').classList.add('listening');
      $('micLabel').textContent = 'Sedang mendengar...';
      $('blowHint').textContent = 'Tiup sekarang! 🌬️';

      detectBlow();
    })
    .catch(() => {
      $('blowHint').textContent = 'Akses mic ditolak. Pakai tombol tiup manual! 💨';
    });
}

function stopListening() {
  listening = false;
  $('micBtn').classList.remove('listening');
  $('micLabel').textContent = 'Tahan & Tiup';
  if (micStream) micStream.getTracks().forEach(t => t.stop());
  if (audioCtx)  audioCtx.close();
}

function detectBlow() {
  if (!listening || blownOut) return;
  const data = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(data);
  const avg = data.reduce((s, v) => s + v, 0) / data.length;

  if (avg > 22) {
    blowOutNextCandle();
    if (!blownOut) {
      $('blowHint').textContent = `Terus tiup! (${candlesOut}/${totalCandles} lilin padam) 🕯️`;
    }
  }
  if (!blownOut) requestAnimationFrame(detectBlow);
  else stopListening();
}

/* ──────────────────────────────────────────
   6. POPUP & CONFETTI
────────────────────────────────────────── */
function showBirthdayPopup() {
  const overlay = $('popupOverlay');
  overlay.classList.remove('hidden');
  spawnConfetti();
}

function spawnConfetti() {
  const colors = ['#FCF5EE','#FFC4C4','#EE6983','#850E35','#fff','#ffdd99'];
  const container = $('confettiContainer');
  for (let i = 0; i < 80; i++) {
    const c = document.createElement('div');
    c.className = 'confetti-piece';
    c.style.cssText = `
      left: ${Math.random()*100}vw;
      background: ${colors[Math.floor(Math.random()*colors.length)]};
      width: ${5+Math.random()*8}px;
      height: ${5+Math.random()*8}px;
      border-radius: ${Math.random()>.5?'50%':'2px'};
      animation-duration: ${1.5+Math.random()*2.5}s;
      animation-delay: ${Math.random()*1.5}s;
    `;
    container.appendChild(c);
  }
  // Keep spawning
  setTimeout(spawnConfetti, 3500);
}

$('popupNextBtn').addEventListener('click', () => {
  $('popupOverlay').classList.add('hidden');
  showSection('cakeSection', 'letterSection');
});

/* ──────────────────────────────────────────
   7. PHOTO UPLOAD
────────────────────────────────────────── */
// Photo upload functionality removed - using embedded image instead

/* ──────────────────────────────────────────
   8. GSAP subtle entrance for letter section
────────────────────────────────────────── */
const observer = new MutationObserver(() => {
  if ($('letterSection').classList.contains('active')) {
    if (window.gsap) {
      gsap.from('.letter-paper', { y: 40, opacity: 0, duration: 1, ease: 'power3.out', delay: .3 });
      gsap.from('.photo-frame-wrapper', { scale: .85, opacity: 0, duration: .9, ease: 'back.out(1.4)', delay: .1 });
    }
  }
});
observer.observe($('letterSection'), { attributes: true, attributeFilter: ['class'] });
