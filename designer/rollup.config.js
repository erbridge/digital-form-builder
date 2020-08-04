import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import globals from 'rollup-plugin-node-globals'
import json from '@rollup/plugin-json'

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
    resolve(),
    babel({
      babelHelpers: 'runtime',
      include: ['../engine', '../model'],
      presets: [
        '@babel/preset-env',
        '@babel/preset-flow'
      ],
      plugins: [
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-syntax-dynamic-import',
        '@babel/plugin-transform-runtime',
        '@babel/plugin-proposal-private-property-in-object',
        '@babel/plugin-proposal-private-methods'
      ]
    }),
    commonjs({
      include: ['node_modules/**', '../engine/**', '../model/**']
    }),
    globals(),
    babel({
      babelHelpers: 'runtime',
      exclude: ['node_modules/**'],
      presets: [
        '@babel/preset-env',
        '@babel/react',
        '@babel/preset-flow'
      ],
      plugins: [
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-syntax-dynamic-import',
        '@babel/plugin-transform-runtime',
        '@babel/plugin-proposal-private-property-in-object',
        '@babel/plugin-proposal-private-methods'
      ]
    }),
    json()
  ],
  external: ['react', 'react-dom']
}
