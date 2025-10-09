import { loadStudents } from './modules/students.js';
import { renderRoster, renderRosterError } from './modules/rosterView.js';

const rosterElement = document.getElementById('roster');

async function initRoster() {
  if (!rosterElement) {
    return;
  }

  try {
    const students = await loadStudents('data/students/index.json');
    renderRoster(rosterElement, students);
  } catch (error) {
    console.error('Unable to load roster:', error);
    renderRosterError(rosterElement);
  }
}

function initFooterOrbby() {
  const footer = document.querySelector('.powered-by');
  const eyes = footer?.querySelectorAll('.footer-eyes .eye');

  if (!footer || !eyes?.length) {
    return;
  }

  const pupils = footer.querySelectorAll('.footer-eyes .pupil');
  const maxOffset = 6;

  function updatePupils(event) {
    const { clientX, clientY } = event.type.startsWith('touch')
      ? event.touches[0] ?? { clientX: 0, clientY: 0 }
      : event;

    pupils.forEach((pupil) => {
      const eye = pupil.parentElement;
      if (!eye) {
        return;
      }

      const rect = eye.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const angle = Math.atan2(clientY - centerY, clientX - centerX);
      const offsetX = Math.cos(angle) * maxOffset;
      const offsetY = Math.sin(angle) * maxOffset;

      pupil.style.transform = `translate(-50%, -50%) translate(${offsetX}px, ${offsetY}px)`;
    });
  }

  function resetPupils() {
    pupils.forEach((pupil) => {
      pupil.style.transform = 'translate(-50%, -50%)';
    });
  }

  let winkTimerId = 0;
  let winkResetId = 0;

  function triggerWink() {
    const eyesArray = Array.from(eyes);
    if (!eyesArray.length) {
      return;
    }

    const targetEye = eyesArray[Math.floor(Math.random() * eyesArray.length)];
    targetEye.classList.add('wink');
    winkResetId = window.setTimeout(() => {
      targetEye.classList.remove('wink');
      scheduleNextWink();
    }, 220);
  }

  function scheduleNextWink() {
    window.clearTimeout(winkTimerId);
    const delay = 4000 + Math.random() * 6000;
    winkTimerId = window.setTimeout(triggerWink, delay);
  }

  window.addEventListener('pointermove', updatePupils, { passive: true });
  window.addEventListener('touchmove', updatePupils, { passive: true });
  footer.addEventListener('pointerleave', resetPupils);
  footer.addEventListener('touchend', resetPupils);

  scheduleNextWink();

  window.addEventListener('beforeunload', () => {
    window.clearTimeout(winkTimerId);
    window.clearTimeout(winkResetId);
  });
}

function initKonamiOverlay() {
  const overlay = document.getElementById('konami-overlay');
  if (!overlay) {
    return;
  }

  const closeButton = overlay.querySelector('.konami-overlay__close');
  const overlayVideoFrame = overlay.querySelector('#konami-overlay-video');
  const overlayVideoSrc =
    overlayVideoFrame instanceof HTMLIFrameElement
      ? overlayVideoFrame.dataset.videoSrc ?? ''
      : '';
  const body = document.body;
  const KONAMI_CODE = [
    'ArrowUp',
    'ArrowUp',
    'ArrowDown',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    'ArrowLeft',
    'ArrowRight',
    'b',
    'a',
  ];

  let konamiIndex = 0;
  let typedBuffer = '';
  let lastFocusedElement = null;

  function showOverlay() {
    if (overlay.classList.contains('is-visible')) {
      return;
    }

    lastFocusedElement =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    overlay.classList.add('is-visible');
    overlay.setAttribute('aria-hidden', 'false');
    body?.classList.add('konami-overlay-open');

    if (overlayVideoFrame instanceof HTMLIFrameElement && overlayVideoSrc) {
      overlayVideoFrame.src = overlayVideoSrc;
    }

    if (closeButton && typeof closeButton.focus === 'function') {
      closeButton.focus();
    }
  }

  function hideOverlay() {
    if (!overlay.classList.contains('is-visible')) {
      return;
    }

    overlay.classList.remove('is-visible');
    overlay.setAttribute('aria-hidden', 'true');
    body?.classList.remove('konami-overlay-open');

    if (overlayVideoFrame instanceof HTMLIFrameElement) {
      overlayVideoFrame.src = '';
    }

    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      lastFocusedElement.focus();
    }

    lastFocusedElement = null;
  }

  closeButton?.addEventListener('click', hideOverlay);

  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) {
      hideOverlay();
    }
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && overlay.classList.contains('is-visible')) {
      event.preventDefault();
      hideOverlay();
      return;
    }

    const key = event.key;
    const normalizedKey = key.length === 1 ? key.toLowerCase() : key;

    if (normalizedKey === KONAMI_CODE[konamiIndex]) {
      konamiIndex += 1;
      if (konamiIndex === KONAMI_CODE.length) {
        showOverlay();
        konamiIndex = 0;
        typedBuffer = '';
      }
    } else if (normalizedKey === KONAMI_CODE[0]) {
      konamiIndex = 1;
    } else {
      konamiIndex = 0;
    }

    if (key.length === 1 && /^[a-z0-9-]$/i.test(key)) {
      typedBuffer = `${typedBuffer}${key.toLowerCase()}`.slice(-16);

      if (
        typedBuffer.endsWith('67') ||
        typedBuffer.endsWith('6-7') ||
        typedBuffer.endsWith('sixseven')
      ) {
        showOverlay();
        typedBuffer = '';
        konamiIndex = 0;
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initRoster();
  initFooterOrbby();
  initKonamiOverlay();
});
