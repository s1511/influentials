const webpack = require('webpack');


module.exports = {
    context: __dirname + '/src',
    entry: "./index.js",
    output: {
        path: __dirname + "/dist",
        publicPath: '/dist/',
        filename: "bundle.js"
    },
    module: {
        rules: [{
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        }, {
            test: /\.scss$/,
            exclude: /node_modules/,
            use: [
                'style-loader',
                'css-loader',
                'sass-loader'
            ]
        }, {
            test: /\.js$/,
            include: __dirname + '/src',
            exclude: /node_modules/,
            enforce: 'pre',
            use: [{
                loader: 'eslint-loader', options: {
                    parserOptions: {
                        ecmaVersion: 6,
                        sourceType: "module"
                    },
                    rules: {semi: 0}
                }
            }],
        }, {
            test: /.(png|woff(2)?|eot|ttf|svg)(\?[a-z0-9=\.]+)?$/,
            loader: 'url-loader?limit=100000'
        },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                include: __dirname + '/src',
                use: [
                    {loader: 'babel-loader', options: {presets: [['es2015', {modules: false}]]}}
                ]
            }, {
                test: /\.(png|jpg)$/,
                use: [{
                    loader: 'url-loader',
                    options: {limit: 10000} // Convert images < 10k to base64 strings
                }]
            }]
    }
};
