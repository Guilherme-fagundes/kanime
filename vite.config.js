// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.js',
      name: 'KAnime',
      formats: ['es', 'umd'],
      fileName: (format) => {
        if (format === 'umd') return 'kanime.min.js';  // <-- nome customizado!
        if (format === 'es') return 'kanime.es.js';
        return `kanime.${format}.js`;
      },
    },
    minify: 'terser', // Minificação garantida
    rollupOptions: {
      output: {
        globals: {
          // Se usar libs externas, declare aqui
        },
      },
    },
  },
});
