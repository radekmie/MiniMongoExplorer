import { createElement } from 'react';
import { render }        from 'react-dom';

import ready             from '../extension/lib/ready';
import inject            from '../extension/lib/inject';
import create            from '../extension/lib/reduxState';
import store             from '../extension/lib/reduxStore';
import parse             from '../extension/lib/injectParse';
import { DEL, NEW, SET } from '../extension/lib/reduxConstants';

import MiniMongoExplorer from '../extension/components/MiniMongoExplorer';

document.addEventListener('DOMContentLoaded', () => {
    let port = chrome.runtime.connect();
    if (port) {
        let dispatch = payload => {
            store.dispatch   ({ type: SET, payload });
            port .postMessage({ type: SET, payload, id: chrome.devtools.inspectedWindow.tabId });
        };

        let renderId;
        let renderDirect    = () => render(createElement(MiniMongoExplorer, { dispatch, ...store.getState() }), document.body);
        let renderThrottled = () => {
            if (renderId) {
                cancelAnimationFrame(renderId);
            }

            renderId = requestAnimationFrame(renderDirect);
        };

        store.subscribe(renderThrottled);

        var initialize = refresh => {
            let payload = refresh ? store.getState() : create();
            if (payload) {
                store.dispatch   ({ type: NEW, payload });
                port .postMessage({ type: NEW, payload, id: chrome.devtools.inspectedWindow.tabId });
            }
        };

        var connect = initialized => chrome.devtools.inspectedWindow.eval(inject, () => {
            port.onMessage.addListener(message => store.dispatch(parse(message)));

            let retry = () => chrome.devtools.inspectedWindow.eval(ready, loaded => {
                if (loaded) {
                    initialize(initialized);
                } else {
                    setTimeout(retry, 100);
                }
            });

            retry();
        });

        chrome.devtools.network.onNavigated.addListener(connect);
        connect();

        window.addEventListener('beforeunload', () => {
            port.postMessage({ type: DEL, id: chrome.devtools.inspectedWindow.tabId });
            port.disconnect();
        });
    }
});
