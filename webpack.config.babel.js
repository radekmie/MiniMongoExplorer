import webpack    from 'webpack';
import { join }   from 'path';
import HTMLPlugin from 'html-webpack-plugin';

export default ({ directory, entry, pages = [] }) => ({
    entry,

    output: { path: join(__dirname, 'build', directory), filename: '[name].js' },
    module: {
        loaders: [
            { exclude: /node_modules/, loader: 'url-loader',              test: /\.woff$/ },
            { exclude: /node_modules/, loader: 'babel-loader',            test: /\.js$/ },
            { exclude: /node_modules/, loader: 'style-loader!css-loader', test: /\.css$/ }
        ]
    },

    plugins: [
        new webpack.DefinePlugin({
            process: {
                env: {
                    NODE_ENV: JSON.stringify('production')
                }
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            comments: false,
            compress: {
                warnings: false
            },
            sourceMap: false
        }),
        new webpack.optimize.OccurrenceOrderPlugin(),

        ...pages.map(chunk => new HTMLPlugin({
            title: null,

            chunks:     [chunk],
            filename: `${chunk}.html`,

            minify: {
                collapseWhitespace:  true,
                removeEmptyElements: true
            }
        }))
    ]
});
