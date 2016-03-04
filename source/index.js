import { createElement } from 'react';
import { render }        from 'react-dom';

import MiniMongoExplorer from './components/MiniMongoExplorer';

document.addEventListener('DOMContentLoaded', () => {
    const ISODate = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/;

    render(createElement(MiniMongoExplorer, {
        fetch: callback =>
            chrome.devtools.inspectedWindow.eval(`
                (function () {
                    if (typeof Meteor === 'undefined') {
                        return '{}';
                    }

                    var collections = Meteor.connection._mongo_livedata_collections;
                    if (collections) {
                        collections = Object.keys(collections)
                            .reduce(function (minimongo, collection) {
                                minimongo[collection] = collections[collection]._docs._map;
                                return minimongo;
                            }, {});
                    } else {
                        collections = {};
                    }

                    return JSON.stringify(collections);
                })()
            `, result =>
                callback(JSON.parse(result, (key, value) =>
                    typeof value === 'string'
                        ? ISODate.test(value)
                            ? new Date(value)
                            : value
                        : value
                ))
            )
    }), document.body);
});
