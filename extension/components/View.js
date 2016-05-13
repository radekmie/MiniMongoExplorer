import React         from 'react';
import { PropTypes } from 'react';

const View = ({ children, tab, tabs, onTabClose, onTabSelect }) =>
    <section className="pane pane-flex">
        {tabs.length > 0 &&
            <section className="tab-group">
                {tabs.map(({ collection, count, id }) =>
                    <section
                        className={`tab-item${id === tab ? ' active' : ''}`}
                        key={id}
                        onClick={event => (event.button == 1 ? onTabClose : onTabSelect)(id)}
                    >
                        <i className="icon icon-cancel icon-close-tab" onClick={event => (event.stopPropagation(), onTabClose(id))} />
                        {collection}

                        <span>
                            {count}
                        </span>
                    </section>
                )}
            </section>
        }

        {children}
    </section>
;

View.propTypes = {
    children:    PropTypes.node,
    onTabClose:  PropTypes.func.isRequired,
    onTabSelect: PropTypes.func.isRequired,
    tab:         PropTypes.number.isRequired,
    tabs:        PropTypes.array.isRequired
};

export default View;
