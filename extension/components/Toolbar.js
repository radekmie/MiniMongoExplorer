import React         from 'react';
import { PropTypes } from 'react';

import translations from '../assets/translations/en';

const Toolbar = ({
    isHelpVisible,
    isReactive,
    isSidebarVisible,
    isTableVisible,
    mode,
    onRefresh,
    onTabClose,
    onToggleHelp,
    onToggleMode,
    onToggleReactivity,
    onToggleSidebar,
    onToggleTable
}) =>
    <section className="toolbar toolbar-footer">
        <section className="toolbar-actions">
            <section className="btn-group">
                <button
                    className="btn btn-default btn-mini"
                    onClick={() => onToggleSidebar(isSidebarVisible)}
                    title={isSidebarVisible ? translations.sidebar.hide : translations.sidebar.show}
                >
                    <i className={`icon icon-${isSidebarVisible ? 'left' : 'right'}`} />
                </button>

                <button
                    className="btn btn-default btn-mini"
                    onClick={() => onToggleReactivity(isReactive)}
                    title={isReactive ? translations.reactivity.disable : translations.reactivity.enable}
                >
                    <i className={`icon icon-${isReactive ? 'stop' : 'play'}`} />
                </button>

                <button
                    className="btn btn-default btn-mini"
                    onClick={() => onToggleMode(mode)}
                    title={translations.mode[mode]}
                >
                    <i className={`icon icon-${['newspaper', 'menu', 'quote'][mode]}`} />
                </button>

                <button
                    className="btn btn-default btn-mini"
                    onClick={() => onRefresh()}
                    title={translations.ui.refresh}
                >
                    <i className="icon icon-arrows-ccw" />
                </button>

                <button
                    className="btn btn-default btn-mini"
                    onClick={() => onTabClose(-1)}
                    title={translations.ui.close}
                >
                    <i className="icon icon-cancel" />
                </button>
            </section>

            <a
                className="btn btn-default btn-mini pull-right"
                href="https://github.com/radekmie/MiniMongoExplorer"
                target="_blank"
                title={translations.github}
            >
                <i className="icon icon-github" />
            </a>

            <button
                className={`btn btn-default btn-mini pull-right${isHelpVisible ? ' active' : ''}`}
                onClick={() => onToggleHelp(isHelpVisible)}
                title={translations.help.toggle}
            >
                <i className="icon icon-lifebuoy" />
            </button>

            <button
                className={`btn btn-default btn-mini pull-right${isTableVisible ? ' active' : ''}`}
                onClick={() => onToggleTable(isTableVisible)}
                title={translations.table.toggle}
            >
                <i className="icon icon-cloud-thunder" />
            </button>
        </section>
    </section>
;

Toolbar.propTypes = {
    isHelpVisible:      PropTypes.bool.isRequired,
    isReactive:         PropTypes.bool.isRequired,
    isSidebarVisible:   PropTypes.bool.isRequired,
    isTableVisible:     PropTypes.bool.isRequired,
    mode:               PropTypes.number.isRequired,
    onRefresh:          PropTypes.func.isRequired,
    onTabClose:         PropTypes.func.isRequired,
    onToggleHelp:       PropTypes.func.isRequired,
    onToggleMode:       PropTypes.func.isRequired,
    onToggleReactivity: PropTypes.func.isRequired,
    onToggleSidebar:    PropTypes.func.isRequired,
    onToggleTable:      PropTypes.func.isRequired
};

export default Toolbar;
