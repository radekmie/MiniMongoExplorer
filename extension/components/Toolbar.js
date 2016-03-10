import React         from 'react';
import { PropTypes } from 'react';

import translations from '../translations/en';

const Toolbar = ({ isHelpVisible, isReactive, isSidebarVisible, isTextMode, onRefresh, onTabClose, onToggleHelp, onToggleReactivity, onToggleSidebar, onToggleTextMode }) =>
    <section className="toolbar toolbar-footer">
        <section className="toolbar-actions">
            <section className="btn-group">
                <button className="btn btn-default btn-mini" onClick={() => onToggleSidebar(isSidebarVisible)} title={isSidebarVisible ? translations.sidebar.hide : translations.sidebar.show}>
                    <i className={`icon icon-${isSidebarVisible ? 'left' : 'right'}`} />
                </button>

                <button className="btn btn-default btn-mini" onClick={() => onToggleReactivity(isReactive)} title={isReactive ? translations.reactivity.disable : translations.reactivity.enable}>
                    <i className={`icon icon-${isReactive ? 'stop' : 'play'}`} />
                </button>

                <button className="btn btn-default btn-mini" onClick={() => onToggleTextMode(isTextMode)} title={isTextMode ? translations.text.disable : translations.text.enable}>
                    <i className={`icon icon-${isTextMode ? 'newspaper' : 'quote'}`} />
                </button>

                <button className="btn btn-default btn-mini" onClick={() => onRefresh()} title={translations.ui.refresh}>
                    <i className="icon icon-arrows-ccw" />
                </button>

                <button className="btn btn-default btn-mini" onClick={() => onTabClose()} title={translations.ui.close}>
                    <i className="icon icon-cancel" />
                </button>
            </section>

            <a className="btn btn-default btn-mini pull-right" target="_blank" href="https://github.com/radekmie/MiniMongoExplorer" title="MiniMongoExplorer on GitHub">
                <i className="icon icon-github" />
            </a>

            <button className={`btn btn-default btn-mini pull-right${isHelpVisible ? ' active' : ''}`} onClick={() => onToggleHelp(isHelpVisible)} title={translations.help.toggle}>
                <i className="icon icon-lifebuoy" />
            </button>
        </section>
    </section>
;

Toolbar.propTypes = {
    isHelpVisible:      PropTypes.bool.isRequired,
    isReactive:         PropTypes.bool.isRequired,
    isSidebarVisible:   PropTypes.bool.isRequired,
    isTextMode:         PropTypes.bool.isRequired,
    onRefresh:          PropTypes.func.isRequired,
    onTabClose:         PropTypes.func.isRequired,
    onToggleHelp:       PropTypes.func.isRequired,
    onToggleReactivity: PropTypes.func.isRequired,
    onToggleSidebar:    PropTypes.func.isRequired,
    onToggleTextMode:   PropTypes.func.isRequired
};

export default Toolbar;
