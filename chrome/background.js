import 'file?name=manifest.json!./manifest.json';
import 'file?name=images/icon16.png!../extension/assets/images/icon16.png';
import 'file?name=images/icon32.png!../extension/assets/images/icon32.png';
import 'file?name=images/icon64.png!../extension/assets/images/icon64.png';

import store   from '../extension/lib/reduxStore';
import { NEW } from '../extension/lib/reduxConstants';

chrome.runtime.onConnect.addListener(port => {
    let subscribe;
    let onMessage = message => {
        if (NEW === message.type) {
            subscribe = store.subscribe(() => {
                let state = store.getState()[message.payload.id];
                if (state) {
                    port.postMessage(state);
                }
            });
        }

        store.dispatch(message);

        chrome.tabs.sendMessage(message.payload.id, message);
    };

    port.onMessage.addListener(onMessage);
    port.onDisconnect.addListener(port => {
        port.onMessage.removeListener(onMessage);

        if (subscribe) {
            subscribe();
        }
    });
});

chrome.runtime.onMessage.addListener((message, sender) => {
    if (sender.tab && sender.tab.id) {
        store.dispatch({ type: message.type, payload: { ...message.payload, id: sender.tab.id } });
    }
});
