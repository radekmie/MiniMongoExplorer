import webpack from 'webpack';

export default {
    entry: [
        './source/index.js',
        './source/index.css'
    ],

    output: { path: `${__dirname}/chrome`, filename: 'index.js' },

    module: {
        loaders: [
            { exclude: /node_modules/, test: /\.js$/,  loader: ['babel'] },
            { exclude: /node_modules/, test: /\.css$/, loader: ['style', 'css'] }
        ]
    },

    plugins: [
        new webpack.DefinePlugin({ 'process.env.NODE_ENV': '"production"' }),
        new webpack.LoaderOptionsPlugin({ minimize: true }),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false }, sourceMap: false }),
        new webpack.optimize.OccurrenceOrderPlugin()
    ]
};
