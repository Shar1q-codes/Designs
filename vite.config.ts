import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    // three.js is large but lazy-loaded, only for the glass style.
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        // Keep Three.js in its own chunk so only the space design pays for it.
        manualChunks: { three: ['three', '@react-three/fiber'] },
      },
    },
  },
});
