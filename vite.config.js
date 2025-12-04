import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    // Base URL for GitHub Pages - update to match your repo name
    base: '/Node-Blank/',

    build: {
        outDir: 'dist',
        emptyOutDir: true,
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
            },
        },
        // Enable minification
        minify: 'terser',
        // Generate source maps for debugging
        sourcemap: false,
    },

    // Dev server configuration
    server: {
        port: 8001,
        open: true,
    },

    // Optimize dependencies
    optimizeDeps: {
        include: ['@preact/signals-core'],
    },
});
