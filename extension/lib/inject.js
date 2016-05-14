import { ADD, CHA, DEL, NEW, REM, SET } from './reduxConstants';

export default '(' + function (ADD, CHA, DEL, NEW, REM, SET) {
    var initialize = function () {
        if (typeof Meteor === 'undefined' && Meteor.connection) {
            return;
        }

        var snapshotLocals  = typeof Mongo   !== 'undefined' && new Mongo.Collection(null)._driver.noConnCollections;
        var snapshotTracker = typeof Tracker !== 'undefined' && Tracker.autorun;
        var snapshotActions = [
            {
                hook: function (run) {
                    this.observers = [];

                    var collections = Meteor.connection._mongo_livedata_collections;
                    if (collections) {
                        Object.keys(collections).forEach(function (collection) {
                            collections[collection].find({}, { transform: null }).observe({
                                addedAt:   (doc,    index) => run(collection, ADD, { index: index, doc: doc }),
                                changedAt: (doc, _, index) => run(collection, CHA, { index: index, doc: doc }),
                                removedAt: (     _, index) => run(collection, REM, { index: index })
                            });
                        });
                    }

                    if (snapshotLocals) {
                        Object.keys(snapshotLocals).forEach(function (collection) {
                            snapshotLocals[collection].find({}, { transform: null }).observe({
                                addedAt:   (doc,    index) => run(collection, ADD, { index: index, doc: doc }),
                                changedAt: (doc, _, index) => run(collection, CHA, { index: index, doc: doc }),
                                removedAt: (     _, index) => run(collection, REM, { index: index })
                            });
                        });
                    }
                },

                stop: function () {
                    if (this.observers) {
                        this.observers.forEach(function (observer) {
                            observer.stop()
                        });

                        this.observers = [];
                    }
                },

                data: function (collection, action, options) {
                    if (collection) {
                        return {
                            type: action,
                            payload: {
                                snapshotTimestamp: Date.now(),
                                snapshotRequested: false,
                                snapshot: {
                                    collection: collection,
                                    options:    options
                                }
                            }
                        };
                    } else {
                        var snapshot = {};

                        var collections = Meteor.connection._mongo_livedata_collections;
                        if (collections) {
                            Object.keys(collections).forEach(function (collection) {
                                var docs = collections[collection]._docs._map;

                                snapshot[collection] = Object
                                    .keys(docs)
                                    .reduce((snapshot, _id) => snapshot.concat(docs[_id]), []);
                            });
                        }

                        if (snapshotLocals) {
                            Object.keys(snapshotLocals).forEach(function (collection) {
                                var docs = snapshotLocals[collection]._docs._map;

                                snapshot[collection] = Object
                                    .keys(docs)
                                    .reduce((snapshot, _id) => snapshot.concat(docs[_id]), []);
                            });
                        }

                        return {
                            type: SET,
                            payload: {
                                snapshotTimestamp: Date.now(),
                                snapshotRequested: false,
                                snapshot: snapshot
                            }
                        };
                    }
                }
            },
            {
                hook: function (run) {
                    if (snapshotTracker) {
                        var subscriptions = Meteor.connection._subscriptions;
                        if (subscriptions) {
                            this.computation = Tracker.autorun(function () {
                                Object.keys(subscriptions).forEach(function (subscription) {
                                    subscriptions[subscription].readyDeps.depend();
                                });

                                Tracker.afterFlush(run);
                            });
                        }
                    }

                    this.interval = setInterval(run, 1000);
                },

                stop: function () {
                    if (this.computation) {
                        this.computation.stop();
                        this.computation = undefined;
                    }

                    if (this.interval) {
                        clearInterval(this.interval);
                        this.interval = undefined;
                    }
                },

                data: function () {
                    var subscriptions = Meteor.connection._subscriptions;
                    if (subscriptions) {
                        subscriptions = Object
                            .keys(subscriptions)
                            .reduce(function (snapshot, subscription) {
                                snapshot[subscription] = {
                                    name:   subscriptions[subscription].name,
                                    ready:  subscriptions[subscription].ready,
                                    params: subscriptions[subscription].params
                                };

                                return snapshot;
                            }, {});
                    } else {
                        subscriptions = {};
                    }

                    return {
                        type: SET,
                        payload: {
                            subscriptions: subscriptions
                        }
                    };
                }
            }
        ];

        var snapshotActionsRun = function (once) {
            snapshotActions.forEach(function (action) {
                var send = function () {
                    var data = action.data.apply(undefined, arguments);
                    if (data) {
                        window.postMessage({
                            process: true,
                            message: JSON.stringify(data)
                        }, '*');
                    }
                };

                if (!once && action.hook) {
                    action.hook(send);
                } else {
                    send();
                }
            });
        };

        var snapshotActionsStop = function () {
            snapshotActions.forEach(function (action) {
                if (action.stop) {
                    action.stop();
                }
            });
        };

        var onMessage = function (event) {
            if (event.data) {
                switch (event.data.type) {
                    case DEL:
                        snapshotActionsStop();
                    break;

                    case NEW:
                        if (event.data.payload.isReactive) {
                            snapshotActionsStop();
                            snapshotActionsRun();
                        }

                        snapshotActionsRun(true);
                    break;

                    case SET:
                        event.data.payload.isReactive === true  && snapshotActionsRun();
                        event.data.payload.isReactive === false && snapshotActionsStop();
                        event.data.payload.snapshotRequested && snapshotActionsRun(true);
                    break;
                }
            }
        };

        window.addEventListener('message', onMessage, false);
    };

    if (document.readyState === 'complete') {
        initialize();
    } else {
        document.addEventListener('DOMContentLoaded', initialize, false);
    }
} + `)('${ADD}', '${CHA}', '${DEL}', '${NEW}', '${REM}', '${SET}')`;
