'use strict';

var connections = [];

chrome.runtime.onConnect.addListener(function (port) {
    var listener = function (message) {
        if (message.name === '__devtools__') {
            connections.push({
                port: port,
                tabId: message.tabId
            });
        }

        if (message.__autorun__ !== undefined) {
            chrome.tabs.sendMessage(message.tabId, message);
        }
    };

    port.onMessage.addListener(listener);
    port.onDisconnect.addListener(function (port) {
        port.onMessage.removeListener(listener);

        connections
            .filter(function (connection) { return connection.port === port; })
            .map(function (connection) { chrome.tabs.sendMessage(connection.tabId, { __autorun__: false }); });

        connections = connections.filter(function (connection) { return connection.port !== port; });
    });
});

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (sender.tab) {
        if (connections.some(function (connection) { return connection.tabId === sender.tab.id; })) {
            connections
                .filter (function (connection) { return connection.tabId === sender.tab.id; })
                .forEach(function (connection) { connection.port.postMessage(message); });
            sendResponse(false);
        } else {
            sendResponse(true);
        }
    }

    return true;
});
