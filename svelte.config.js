// svelte.config.js
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({
      // ✅ CRITICAL: Enables SPA-like behavior for all routes
      fallback: 'index.html'
    }),
    // ✅ CRITICAL: Disable ALL prerendering
    prerender: {
      default: false
    }
  }
};

export default config;