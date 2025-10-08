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

document.addEventListener('DOMContentLoaded', initRoster);
