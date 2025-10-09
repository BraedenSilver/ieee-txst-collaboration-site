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

document.addEventListener('DOMContentLoaded', () => {
  initRoster();
  initFooterOrbby();
});
