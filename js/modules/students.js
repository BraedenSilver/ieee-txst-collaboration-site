import { fetchJson } from './http.js';

const SUPPORTED_PHOTO_EXTENSIONS = ['.gif', '.png', '.jpg', '.jpeg'];
const DEFAULT_PHOTO_CHOICES = [
  'defaults/bobcat1.jpg',
  'defaults/bobcat2.jpg',
  'defaults/bobcat3.jpg',
  'defaults/bobcat4.jpg',
  'defaults/bobcat5.jpg',
  'defaults/bobcat6.jpg',
  'defaults/bobcat7.jpg',
  'defaults/bobcat8.jpg',
  'defaults/bobcat9.png',
  'defaults/bobcat10.png',
  'defaults/bobcat11.jpg',
];

function pickRandomDefaultPhoto() {
  if (!DEFAULT_PHOTO_CHOICES.length) {
    return 'defaults/bill.gif';
  }

  const index = Math.floor(Math.random() * DEFAULT_PHOTO_CHOICES.length);
  return DEFAULT_PHOTO_CHOICES[index];
}

export function normalizeLinkUrl(linkUrl) {
  const trimmedLink = typeof linkUrl === 'string' ? linkUrl.trim() : '';
  if (!trimmedLink) {
    return '';
  }

  return /^https?:\/\//i.test(trimmedLink)
    ? trimmedLink
    : `https://${trimmedLink}`;
}

export function isSupportedPhotoFilename(photo) {
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

export function resolvePhotoFilename(photo) {
  if (!isSupportedPhotoFilename(photo)) {
    return pickRandomDefaultPhoto();
  }

  const trimmed = photo.trim();
  if (trimmed.toLowerCase() === 'default.gif') {
    return pickRandomDefaultPhoto();
  }

  return trimmed;
}

export function isValidStudent(entry) {
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

export async function loadStudents(manifestPath) {
  const manifest = await fetchJson(manifestPath);

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
        students.push({
          ...studentData,
          link_url: typeof studentData.link_url === 'string' ? studentData.link_url.trim() : '',
        });
      } else {
        console.warn(`Invalid student data in ${trimmedName}`);
      }
    } catch (error) {
      console.error(`Failed to load ${trimmedName}:`, error);
    }
  }

  return students.sort((a, b) => a.name.localeCompare(b.name));
}
