import { DEL, NEW, SET } from './reduxConstants';

export default '(' + function (DEL, NEW, SET) {
    if (typeof Meteor === 'undefined') {
        return;
    }

    var snapshotTracker = typeof Tracker !== 'undefined' && Tracker.autorun;
    var snapshotActions = [
        {
            hook: function (run) {
                if (snapshotTracker) {
                    this.computation = Tracker.autorun(function () {
                        var collections = Meteor.connection._mongo_livedata_collections;
                        if (collections) {
                            Object.keys(collections).forEach(function (collection) {
                                collections[collection].find({}, { tranform: null }).fetch();
                            });
                        }

                        Tracker.afterFlush(run);
                    });
                } else {
                    this.interval = setInterval(run, 1000);
                }
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
                var collections = Meteor.connection._mongo_livedata_collections;
                if (collections) {
                    return {
                        type: SET,
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
                    };
                }
            }
        },
        {
            hook: function (run) {
                if (snapshotTracker) {
                    this.computation = Tracker.autorun(function () {
                        var subscriptions = Meteor.connection._subscriptions;
                        if (subscriptions) {
                            Object.keys(subscriptions).forEach(function (subscription) {
                                subscriptions[subscription].readyDeps.depend();
                            });

                            Tracker.afterFlush(run);
                        }
                    });
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
                    return {
                        type: SET,
                        payload: {
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
                        }
                    };
                }
            }
        }
    ];

    var snapshotActionsRun = function (once) {
        snapshotActions.forEach(function (action) {
            var send = function () {
                var data = action.data();
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
                    window.removeEventListener('message', onMessage);
                break;

                case NEW:
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
} + `)('${DEL}', '${NEW}', '${SET}')`;
