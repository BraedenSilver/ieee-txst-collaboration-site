import { normalizeLinkUrl, resolvePhotoFilename } from './students.js';

function createMessageItem(message) {
  const item = document.createElement('li');
  item.className = 'roster-entry';
  item.textContent = message;
  return item;
}

function buildRosterCard(student) {
  const { name, major, grad_year: gradYear, link_url: rawLink, photo } = student;
  const trimmedLink = typeof rawLink === 'string' ? rawLink.trim() : '';
  const normalizedLink = normalizeLinkUrl(trimmedLink);

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

  return card;
}

export function renderRoster(listElement, students) {
  listElement.innerHTML = '';

  if (!students.length) {
    listElement.appendChild(
      createMessageItem('No contributors yet. Your name could be the first!')
    );
    return;
  }

  const fragment = document.createDocumentFragment();

  students.forEach((student) => {
    const item = document.createElement('li');
    item.className = 'roster-entry';
    item.appendChild(buildRosterCard(student));
    fragment.appendChild(item);
  });

  listElement.appendChild(fragment);
}

export function renderRosterError(listElement) {
  listElement.innerHTML = '';
  listElement.appendChild(
    createMessageItem('We could not load the roster right now. Please try again later.')
  );
}
