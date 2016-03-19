chrome.runtime.onMessage.addListener(message => window.postMessage({ ...message, duplex: true }, '*'));

window.addEventListener('message', event => {
    if (event.source === window && event.data.duplex === undefined && event.data.payload && event.data.type) {
        chrome.runtime.sendMessage(event.data);
    }
});
