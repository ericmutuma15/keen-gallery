import machakos from '../assets/machakos-light.jpeg';
import afterRain from '../assets/after-rain.jpeg';
import studioDawn from '../assets/studio-dawn.jpeg';
import portraitAbstract from '../assets/portrait-abstract.jpeg';
import marketStreet from '../assets/market-street.jpeg';
import studioDusk from '../assets/studio-dusk.jpeg';
import edgar from '../assets/edgar-keen-portrait.svg';

export const localArtworks = [
  { id: 'local-1', slug: 'machakos-light-local', title: 'Machakos Light', year: 2026, medium: 'Digital portrait', description: 'A portrait grounded in the warmth and quiet energy of Machakos mornings.', category: { name: 'Portrait', slug: 'portrait' }, imageUrl: machakos },
  { id: 'local-2', slug: 'after-rain-local', title: 'After Rain', year: 2026, medium: 'Mixed media', description: 'A moody study of rain, reflection, and the hush after a Kenyan shower.', category: { name: 'Abstract', slug: 'abstract' }, imageUrl: afterRain },
  { id: 'local-3', slug: 'night-market-local', title: 'Night Market', year: 2026, medium: 'Street editorial', description: 'Night streets and electric motion captured in a burst of life and color.', category: { name: 'Street', slug: 'street' }, imageUrl: studioDawn },
  { id: 'local-4', slug: 'commuter-echo-local', title: 'Commuter Echo', year: 2026, medium: 'Photo collage', description: 'The blend of transit, noise, and hope in everyday movement.', category: { name: 'Photography', slug: 'photography' }, imageUrl: portraitAbstract },
  { id: 'local-5', slug: 'studio-silence-local', title: 'Studio Silence', year: 2026, medium: 'Digital composition', description: 'A calm study in pacing, contrast, and the pause before creation.', category: { name: 'Digital', slug: 'digital' }, imageUrl: marketStreet },
  { id: 'local-6', slug: 'low-sun-local', title: 'Low Sun', year: 2026, medium: 'Editorial portrait', description: 'Golden-hour nostalgia and youth energy in one frame.', category: { name: 'Portrait', slug: 'portrait' }, imageUrl: studioDusk },
];

export const localFeatured = [
  { id: 'local-1', slug: 'machakos-light-local', title: 'Machakos Light', category: { name: 'Portrait' }, imageUrl: machakos },
  { id: 'local-2', slug: 'after-rain-local', title: 'After Rain', category: { name: 'Abstract' }, imageUrl: afterRain },
  { id: 'local-3', slug: 'night-market-local', title: 'Night Market', category: { name: 'Street' }, imageUrl: studioDawn },
];

export function findLocalBySlug(slug) {
  return localArtworks.find((a) => a.slug === slug) || null;
}
