import typescript from '@rollup/plugin-typescript';
import serve from 'rollup-plugin-serve'
import { uglify } from 'rollup-plugin-uglify';
import camelCase from 'lodash.camelcase'

const isProduction = process.env.NODE_ENV === 'production';
const libraryName = 'stripe-generator'

const config = {
    input: `src/${libraryName}.ts`,
    output: {
        dir: 'dist',
        format: 'umd',
        name: camelCase(libraryName),
        sourcemap: true,
    },
    watch: {
        include: 'src/**',
    },
    plugins: [ typescript() ]
}

if (isProduction) {
    config.plugins.push(uglify());
} else {
    config.plugins.push(serve({
        contentBase: './',
        open: true,
        openPage: '/demo/index.html',
    }));
}

export default config;