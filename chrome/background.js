chrome.tabs.onUpdated.addListener(function (_, change, tab) {
    if (tab.url && change.status === 'complete' &&
       (tab.url.indexOf('http://') === 0 || tab.url.indexOf('https://') === 0)
    ) {
        chrome.tabs.executeScript(tab.id, {
            file: 'inject.js'
        });
    }
});

chrome.runtime.onMessage.addListener(function (message, sender) {
    if (message && message.type === 'MiniMongoExplorer::action') {
        if (message.data) {
            chrome.pageAction.show(sender.tab.id);
        } else {
            chrome.pageAction.hide(sender.tab.id);
        }
    }
});
