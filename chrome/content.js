chrome.runtime.onMessage.addListener(function (message) {
    if (message.__autorun__ !== undefined) {
        window.postMessage(message, '*');
    }
});

window.addEventListener('message', function (event) {
    if (event.source === window && event.data.__timestamp__) {
        chrome.runtime.sendMessage(event.data, function (requestStop) {
            if (requestStop) {
                window.postMessage({ __autorun__: false }, '*');
            }
        });
    }
}, false);
