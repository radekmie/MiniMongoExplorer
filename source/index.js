import { createElement } from 'react';
import { render }        from 'react-dom';

import injectAutorun from './lib/injectAutorun';
import injectFetcher from './lib/injectFetcher';

import MiniMongoExplorer from './components/MiniMongoExplorer';

document.addEventListener('DOMContentLoaded', () => {
    let port = chrome.runtime.connect({ name: '__devtools__' });
    if (port) {
        port.postMessage({ name: '__devtools__', tabId: chrome.devtools.inspectedWindow.tabId });
        port.onMessage.addListener(message => mount({ stamp: message.__timestamp__ }));

        let mount = props => render(
            createElement(
                MiniMongoExplorer,
                {
                    ...props,
                    fetch: injectFetcher,
                    autoOn:  () => port.postMessage({ __autorun__: true,  tabId: chrome.devtools.inspectedWindow.tabId }),
                    autoOff: () => port.postMessage({ __autorun__: false, tabId: chrome.devtools.inspectedWindow.tabId })
                }
            ),
            document.body
        );

        injectAutorun();
        mount({ stamp: Date.now() });
    }
});
