import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import progress from 'vite-plugin-progress';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
	plugins: [react(), progress(), visualizer()],
	publicDir: 'public',
	build: {
		outDir: 'build',
	},
	server: {
		port: 8808,
	},
	css: {
		preprocessorOptions: {
			scss: {
				additionalData: '@import "/src/scss/_colors.scss";',
			},
		},
	},
	resolve: {
		alias: {
			components: '/src/components',
			assets: '/src/assets',
			hooks: '/src/hooks',
			layouts: '/src/layouts',
			scss: '/src/scss',
			services: '/src/services',
			store: '/src/store',
			utils: '/src/utils',
			modules: '/src/modules',
		},
	},
});
