import { createElement } from 'react';
import { render }        from 'react-dom';

import MiniMongoExplorer from './components/MiniMongoExplorer';

window.MiniMongoExplorer = minimongo =>
    render(createElement(MiniMongoExplorer, { minimongo }), document.body)
;
