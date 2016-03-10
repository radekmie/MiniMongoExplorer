chrome.runtime.onMessage.addListener(message =>
    message.__autorun__ === undefined
        ? undefined
        : window.postMessage(message, '*')
);

window.addEventListener('message', event =>
    event.source === window && event.data.__timestamp__
        ? chrome.runtime.sendMessage(event.data, requestStop => requestStop && window.postMessage({ __autorun__: false }, '*'))
        : undefined
);
