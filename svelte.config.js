import adapter from '@sveltejs/adapter-vercel';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		// Use the Vercel adapter
		adapter: adapter({
			runtime: 'nodejs18.x'
		})
		// No manual prerender block needed! 
		// Vercel automatically detects static vs dynamic.
	}
};

export default config;