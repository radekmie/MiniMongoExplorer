document.addEventListener('DOMContentLoaded', function () {
    function parse (serialized) {
        return JSON.parse(serialized, function (key, value) {
            if (typeof value === 'string') {
                var iso = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/.exec(value);
                if (iso) {
                    return new Date(value);
                }
            }

            return value;
        });
    }

    chrome.runtime.onMessage.addListener(function (message) {
        if (message && message.type === 'MiniMongoExplorer::serialized') {
            window.MiniMongoExplorer(parse(message.data));
        }
    });

    chrome.tabs.query({ active: true, lastFocusedWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { type: 'MiniMongoExplorer::request' });
    });
});
