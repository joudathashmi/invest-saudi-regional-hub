/**
 * Photography for the page, taken from the Invest Saudi homepage design's
 * image library (Figma "Invest Saudi — Homepage", Nov 2026) so this page and
 * the homepage share one visual language. Files live in /public/img. Rights
 * for each image follow the homepage library; the brand team confirms before
 * production. Presentation only: no record in data/regional-hub.ts depends on it.
 */
export interface Photo { src: string; alt: string }

export const HERO_PHOTO: Photo = { src: '/img/riyadh-aerial.jpg', alt: 'Riyadh from the air: King Salman Park and the King Abdullah Financial District skyline' };

export const PLATFORM_PHOTOS: Record<string, Photo> = {
  'kaec-sez': { src: '/img/kaec.jpg', alt: 'King Abdullah Port and the economic city from the air' },
  'jazan-sez': { src: '/img/jazan.jpg', alt: 'Jazan port and industrial city on the Red Sea' },
  'rak-sez': { src: '/img/ras-al-khair.jpg', alt: 'Ras Al-Khair maritime yard on the Arabian Gulf' },
  'cloud-sez': { src: '/img/cloud.jpg', alt: 'Data-centre hall' },
  ilbz: { src: '/img/airport.jpg', alt: 'Airport terminal and apron from the air' },
  modon: { src: '/img/industrial.jpg', alt: 'Industrial plant' },
  rcjy: { src: '/img/port-cranes.jpg', alt: 'Container cranes at an industrial port' },
};

export const ROUTE_PHOTOS: Record<string, Photo> = {
  export: { src: '/img/ship.jpg', alt: 'Container ship leaving a Saudi port' },
  logistics: { src: '/img/port-cranes.jpg', alt: 'Container terminal' },
  services: { src: '/img/meeting.jpg', alt: 'Advisory team in a Riyadh office' },
  digital: { src: '/img/datacentre.jpg', alt: 'Data-centre corridor' },
  corporate: { src: '/img/overlook.jpg', alt: 'Executive looking over Riyadh at dusk' },
};

export const STEP_PHOTOS: Record<string, Photo> = {
  air: { src: '/img/airport.jpg', alt: 'Airport from the air' },
  sea: { src: '/img/ship.jpg', alt: 'Container ship at sea' },
  ground: { src: '/img/roads.jpg', alt: 'Road network through a Saudi city' },
  digital: { src: '/img/datacentre.jpg', alt: 'Data-centre corridor' },
  integrated: { src: '/img/riyadh-aerial.jpg', alt: 'Riyadh from the air' },
};

export const CHAPTER_PHOTOS: Photo[] = [
  { src: '/img/mountains.jpg', alt: 'Mountains above the clouds in Saudi Arabia' },
  { src: '/img/alula.jpg', alt: 'AlUla at sunset' },
];

export function industryPhoto(industry: string | null): Photo {
  const i = (industry ?? '').toLowerCase();
  if (i.includes('manufactur') || i.includes('chemical') || i.includes('mining') || i.includes('energy')) return { src: '/img/industrial.jpg', alt: 'Industrial plant' };
  if (i.includes('ict')) return { src: '/img/datacentre.jpg', alt: 'Data-centre corridor' };
  if (i.includes('financ')) return { src: '/img/finance.jpg', alt: 'Financial charts over a city skyline' };
  if (i.includes('health')) return { src: '/img/lab.jpg', alt: 'Scientist in a laboratory' };
  if (i.includes('food')) return { src: '/img/lab2.jpg', alt: 'Researcher at a microscope' };
  if (i.includes('logistic')) return { src: '/img/ship.jpg', alt: 'Container ship' };
  if (i.includes('tourism') || i.includes('real estate')) return { src: '/img/alula-people.jpg', alt: 'Visitors at AlUla' };
  return { src: '/img/office.jpg', alt: 'Professional at work in a Riyadh office' };
}

export const FEATURE_PHOTO: Photo = { src: '/img/meeting.jpg', alt: 'Team meeting in a Riyadh office' };
export const REACH_PHOTO: Photo = { src: '/img/skyline-day.jpg', alt: 'Riyadh skyline' };
