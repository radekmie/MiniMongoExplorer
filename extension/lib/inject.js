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
                    payload: JSON.stringify({
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
                    })
                }, '*');
            }
        };

        var subscriptions = function () {
            var subscriptions = Meteor.connection._subscriptions;
            if (subscriptions) {
                window.postMessage({
                    type: '${SET}',
                    payload: JSON.stringify({
                        subscriptions: Object
                            .keys(subscriptions)
                            .reduce(function (snapshot, subscription) {
                                snapshot[subscription] = {
                                    name:   subscriptions[subscription].name,
                                    ready:  subscriptions[subscription].ready,
                                    params: subscriptions[subscription].params
                                };

                                return snapshot;
                            }, {})
                    })
                }, '*');
            }
        };

        var computation1;
        var computation2;
        var computation3;
        var computationStart = function () {
            if (typeof Tracker === 'undefined') {
                return;
            }

            computationStop();

            computation1 = Tracker.autorun(function () {
                var collections = Meteor.connection._mongo_livedata_collections;
                if (collections) {
                    Object.keys(collections).forEach(function (collection) {
                        collections[collection].find({}, { limit: 1, tranform: null }).fetch();
                    });

                    Tracker.afterFlush(snapshot);
                }
            });

            computation2 = Tracker.autorun(function () {
                var subscriptions = Meteor.connection._subscriptions;
                if (subscriptions) {
                    Object.keys(subscriptions).forEach(function (subscription) {
                        subscriptions[subscription].readyDeps.depend();
                    });

                    Tracker.afterFlush(subscriptions);
                }
            });

            computation3 = setInterval(subscriptions, 1000);
        };
        var computationStop = function () {
            if (computation1) {
                computation1.stop();
                computation1 = null;
            }

            if (computation2) {
                computation2.stop();
                computation2 = null;
            }

            if (computation3) {
                clearInterval(computation3);
                computation3 = null;
            }
        };

        var onMessage = function (event) {
            if (event.data) {
                if (event.data.type === '${SET}') {
                    event.data.payload.isReactive === true  && computationStart();
                    event.data.payload.isReactive === false && computationStop();

                    event.data.payload.snapshotRequested && snapshot();
                    event.data.payload.snapshotRequested && subscriptions();
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
