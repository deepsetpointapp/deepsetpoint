// svelte.config.js
import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter(),
    // ✅ CRITICAL FIX: SUPPRESS PRERENDER ERRORS FOR DYNAMIC PAGES
    prerender: {
      handleHttpError: 'warn', // Allow build to complete despite dynamic routes
      handleMissingId: 'warn'
    }
  }
};

export default config;