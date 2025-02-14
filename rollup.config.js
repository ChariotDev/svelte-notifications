import autoprefixer from 'autoprefixer';

import svelte from 'rollup-plugin-svelte';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import css from 'rollup-plugin-css-only';

import preprocess from 'svelte-preprocess';

import pkg from './package.json';

const preprocessOptions = {
  postcss: {
    plugins: [
      autoprefixer,
    ],
  },
};
const production = !process.env.ROLLUP_WATCH;
const name = pkg.name
  .replace(/^(@\S+\/)?(svelte-)?(\S+)/, '$3')
  .replace(/^\w/, m => m.toUpperCase())
  .replace(/-\w/g, m => m[1].toUpperCase());

const config = production
  ? ({
      input: 'src/index.js',
      output: [
        {
          file: pkg.module,
          format: 'es',
          exports: 'named',
        },
        {
          file: pkg.main,
          format: 'umd',
          name,
          exports: 'named',
        },
      ],
      plugins: [
        css({
          output: 'bundle.css',
        }),
        svelte({
          preprocess: preprocess(preprocessOptions),
          compilerOptions: {
            dev: !production,
          },
        }),
        resolve({
          browser: true,
          dedupe: ['svelte'],
        }),
        terser(),
      ],
    })
  : ({
      input: 'example/index.js',
      output: {
        sourcemap: true,
        format: 'iife',
        name: 'app',
        file: 'public/bundle.js',
      },
      plugins: [
        css({
          output: 'bundle.css',
        }),
        svelte({
          preprocess: preprocess(preprocessOptions),
          compilerOptions: {
            dev: !production,
          },
        }),
        resolve(),
        commonjs(),
        livereload('public'),
      ],
    });

export default config;
