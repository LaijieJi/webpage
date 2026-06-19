// Maps photography entry slugs to a hero image + a short place label used by
// the gallery plates and photo-story header.
import munich from '../assets/media/CC41B5D9-DBE7-4E0C-8089-DEC0EE1275A1_1_105_c.jpeg';
import bavariaAlpine from '../assets/media/bavaria-alpine.jpeg';
import leaf from '../assets/media/CF12C5E8-3BBE-4973-8C44-2B4ABD00A866_1_105_c.jpeg';

export const photoMedia = {
  'hiking-bavaria': { image: bavariaAlpine, place: 'Herzogstand · ’26' },
  'munich-landmarks': { image: munich, place: 'München' }
};

export const fallbackMedia = { image: leaf, place: '' };

export function mediaFor(slug) {
  return photoMedia[slug] || fallbackMedia;
}
