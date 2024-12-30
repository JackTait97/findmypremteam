import { defineConfig } from 'vite';

export default defineConfig({
    root: './public', // Ensure Vite uses the public folder as the root
    server: {
        port: 3000, // Default port
    },
});
