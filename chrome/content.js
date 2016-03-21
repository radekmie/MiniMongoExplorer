chrome.runtime.onMessage.addListener(message => window.postMessage(message, '*'));

window.addEventListener('message', event => {
    if (event.source === window && event.data.message && event.data.process === true) {
        chrome.runtime.sendMessage(event.data.message);
    }
});
