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

function normalizeLinkUrl(linkUrl) {
  const trimmedLink = linkUrl.trim();
  if (!trimmedLink) {
    return '';
  }

  return /^https?:\/\//i.test(trimmedLink)
    ? trimmedLink
    : `https://${trimmedLink}`;
}

const SUPPORTED_PHOTO_EXTENSIONS = ['.gif', '.png', '.jpg', '.jpeg'];
const DEFAULT_PHOTO_CHOICES = [
  'defaults/bill.gif',
  'defaults/gum.png',
  'defaults/john.jpg',
  'defaults/soy.png'
];

function pickRandomDefaultPhoto() {
  if (!DEFAULT_PHOTO_CHOICES.length) {
    return 'defaults/bill.gif';
  }

  const index = Math.floor(Math.random() * DEFAULT_PHOTO_CHOICES.length);
  return DEFAULT_PHOTO_CHOICES[index];
}

function isSupportedPhotoFilename(photo) {
  if (typeof photo !== 'string') {
    return false;
  }

  const trimmed = photo.trim();
  if (!trimmed) {
    return false;
  }

  if (/[\\/]/.test(trimmed)) {
    return false;
  }

  if (!/^[A-Za-z0-9._-]+$/.test(trimmed)) {
    return false;
  }

  const lower = trimmed.toLowerCase();
  return SUPPORTED_PHOTO_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

function resolvePhotoFilename(photo) {
  if (!isSupportedPhotoFilename(photo)) {
    return pickRandomDefaultPhoto();
  }

  const trimmed = photo.trim();
  if (trimmed.toLowerCase() === 'default.gif') {
    return pickRandomDefaultPhoto();
  }

  return trimmed;
}

function isValidStudent(entry) {
  if (!entry || typeof entry !== 'object') return false;
  const { name, major, grad_year: gradYear, link_url: linkUrl, photo } = entry;
  const hasValidLink =
    linkUrl === undefined ||
    typeof linkUrl === 'string';
  const hasValidPhoto =
    photo === undefined ||
    isSupportedPhotoFilename(photo);

  return (
    typeof name === 'string' &&
    name.trim().length > 0 &&
    typeof major === 'string' &&
    major.trim().length > 0 &&
    (typeof gradYear === 'number' || typeof gradYear === 'string') &&
    `${gradYear}`.trim().length > 0 &&
    hasValidLink &&
    hasValidPhoto
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

  entries.forEach(({ name, major, grad_year: gradYear, link_url: linkUrl, photo }) => {
    const item = document.createElement('li');
    item.className = 'roster-entry';

    const trimmedLink = typeof linkUrl === 'string' ? linkUrl.trim() : '';
    const normalizedLink = trimmedLink ? normalizeLinkUrl(trimmedLink) : '';

    const card = normalizedLink
      ? document.createElement('a')
      : document.createElement('div');
    card.className = 'roster-card';

    if (normalizedLink) {
      card.href = normalizedLink;
      card.target = '_blank';
      card.rel = 'noopener noreferrer';
      card.classList.add('roster-card--link');
    }

    const photoWrapper = document.createElement('div');
    photoWrapper.className = 'roster-photo-wrapper';

    const photoFilename = resolvePhotoFilename(photo);
    const photoImage = document.createElement('img');
    photoImage.className = 'roster-photo';
    photoImage.src = `assets/${photoFilename}`;
    photoImage.alt = `${name}'s profile photo`;

    photoWrapper.appendChild(photoImage);

    const content = document.createElement('div');
    content.className = 'roster-content';

    const nameStrong = document.createElement('strong');
    nameStrong.textContent = name;

    const meta = document.createElement('div');
    meta.className = 'roster-meta';

    const details = document.createElement('span');
    details.className = 'roster-details';
    details.textContent = ` - ${major} - Class of ${gradYear}`;

    meta.appendChild(details);

    if (normalizedLink) {
      const separator = document.createTextNode(' - ');
      meta.appendChild(separator);

      const linkText = document.createElement('span');
      linkText.className = 'roster-link';
      linkText.textContent = trimmedLink;

      meta.appendChild(linkText);
    }

    content.appendChild(nameStrong);
    content.appendChild(meta);

    card.appendChild(photoWrapper);
    card.appendChild(content);

    item.appendChild(card);

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
