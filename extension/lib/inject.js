import { DEL, SET } from './reduxConstants';

export default `
    (function () {
        if (typeof Meteor === 'undefined') {
            return;
        }

        var snapshot = function () {
            var collections = Meteor.connection._mongo_livedata_collections;
            if (collections) {
                window.postMessage({
                    type: '${SET}',
                    payload: {
                        snapshotTimestamp: Date.now(),
                        snapshotRequested: false,
                        snapshot: Object
                            .keys(collections)
                            .reduce(function (snapshot, collection) {
                                snapshot[collection] = collections[collection]
                                    .find({}, { transform: null })
                                    .fetch();

                                return snapshot;
                            }, {})
                    }
                }, '*');
            }
        };

        var computation;
        var computationStart = function () {
            if (typeof Tracker === 'undefined') {
                return;
            }

            computationStop();
            computation = Tracker.autorun(function () {
                var collections = Meteor.connection._mongo_livedata_collections;
                if (collections) {
                    Object.keys(collections).forEach(function (collection) {
                        collections[collection].find({}, { limit: 1, tranform: null }).fetch();
                    });

                    Tracker.afterFlush(snapshot);
                }
            });
        };
        var computationStop = function () {
            if (computation) {
                computation.stop();
                computation = null;
            }
        };

        var onMessage = function (event) {
            if (event.data) {
                if (event.data.type === '${SET}') {
                    event.data.payload.isReactive === true  && computationStart();
                    event.data.payload.isReactive === false && computationStop();

                    event.data.payload.snapshotRequested && snapshot();
                }

                if (event.data.type === '${DEL}') {
                    computationStop();
                    window.removeEventListener('message', onMessage);
                }
            }
        };

        window.addEventListener('message', onMessage, false);
    })()
`;
