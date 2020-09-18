import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import globals from 'rollup-plugin-node-globals'
import builtins from '@cautionyourblast/rollup-plugin-node-builtins'
import json from '@rollup/plugin-json'
import babelrc from './.babelrc.json'

export default {
  input: 'client/index.js',
  output: {
    file: 'dist/designer.js',
    format: 'iife',
    globals: {
      react: 'React',
      'react-dom': 'ReactDOM'
    }
  },
  plugins: [
    builtins({ crypto: false }),
    resolve({
      preferBuiltins: false,
      browser: true
    }),
    commonjs({
      include: ['/node_modules/**', /node_modules/]
    }),
    babel({
      babelrc: false,
      babelHelpers: 'runtime',
      ...babelrc
    }),
    json(),
    globals()

  ],
  external: ['react', 'react-dom']
}
