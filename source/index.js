import { createElement } from 'react';
import { render }        from 'react-dom';

import injectAutorun from './lib/injectAutorun';
import injectFetcher from './lib/injectFetcher';

import MiniMongoExplorer from './components/MiniMongoExplorer';

document.addEventListener('DOMContentLoaded', () => {
    let port = chrome.runtime.connect({ name: '__devtools__' });
    if (port) {
        let fresh = false;
        let mount = minimongo =>
            render(
                createElement(
                    MiniMongoExplorer,
                    {
                        minimongo,
                        refresh:  () => injectFetcher(mount),
                        reactive: on => ((fresh = on), port.postMessage({ __autorun__: on,  tabId: chrome.devtools.inspectedWindow.tabId }))
                    }
                ),
                document.body
            )
        ;

        port.postMessage({ name: '__devtools__', tabId: chrome.devtools.inspectedWindow.tabId });
        port.onMessage.addListener(() => fresh && injectFetcher(mount));

        injectAutorun();
        injectFetcher(mount);
    }
});
