import type { College } from '../types/college';

function escapeXml(value: string) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

export function getCollegeImageUrl(college: Pick<College, 'name' | 'location' | 'imageColor' | 'image'>) {
  if (college.image) {
    if (/^https?:\/\//i.test(college.image) || college.image.startsWith('data:') || college.image.startsWith('/')) {
      return college.image;
    }

    return `/assets/${college.image}`;
  }

  const [city, state] = college.location.split(',').map((part) => part.trim());
  const title = escapeXml(college.name);
  const subtitle = escapeXml(city ?? college.location);
  const accent = escapeXml(state ?? 'Campus');

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 720" role="img" aria-label="${title}">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#0f172a" />
          <stop offset="55%" stop-color="#1e293b" />
          <stop offset="100%" stop-color="#5b72f2" />
        </linearGradient>
        <radialGradient id="glow" cx="0.3" cy="0.2" r="0.8">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.35" />
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
        </radialGradient>
      </defs>
      <rect width="1200" height="720" fill="url(#bg)" />
      <circle cx="940" cy="160" r="240" fill="url(#glow)" />
      <circle cx="120" cy="620" r="180" fill="url(#glow)" />
      <path d="M0 530 Q180 490 360 530 T720 520 T1200 550 V720 H0 Z" fill="rgba(255,255,255,0.12)" />
      <rect x="72" y="72" width="420" height="86" rx="28" fill="rgba(255,255,255,0.12)" />
      <text x="104" y="128" fill="#ffffff" font-size="34" font-family="Inter, Arial, sans-serif" font-weight="700">${subtitle}</text>
      <text x="72" y="318" fill="#ffffff" font-size="60" font-family="Inter, Arial, sans-serif" font-weight="800">${title}</text>
      <text x="72" y="382" fill="#e2e8f0" font-size="28" font-family="Inter, Arial, sans-serif">${accent}</text>
      <rect x="72" y="454" width="280" height="10" rx="5" fill="#ffffff" fill-opacity="0.55" />
      <rect x="72" y="488" width="190" height="10" rx="5" fill="#ffffff" fill-opacity="0.35" />
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}