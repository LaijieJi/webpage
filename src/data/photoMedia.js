// Maps photography entry slugs to a hero image (JPEG + WebP) and a place label,
// used by the gallery plates and the photo-story header.
import { munichImg, bavariaImg, leafImg } from './media.js';

export const photoMedia = {
  'hiking-bavaria': { image: bavariaImg.src, webp: bavariaImg.webp, ratio: bavariaImg.ratio, place: 'Herzogstand · ’26' },
  'munich-landmarks': { image: munichImg.src, webp: munichImg.webp, ratio: munichImg.ratio, place: 'München' }
};

export const fallbackMedia = { image: leafImg.src, webp: leafImg.webp, ratio: leafImg.ratio, place: '' };

export function mediaFor(slug) {
  return photoMedia[slug] || fallbackMedia;
}
