import React         from 'react';
import { PropTypes } from 'react';

import translations from '../translations/en';

const Sidebar = ({ collections, onTabOpen }) =>
    <section className="pane-sm sidebar">
        <section className="nav-group nav-group-sm">
            <h1 className="nav-group-title">
                {translations.ui.collections}
            </h1>

            {collections.map(collection =>
                <a key={collection.name} onClick={() => onTabOpen(collection.name)} className="nav-group-item">
                    <span className="pull-left">{collection.name}</span>
                    <span className="pull-right">{collection.count}</span>
                </a>
            )}
        </section>
    </section>
;

Sidebar.propTypes = {
    collections: PropTypes.array.isRequired,
    onTabOpen:   PropTypes.func.isRequired
};

export default Sidebar;
