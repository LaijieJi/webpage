// Central image descriptors: a JPEG fallback + a WebP srcset for each photo.
// WebP variants are generated with cwebp (see assets/media/*.webp).
import munichJpg from '../assets/media/CC41B5D9-DBE7-4E0C-8089-DEC0EE1275A1_1_105_c.jpeg';
import munich640 from '../assets/media/munich-640.webp';
import munich1024 from '../assets/media/munich-1024.webp';

import leafJpg from '../assets/media/CF12C5E8-3BBE-4973-8C44-2B4ABD00A866_1_105_c.jpeg';
import leaf640 from '../assets/media/leaf-640.webp';
import leaf1024 from '../assets/media/leaf-1024.webp';

import bavariaJpg from '../assets/media/bavaria-alpine.jpeg';
import bavaria640 from '../assets/media/bavaria-640.webp';
import bavaria1280 from '../assets/media/bavaria-1280.webp';

import lamyJpg from '../assets/media/lamy-notebook.jpeg';
import lamy1000 from '../assets/media/lamy-1000.webp';

export const munichImg = { src: munichJpg, webp: `${munich640} 640w, ${munich1024} 1024w` };
export const leafImg = { src: leafJpg, webp: `${leaf640} 640w, ${leaf1024} 1024w` };
export const bavariaImg = { src: bavariaJpg, webp: `${bavaria640} 640w, ${bavaria1280} 1280w` };
export const lamyImg = { src: lamyJpg, webp: lamy1000 };
