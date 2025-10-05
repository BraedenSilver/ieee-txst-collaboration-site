const rosterElement = document.getElementById('roster');

function createMessageItem(message) {
  const item = document.createElement('li');
  item.className = 'roster-entry';
  item.textContent = message;
  return item;
}

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return response.json();
}

function isValidStudent(entry) {
  if (!entry || typeof entry !== 'object') return false;
  const { name, major, grad_year: gradYear } = entry;
  return (
    typeof name === 'string' &&
    name.trim().length > 0 &&
    typeof major === 'string' &&
    major.trim().length > 0 &&
    (typeof gradYear === 'number' || typeof gradYear === 'string') &&
    `${gradYear}`.trim().length > 0
  );
}

function renderRoster(entries) {
  rosterElement.innerHTML = '';

  if (!entries.length) {
    rosterElement.appendChild(
      createMessageItem('No contributors yet. Your name could be the first!')
    );
    return;
  }

  entries.forEach(({ name, major, grad_year: gradYear }) => {
    const item = document.createElement('li');
    item.className = 'roster-entry';

    const nameStrong = document.createElement('strong');
    nameStrong.textContent = name;

    const details = document.createElement('span');
    details.textContent = ` — ${major} — Class of ${gradYear}`;

    item.appendChild(nameStrong);
    item.appendChild(details);
    rosterElement.appendChild(item);
  });
}

async function loadRoster() {
  try {
    const manifest = await fetchJson('data/students/index.json');

    if (!Array.isArray(manifest)) {
      throw new Error('Manifest must be an array of filenames.');
    }

    const students = [];

    for (const fileName of manifest) {
      if (typeof fileName !== 'string') {
        console.warn('Skipping non-string manifest entry:', fileName);
        continue;
      }

      const trimmedName = fileName.trim();
      if (!trimmedName) {
        continue;
      }

      try {
        const studentData = await fetchJson(`data/students/${trimmedName}`);
        if (isValidStudent(studentData)) {
          students.push(studentData);
        } else {
          console.warn(`Invalid student data in ${trimmedName}`);
        }
      } catch (error) {
        console.error(`Failed to load ${trimmedName}:`, error);
      }
    }

    students.sort((a, b) => a.name.localeCompare(b.name));

    renderRoster(students);
  } catch (error) {
    console.error('Unable to load roster:', error);
    rosterElement.appendChild(
      createMessageItem('We could not load the roster right now. Please try again later.')
    );
  }
}

document.addEventListener('DOMContentLoaded', loadRoster);
