const path = require('path');

module.exports = {
    mode: 'production',
    entry: './src/index.js',
    output: {
        filename: 'copy.js',
        path: path.resolve(__dirname, 'dist'),
        libraryTarget: 'umd'
    },
    module: {
        rules: [{
            test: /\.js$/,
            use: 'babel-loader'
        }]
    },
    target: 'node'
};
