import config from './webpack.config.babel';

export default config({
    directory: 'chrome',

    entry: {
        content:    './chrome/content.js',
        devtools:   './chrome/devtools.js',
        background: './chrome/background.js',

        panel: [
            './chrome/panel.js',
            './chrome/panel.css'
        ]
    },

    pages: [
        'panel',
        'devtools'
    ]
});
