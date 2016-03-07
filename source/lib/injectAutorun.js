import inject from './inject';
export default inject(`
    (function () {
        if (typeof Meteor                             === 'undefined' ||
            typeof Tracker                            === 'undefined' ||
            typeof Tracker._computations              === 'undefined' ||
            typeof Tracker._computations.__explorer__ !== 'undefined') {
            return;
        }

        Tracker._computations.__explorer__ = true;

        var computation;
        var autorun = function () {
            if (computation) {
                computation.stop();
                computation = null;
            }

            computation = Tracker.autorun(function () {
                var collections = Meteor.connection._mongo_livedata_collections;
                if (collections) {
                    Object.keys(collections).forEach(function (collection) {
                        collections[collection].find({}, { tranform: null }).fetch();
                    });

                    Tracker.afterFlush(function () {
                        window.postMessage({ __timestamp__: Date.now() }, '*');
                    });
                }
            });
        };

        window.addEventListener('message', function (event) {
            if (event.data) {
                if (event.data.__autorun__ === true) {
                    autorun();
                }

                if (event.data.__autorun__ === false) {
                    computation.stop();
                    computation = null;
                }
            }
        }, false);
    })()
`);