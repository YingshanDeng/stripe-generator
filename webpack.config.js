const path = require('path');

module.exports = {
    mode: 'production',
    entry: path.resolve(__dirname, './src/index.ts'),
    output: {
        filename: 'index.dist.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'StripeGenerator',
        libraryTarget: 'umd',
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: [/node_modules/],
                use: 'ts-loader'
            }
        ],
    },
    watch: true,
    watchOptions: {
        ignored: ['node_modules', 'script'],
        aggregateTimeout: 300,
    }
}
