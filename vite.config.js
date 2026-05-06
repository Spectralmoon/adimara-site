import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

// Use RELATIVE base so assets resolve correctly whether the site is served at:
//   https://spectralmoon.github.io/adimara-site/   (subpath)
//   https://adimara.spectralmoonstudio.com/        (root, custom domain)
//   http://localhost:5173/                          (local dev)
// Without this, absolute "/style.css" paths 404 on the github.io subpath URL.
export default defineConfig({
  base: './',
  plugins: [tailwindcss()]
});
