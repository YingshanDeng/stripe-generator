const path = require('path');

module.exports = {
    mode: 'development',
    entry: path.resolve(__dirname, './src/index.ts'),
    output: {
        filename: 'index.dist.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'StripeGenerator',
        libraryTarget: 'umd',
        libraryExport: 'default',
        umdNamedDefine: true,
    },
    devtool: 'cheap-module-source-map',
    optimization: {
        minimize: false
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: [/node_modules/],
                use: ['babel-loader', 'ts-loader']
            }
        ],
    },
    watch: true,
    watchOptions: {
        ignored: ['node_modules', 'script'],
        aggregateTimeout: 300,
    }
}
