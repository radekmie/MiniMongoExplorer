import inject from './inject';
export default inject(`
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
`);
