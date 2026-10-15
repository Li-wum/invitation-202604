const envelope = document.getElementById('envelope');
const viewer = document.getElementById('viewer');
const closeButton = document.getElementById('close');
const hint = document.getElementById('hint');
const letter = document.querySelector('.letter');
const fullInvitation = document.querySelector('.full-invitation');
let playing = false;
let timers = [];
let flight = null;
let flyingCard = null;
function later(callback, delay) { timers.push(window.setTimeout(callback, delay)); }
function clearFlight() {
  if (flight) { flight.cancel(); flight = null; }
  if (flyingCard) { flyingCard.remove(); flyingCard = null; }
}
function reset() {
  timers.forEach(clearTimeout); timers = [];
  clearFlight(); playing = false;
  viewer.classList.remove('visible', 'complete'); viewer.setAttribute('aria-hidden', 'true');
  envelope.classList.remove('opened', 'pulling', 'finished');
  envelope.setAttribute('aria-expanded', 'false');
  hint.textContent = '點擊信封，開啟邀請函';
  closeButton.blur();
}
function expandCard() {
  // The same card flies forward from its actual extracted position, rather than
  // fading out and being replaced by an unrelated centered image.
  const start = letter.getBoundingClientRect();
  const end = fullInvitation.getBoundingClientRect();
  flyingCard = document.createElement('img');
  flyingCard.src = letter.src;
  flyingCard.alt = '';
  flyingCard.className = 'flying-card';
  Object.assign(flyingCard.style, {
    left: `${start.left}px`, top: `${start.top}px`,
    width: `${start.width}px`, height: `${start.height}px`
  });
  document.body.appendChild(flyingCard);
  envelope.classList.add('finished');
  viewer.classList.add('visible');
  viewer.setAttribute('aria-hidden', 'false');
  const dx = end.left - start.left;
  const dy = end.top - start.top;
  const sx = end.width / start.width;
  const sy = end.height / start.height;
  flight = flyingCard.animate([
    { transform: 'translate3d(0,0,0) scale(1)', boxShadow: '0 3px 10px #624b3620' },
    { transform: `translate3d(${dx}px,${dy}px,0) scale(${sx},${sy})`, boxShadow: '0 18px 55px #4d392624' }
  ], { duration: 900, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'forwards' });
  flight.onfinish = () => {
    clearFlight();
    viewer.classList.add('complete');
    closeButton.focus({ preventScroll: true });
  };
  hint.textContent = '';
}
envelope.addEventListener('click', () => {
  if (playing) return;
  playing = true;
  viewer.classList.remove('complete');
  envelope.classList.add('opened');
  envelope.setAttribute('aria-expanded', 'true');
  hint.textContent = '正在開啟邀請函…';
  later(() => envelope.classList.add('pulling'), 800);
  later(expandCard, 2150);
});
closeButton.addEventListener('click', () => { reset(); envelope.focus({preventScroll: true}); });
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && viewer.classList.contains('visible')) {
    reset(); envelope.focus({preventScroll: true});
  }
});
