import webpack from 'webpack';

export default {
    entry: [
        './source/index.js',
        './source/index.css'
    ],

    output: { path: `${__dirname}/chrome`, filename: 'index.js' },

    module: {
        loaders: [
            { exclude: /node_modules/, loader: ['url'],          test: /\.woff$/ },
            { exclude: /node_modules/, loader: ['babel'],        test: /\.js$/ },
            { exclude: /node_modules/, loader: ['style', 'css'], test: /\.css$/ }
        ]
    },

    plugins: [
        new webpack.DefinePlugin({ 'process.env.NODE_ENV': '"production"' }),
        new webpack.LoaderOptionsPlugin({ minimize: true }),
        new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false }, sourceMap: false }),
        new webpack.optimize.OccurrenceOrderPlugin()
    ]
};
