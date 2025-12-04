import { defineConfig } from 'vite';
import { resolve } from 'path';
import { copyFileSync, mkdirSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

export default defineConfig({
    // Base URL for GitHub Pages - update to match your repo name
    base: '/Node-Blank/',

    // Public directory - Vite will copy this to dist root
    // Since we need lib/ and assets/, we'll handle them via plugin
    publicDir: false, // Disable default public dir handling

    build: {
        outDir: 'dist',
        emptyOutDir: true,
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
            },
        },
        // Enable minification (using esbuild - faster than terser)
        minify: 'esbuild',
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

    // Plugin to copy lib/ and assets/ folders
    plugins: [
        {
            name: 'copy-static-assets',
            closeBundle() {
                // Copy lib folder
                copyFolderRecursive('lib', 'dist/lib');
                // Copy assets folder
                copyFolderRecursive('assets', 'dist/assets');
            }
        }
    ]
});

// Helper function to copy folders recursively
function copyFolderRecursive(src, dest) {
    try {
        mkdirSync(dest, { recursive: true });
        const entries = readdirSync(src);

        for (const entry of entries) {
            const srcPath = join(src, entry);
            const destPath = join(dest, entry);

            if (statSync(srcPath).isDirectory()) {
                copyFolderRecursive(srcPath, destPath);
            } else {
                copyFileSync(srcPath, destPath);
            }
        }
    } catch (err) {
        console.error(`Error copying ${src} to ${dest}:`, err);
    }
}
