/*eslint-disable*/
var path = require('path')
var webpack = require('webpack')
// var JsDocPlugin = require('jsdoc-webpack-plugin');
module.exports = {
    entry: './src/index',
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: 'ychart.js',
        library: 'ychart',
        libraryTarget: 'umd'
    },
    module: {
        loaders: [{
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: /(node_modules|bower_components)/,
            query: {
                presets: [
                    ['es2015']
                ],
                plugins: ['add-module-exports']
            }
        }]
    },

    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"development"'
            }
        }),
        // new JsDocPlugin({
            // conf: './jsdoc.conf'
        // })
    ],
    devtool: 'source-map'
}
