import { createElement } from 'react';
import { render }        from 'react-dom';

import inject            from '../extension/lib/inject';
import create            from '../extension/lib/reduxState';
import { DEL, NEW, SET } from '../extension/lib/reduxConstants';

import MiniMongoExplorer from '../extension/components/MiniMongoExplorer';

document.addEventListener('DOMContentLoaded', () => {
    let port = chrome.runtime.connect();
    if (port) {
        let dispatch = diff => port.postMessage({ type: SET, payload: { id: chrome.devtools.inspectedWindow.tabId, ...diff } });
        let mount = state => render(createElement(MiniMongoExplorer, { dispatch, ...state }), document.body);

        chrome.devtools.inspectedWindow.eval(inject, () => {
            port.onMessage.addListener(mount);
            port.postMessage({ type: NEW, payload: { id: chrome.devtools.inspectedWindow.tabId, ...create() } });
        });

        window.addEventListener('beforeunload', () => {
            port.postMessage({ type: DEL, payload: { id: chrome.devtools.inspectedWindow.tabId } });
            port.disconnect();
        });
    }
});
