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

function normalizeRepoUrl(repo) {
  const trimmedRepo = repo.trim();
  if (!trimmedRepo) {
    return '';
  }

  return /^https?:\/\//i.test(trimmedRepo)
    ? trimmedRepo
    : `https://${trimmedRepo}`;
}

function isValidStudent(entry) {
  if (!entry || typeof entry !== 'object') return false;
  const { name, major, grad_year: gradYear, repo } = entry;
  const hasValidRepo =
    repo === undefined ||
    (typeof repo === 'string' && repo.trim().length > 0);

  return (
    typeof name === 'string' &&
    name.trim().length > 0 &&
    typeof major === 'string' &&
    major.trim().length > 0 &&
    (typeof gradYear === 'number' || typeof gradYear === 'string') &&
    `${gradYear}`.trim().length > 0 &&
    hasValidRepo
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

  entries.forEach(({ name, major, grad_year: gradYear, repo }) => {
    const item = document.createElement('li');
    item.className = 'roster-entry';

    const nameStrong = document.createElement('strong');
    nameStrong.textContent = name;

    const details = document.createElement('span');
    details.textContent = ` — ${major} — Class of ${gradYear}`;

    item.appendChild(nameStrong);
    item.appendChild(details);

    if (typeof repo === 'string' && repo.trim().length > 0) {
      const repoLink = document.createElement('a');
      const repoText = repo.trim();
      repoLink.href = normalizeRepoUrl(repoText);
      repoLink.textContent = repoText;
      repoLink.target = '_blank';
      repoLink.rel = 'noopener noreferrer';

      const separator = document.createTextNode(' — ');
      item.appendChild(separator);
      item.appendChild(repoLink);
    }

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

function initKonamiEasterEgg() {
  const sequence = [
    'ArrowUp',
    'ArrowUp',
    'ArrowDown',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    'ArrowLeft',
    'ArrowRight',
    'b',
    'a'
  ];

  let progressIndex = 0;
  let overlay = null;

  const closeOverlay = () => {
    if (!overlay) {
      return;
    }

    const frame = overlay.querySelector('iframe');
    if (frame) {
      frame.src = '';
    }

    overlay.remove();
    overlay = null;
  };

  const showOverlay = () => {
    if (overlay) {
      return;
    }

    overlay = document.createElement('div');
    overlay.className = 'konami-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Never gonna give you up');

    const dialog = document.createElement('div');
    dialog.className = 'konami-dialog';

    const title = document.createElement('h3');
    title.textContent = 'You found the Easter Egg!';

    const frameWrapper = document.createElement('div');
    frameWrapper.className = 'konami-frame';

    const frame = document.createElement('iframe');
    frame.src = 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1';
    frame.title = 'Never Gonna Give You Up by Rick Astley';
    frame.allow =
      'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    frame.allowFullscreen = true;

    const closeButton = document.createElement('button');
    closeButton.className = 'konami-close';
    closeButton.type = 'button';
    closeButton.textContent = 'Close';
    closeButton.addEventListener('click', closeOverlay);

    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) {
        closeOverlay();
      }
    });

    frameWrapper.appendChild(frame);
    dialog.appendChild(title);
    dialog.appendChild(frameWrapper);
    dialog.appendChild(closeButton);
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);
    closeButton.focus();
  };

  document.addEventListener('keydown', (event) => {
    if (overlay && event.key === 'Escape') {
      closeOverlay();
      return;
    }

    if (event.key === sequence[progressIndex]) {
      progressIndex += 1;
      if (progressIndex === sequence.length) {
        showOverlay();
        progressIndex = 0;
      }
    } else {
      progressIndex = event.key === sequence[0] ? 1 : 0;
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  loadRoster();
  initKonamiEasterEgg();
});
