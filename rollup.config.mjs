import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';

export default {
  input: 'src/calendar-upcoming-card.ts',
  output: {
    file: 'dist/calendar-upcoming-card.js',
    format: 'es',
    sourcemap: true,
  },
  plugins: [
    resolve({
      browser: true,
    }),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json',
    }),
    json(),
  ],
};
