(function () {
    function injectCheck () {
        var event = new CustomEvent('MiniMongoExplorer::check', { detail: !!(window.Meteor && window.Meteor.release) });
        if (event) {
            document.dispatchEvent(event);
        }
    }

    function injectSerialize () {
        var collections = Meteor.connection._mongo_livedata_collections;
        if (collections) {
            collections = JSON.stringify(Object.keys(collections).reduce(function (minimongo, collection) {
                minimongo[collection] = collections[collection]._docs._map;

                return minimongo;
            }, {}));
        }

        var event = new CustomEvent('MiniMongoExplorer::serialized', { detail: collections || '{}' });
        if (event) {
            document.dispatchEvent(event);
        }
    }

    function inject (code) {
        var script = document.createElement('script');
        if (script) {
            script.async = true;
            script.defer = true;
            script.onload = function () {
                script.parentNode.removeChild(script);
            };

            script.text = '(' + code + ')()';
            document.head.appendChild(script);
        }
    }

    chrome.runtime.onMessage.addListener(function (message) {
        if (message && message.type === 'MiniMongoExplorer::request') {
            inject(injectSerialize);
        }
    });

    document.addEventListener('MiniMongoExplorer::serialized', function (event) {
        chrome.runtime.sendMessage({
            type: 'MiniMongoExplorer::serialized',
            data: event.detail
        });
    }, false);

    document.addEventListener('MiniMongoExplorer::check', function () {
        chrome.runtime.sendMessage({
            type: 'MiniMongoExplorer::action',
            data: event.detail
        });
    }, false);

    inject(injectCheck);
})();
