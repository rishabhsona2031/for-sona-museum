const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const pages = $$('.page');
let storyTimer;
let roseRevealTimer;
let galleryAdvanceTimer;
function showPage(id) {
  clearTimeout(storyTimer);
  clearTimeout(roseRevealTimer);
  clearTimeout(galleryAdvanceTimer);
  pages.forEach((page) => page.classList.toggle('active', page.id === id));
  if (id === 'treePage') growHeartTree();
  if (id === 'lovePage') storyTimer = setTimeout(() => showPage('treePage'), 3000);
  if (id === 'treePage') storyTimer = setTimeout(() => showPage('giftPage'), 5000);
  if (id === 'giftPage') storyTimer = setTimeout(() => showPage('rosesPage'), 1800);
  if (id === 'rosesPage') {
    $('.rose-pattern').classList.remove('fade-away');
    $('.rose-message').classList.remove('show');
    roseRevealTimer = window.setTimeout(() => {
      $('.rose-pattern').classList.add('fade-away');
      $('.rose-message').classList.add('show');
    }, 3300);
    storyTimer = setTimeout(() => showPage('memoriesPage'), 6000);
  }
  if (id === 'memoriesPage') storyTimer = setTimeout(() => showPage('doorPage'), 7000);
  if (id === 'galleryRoom') resetScratch();
  if (id === 'puzzleRoom') startPuzzleClock();
  else stopPuzzleClock();
}
$$('[data-go]').forEach((button) => button.addEventListener('click', () => showPage(button.dataset.go)));

// The first scene opens like the reference: tap the glossy heart, then continue.
$('#heartStart').addEventListener('click', () => {
  if (!$('#openMessage').hidden) return;
  $('#heartStart').classList.add('heart-burst');
  $('#openPage').classList.add('revealed');
  $('#openMessage').hidden = false;
  $('#heartStart').setAttribute('aria-label', 'The surprise is open');
  storyTimer = setTimeout(() => showPage('lovePage'), 2500);
});
$('#openGift').addEventListener('click', () => showPage('rosesPage'));

// Small heart-shaped leaves grow onto the tree when that scene appears.
let treeBuilt = false;
function growHeartTree() {
  if (treeBuilt) return;
  treeBuilt = true;
  const canopy = $('.tree-hearts');
  const colors = ['#ec4385', '#f47ca0', '#f2b45c', '#ffcc9d'];
  let count = 0;
  while (count < 190) {
    const x = Math.random() * 2 - 1;
    const y = Math.random() * 2 - 1;
    if ((x*x + y*y - 1) ** 3 - x*x*y*y*y <= 0) {
      const leaf = document.createElement('span');
      leaf.className = 'tree-leaf';
      leaf.textContent = '♥';
      leaf.style.left = `${49 + x * 43}%`;
      leaf.style.top = `${50 - y * 44}%`;
      leaf.style.fontSize = `${15 + Math.random() * 15}px`;
      leaf.style.animationDelay = `${Math.random() * 1.8}s`;
      leaf.style.color = colors[Math.floor(Math.random() * colors.length)];
      canopy.append(leaf);
      count += 1;
    }
  }
  const sky = $('.floating-hearts');
  for (let i = 0; i < 18; i += 1) {
    const heart = document.createElement('span');
    heart.textContent = i % 3 === 0 ? '♥' : '♡';
    heart.style.left = `${(i * 43) % 100}%`;
    heart.style.top = `${(i * 29) % 82}%`;
    heart.style.fontSize = `${12 + (i % 4) * 5}px`;
    heart.style.animationDelay = `${(i % 6) * -.8}s`;
    sky.append(heart);
  }
}

// Keep the three-knock moment as a deliberate interaction.
let knocks = 0;
let knockReset;
function knockOnDoor() {
  knocks += 1;
  $('#museumDoor').classList.remove('knock');
  void $('#museumDoor').offsetWidth;
  $('#museumDoor').classList.add('knock');
  const hearts = ['♥', '♥', '♥'];
  $('#knockCount').textContent = hearts.map((heart, i) => i < knocks ? '♥' : '♡').join('   ');
  clearTimeout(knockReset);
  knockReset = setTimeout(() => { knocks = 0; $('#knockCount').textContent = '♡   ♡   ♡'; }, 1800);
  if (knocks >= 3) {
    clearTimeout(knockReset);
    $('#museumDoor').classList.add('open');
    $('#museumArt').classList.add('open');
    setTimeout(() => { knocks = 0; showPage('galleryRoom'); }, 650);
  }
}
$('#museumDoor').addEventListener('click', knockOnDoor);
// The scratch-off gallery reveals each picture under a soft gold cover.
const galleryPhotos = [
  'photos/temple-together.jpeg',
  'photos/night-by-the-car.jpeg',
  'photos/close-up-smile.jpeg',
  'photos/at-home-red.jpeg',
  'photos/mirror-selfie.jpeg',
  'photos/temple-memory.jpeg',
  'photos/at-home.jpeg',
  'photos/close-up-together.jpeg',
];
let galleryIndex = 0;
let scratchPoints = 0;
let scratchContext;
let galleryRevealed = false;
function resetScratch() {
  clearTimeout(galleryAdvanceTimer);
  galleryRevealed = false;
  const canvas = $('#scratchCover');
  const frame = $('.exhibit-frame');
  const rect = frame.getBoundingClientRect();
  const size = Math.max(1, Math.floor(rect.width - 18));
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = size * ratio;
  canvas.height = size * ratio;
  canvas.style.width = `${size}px`;
  canvas.style.height = `${size}px`;
  canvas.style.inset = '9px';
  scratchContext = canvas.getContext('2d');
  scratchContext.setTransform(ratio, 0, 0, ratio, 0, 0);
  const gradient = scratchContext.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, '#d8c18a'); gradient.addColorStop(.5, '#f1e4c0'); gradient.addColorStop(1, '#ccb06d');
  scratchContext.globalCompositeOperation = 'source-over';
  scratchContext.fillStyle = gradient;
  scratchContext.fillRect(0, 0, size, size);
  scratchContext.fillStyle = '#a38a5a33';
  for (let i = 0; i < 90; i += 1) scratchContext.fillRect(Math.random()*size, Math.random()*size, 2, 2);
  scratchContext.globalCompositeOperation = 'destination-out';
  scratchPoints = 0;
  canvas.classList.remove('revealed');
  $('#scratchHint').classList.remove('scratched');
  const photo = $('#galleryPhoto');
  photo.style.opacity = '0';
  photo.onload = () => { photo.style.opacity = '1'; };
  photo.src = galleryPhotos[galleryIndex];
  if (photo.complete) requestAnimationFrame(() => { photo.style.opacity = '1'; });
  $('#galleryCount').textContent = `${galleryIndex + 1} / 8`;
  $('#exhibitTitle').textContent = ['Temple lights','Our night out','That big smile','At home together','Mirror memories','The temple trip','Our cozy day','Just the two of us'][galleryIndex];
}
function finishScratch() {
  if (galleryRevealed) return;
  galleryRevealed = true;
  const canvas = $('#scratchCover');
  if (scratchContext) {
    scratchContext.setTransform(1, 0, 0, 1, 0, 0);
    scratchContext.clearRect(0, 0, canvas.width, canvas.height);
  }
  canvas.classList.add('revealed');
  $('#scratchHint').classList.add('scratched');
  if (galleryIndex < galleryPhotos.length - 1) {
    galleryAdvanceTimer = setTimeout(() => {
      if (!$('#galleryRoom').classList.contains('active')) return;
      galleryIndex += 1;
      resetScratch();
    }, 3200);
  }
}
let scratching = false;
$('#scratchCover').addEventListener('pointerdown', (event) => { scratching = true; event.currentTarget.setPointerCapture(event.pointerId); scratchAt(event); });
$('#scratchCover').addEventListener('pointermove', (event) => { if (scratching) scratchAt(event); });
$('#scratchCover').addEventListener('pointerup', () => { scratching = false; });
$('#scratchCover').addEventListener('pointercancel', () => { scratching = false; });
function scratchAt(event) {
  if (!scratchContext || galleryRevealed) return;
  const rect = event.currentTarget.getBoundingClientRect();
  scratchContext.beginPath();
  scratchContext.arc(event.clientX - rect.left, event.clientY - rect.top, 22, 0, Math.PI * 2);
  scratchContext.fill();
  scratchPoints += 1;
  if (scratchPoints > 13) $('#scratchHint').classList.add('scratched');
  if (scratchPoints > 30) finishScratch();
}
$('#galleryPrev').addEventListener('click', () => { galleryIndex = (galleryIndex + 7) % 8; resetScratch(); });
$('#galleryNext').addEventListener('click', () => { galleryIndex = (galleryIndex + 1) % 8; resetScratch(); });
window.addEventListener('resize', () => { if ($('#galleryRoom').classList.contains('active')) resetScratch(); });

// Tap/drag tiles to restore the nine-piece photograph.
const puzzleOrder = [3,8,1,6,0,5,2,7,4];
let selectedTile = null;
let moves = 0;
let puzzleSeconds = 0;
let puzzleClock;
let puzzleSolved = false;
const puzzleGrid = $('#puzzleGrid');
const puzzlePhoto = galleryPhotos[2];
function drawPuzzle() {
  puzzleGrid.innerHTML = '';
  puzzleGrid.style.setProperty('--puzzle-photo', `url("${puzzlePhoto}")`);
  puzzleOrder.forEach((piece, slot) => {
    const tile = document.createElement('button');
    tile.className = 'puzzle-piece';
    tile.type = 'button';
    tile.draggable = true;
    tile.dataset.slot = String(slot);
    tile.style.backgroundImage = `url("${puzzlePhoto}")`;
    tile.style.backgroundSize = '300% 300%';
    tile.style.backgroundPosition = `${(piece % 3) * 50}% ${Math.floor(piece / 3) * 50}%`;
    tile.style.animationDelay = `${slot * 18}ms`;
    tile.setAttribute('aria-label', `Photo piece ${piece + 1}`);
    tile.addEventListener('click', () => selectPuzzlePiece(slot));
    tile.addEventListener('dragstart', () => { selectedTile = slot; });
    tile.addEventListener('dragover', (event) => event.preventDefault());
    tile.addEventListener('drop', (event) => { event.preventDefault(); if (selectedTile !== null) swapPuzzlePieces(selectedTile, slot); });
    puzzleGrid.append(tile);
  });
}
function selectPuzzlePiece(slot) {
  const pieces = $$('.puzzle-piece', puzzleGrid);
  if (selectedTile === null) { selectedTile = slot; pieces[slot].classList.add('selected'); return; }
  if (selectedTile === slot) { pieces[slot].classList.remove('selected'); selectedTile = null; return; }
  swapPuzzlePieces(selectedTile, slot);
}
function swapPuzzlePieces(first, second) {
  if (puzzleSolved) return;
  [puzzleOrder[first], puzzleOrder[second]] = [puzzleOrder[second], puzzleOrder[first]];
  selectedTile = null;
  moves += 1;
  $('#movesCount').textContent = String(moves);
  drawPuzzle();
  if (puzzleOrder.every((value, index) => value === index)) {
    puzzleSolved = true;
    stopPuzzleClock();
    $('#puzzleCaption').textContent = `Fixed it in ${moves} moves. I hope you like this little memory. ♥`;
  }
}
drawPuzzle();
function startPuzzleClock() {
  if (puzzleClock || puzzleSolved) return;
  puzzleClock = setInterval(() => { puzzleSeconds += 1; $('#puzzleTime').textContent = `${Math.floor(puzzleSeconds/60)}:${String(puzzleSeconds%60).padStart(2,'0')}`; }, 1000);
}
function stopPuzzleClock() { clearInterval(puzzleClock); puzzleClock = undefined; }
const peekPuzzle = () => puzzleGrid.classList.add('peek');
const unpeekPuzzle = () => puzzleGrid.classList.remove('peek');
$('#peekPuzzle').addEventListener('pointerdown', peekPuzzle);
['pointerup','pointerleave','pointercancel'].forEach((type) => $('#peekPuzzle').addEventListener(type, unpeekPuzzle));

// Open the envelope to read the note and optionally add a real voice message.
function openLetter() {
  if (!$('#openLetter').hidden) {
  $('#openLetter').hidden = true;
  $('#envelopeHint').hidden = true;
  $('#letterHeading').innerHTML = 'I wrote you <em>this.</em>';
  $('#letterCard').hidden = false;
  $('#letterContinue').hidden = false;
  }
}
$('#openLetter').addEventListener('click', openLetter);
let voiceAudio = new Audio('voice-note.mp3');
voiceAudio.addEventListener('error', () => {
  if (voiceAudio?.src && !voiceAudio.src.startsWith('blob:')) voiceAudio = null;
});
$('#voiceFile').addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (!file) return;
  if (voiceAudio) URL.revokeObjectURL(voiceAudio.src);
  voiceAudio = new Audio(URL.createObjectURL(file));
  voiceAudio.addEventListener('ended', () => { $('#voicePlay').textContent = '▶'; });
  $('.voice-note b').textContent = file.name;
  $('#voicePlay').disabled = false;
});
$('#voicePlay').addEventListener('click', async () => {
  if (!voiceAudio || voiceAudio.error) { $('#voiceFile').click(); return; }
  if (voiceAudio.paused) {
    try { await voiceAudio.play(); $('#voicePlay').textContent = 'Ⅱ'; }
    catch { voiceAudio = null; $('#voiceFile').click(); }
  } else { voiceAudio.pause(); $('#voicePlay').textContent = '▶'; }
});
voiceAudio?.addEventListener('ended', () => { $('#voicePlay').textContent = '▶'; });

$$('.promise-paper input').forEach((check) => check.addEventListener('change', () => {
  const total = $$('.promise-paper input:checked').length;
  $('#sealPromises').innerHTML = total ? `Seal ${total} promise${total === 1 ? '' : 's'} <span>♥</span>` : 'Seal it with a kiss <span>♥</span>';
}));
function sealPromises() {
  if (!$('#sealPromises').disabled) {
  $('#sealedStamp').hidden = false;
  $('#sealPromises').textContent = 'Sealed with love ♥';
  $('#sealPromises').disabled = true;
  }
}
$('#sealPromises').addEventListener('click', sealPromises);
$('#startOver').addEventListener('click', () => showPage('openPage'));

// A soft original bell melody for the music toggle.
let audioContext;
let melodyTimer;
let noteIndex = 0;
const backgroundMusic = new Audio('background-music.mp3');
backgroundMusic.loop = true;
const melody = [523.25,659.25,783.99,659.25,587.33,698.46,880,698.46];
function playNote() {
  const start = audioContext.currentTime;
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.type = 'sine';
  oscillator.frequency.value = melody[noteIndex++ % melody.length];
  gain.gain.setValueAtTime(.0001, start);
  gain.gain.exponentialRampToValueAtTime(.04, start + .035);
  gain.gain.exponentialRampToValueAtTime(.0001, start + 1.1);
  oscillator.connect(gain); gain.connect(audioContext.destination);
  oscillator.start(start); oscillator.stop(start + 1.15);
}
$('#soundButton').addEventListener('click', async () => {
  const button = $('#soundButton');
  const isOn = button.getAttribute('aria-pressed') === 'true';
  if (isOn) {
    clearInterval(melodyTimer); melodyTimer = undefined;
    backgroundMusic.pause();
    if (audioContext) await audioContext.suspend();
    button.setAttribute('aria-pressed','false'); button.setAttribute('aria-label','Turn music on'); return;
  }
  try { await backgroundMusic.play(); }
  catch {
    audioContext ??= new (window.AudioContext || window.webkitAudioContext)();
    await audioContext.resume(); playNote(); melodyTimer = setInterval(playNote, 650);
  }
  button.setAttribute('aria-pressed','true'); button.setAttribute('aria-label','Turn music off');
});
