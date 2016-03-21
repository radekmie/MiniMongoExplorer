import 'file?name=manifest.json!./manifest.json';
import 'file?name=images/icon16.png!../extension/assets/images/icon16.png';
import 'file?name=images/icon32.png!../extension/assets/images/icon32.png';
import 'file?name=images/icon64.png!../extension/assets/images/icon64.png';

import { NEW } from '../extension/lib/reduxConstants';

let sockets = {};

chrome.runtime.onConnect.addListener(port => {
    let onMessage = message => {
        if (NEW === message.type) {
            sockets[message.id] = port;
        }

        chrome.tabs.sendMessage(message.id, message);
    };

    port.onMessage.addListener(onMessage);
    port.onDisconnect.addListener(port => {
        port.onMessage.removeListener(onMessage);

        sockets = Object.keys(sockets)
            .filter(socket => sockets[socket] !== port)
            .reduce((a, b) => ({ ...a, [b]: sockets[b] }), {});
    });
});

chrome.runtime.onMessage.addListener((message, sender) => {
    if (sender.tab && sender.tab.id && sockets[sender.tab.id]) {
        sockets[sender.tab.id].postMessage(message);
    }
});
