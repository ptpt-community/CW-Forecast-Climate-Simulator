const path = require('path');

module.exports ={
    mode: "development",
    entry: "./src/index.ts",
    devtool: "eval-source-map",

    module: {
        rules:[
            {
            test: /\.ts$/,
            use: 'ts-loader',
            include: [path.resolve(__dirname,'src')]
         }
        ]
    },

    resolve: {
        extensions: ['.ts', '.js', '.json']
    },

    output:{
        filename:'bundle.js',
        path:path.resolve(__dirname,'public')
    },

    devServer: {
        contentBase: path.join(__dirname, 'public'),
      }
}