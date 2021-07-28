const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: "development",
    entry: "./src/index.ts",
  //  devtool: "eval-source-map",

    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                include: [path.resolve(__dirname, 'src')]
            },
            {
                test: /\.(glsl|vs|fs|vert|frag)$/,
                exclude: /node_modules/,
                use: [
                    'raw-loader'
                ]
            }
        ]
    },

    resolve: {
        extensions: ['.ts', '.js', '.json']
    },

    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'public')
    },

    devServer: {
        contentBase: path.join(__dirname, 'public'),
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html',
            inject: "body"
        })
    ]
}