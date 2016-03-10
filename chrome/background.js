import 'file?name=manifest.json!./manifest.json';
import 'file?name=images/icon16.png!../images/icon16.png';
import 'file?name=images/icon32.png!../images/icon32.png';
import 'file?name=images/icon64.png!../images/icon64.png';

let connections = [];

chrome.runtime.onConnect.addListener(port => {
    let onMessage = message =>
        message.name === '__devtools__'
            ? connections.push({ port, tabId: message.tabId })
            : message.__autorun__ !== undefined
                ? chrome.tabs.sendMessage(message.tabId, message)
                : undefined
    ;

    port.onMessage.addListener(onMessage);
    port.onDisconnect.addListener(port => {
        port.onMessage.removeListener(onMessage);

        connections = connections.filter(connection =>
            connection.port === port
                ? (chrome.tabs.sendMessage(connection.tabId, { __autorun__: false }), false)
                : true
        );
    });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) =>
    sender.tab && sender.tab.id
        ? connections.some(connection => connection.tabId === sender.tab.id)
            ? (
                sendResponse(false),
                connections
                    .filter (connection => connection.tabId === sender.tab.id)
                    .forEach(connection => connection.port.postMessage(message))
            )
            : sendResponse(true)
        : undefined
);
