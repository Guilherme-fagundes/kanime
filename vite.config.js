// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.js',
      name: 'KAnime',
      fileName: (format) => `kanime.${format}.js`,
    },
    rollupOptions: {
      output: {
        globals: {
          // se usar dependências externas, configure aqui
        },
      },
    },
  },
});
