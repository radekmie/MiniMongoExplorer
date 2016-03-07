import sift            from 'sift';
import React           from 'react';
import ObjectInspector from 'react-object-inspector';

import translations from '../lib/translations';

export default class MiniMongoExplorer extends React.Component {
    static propTypes = {
        refresh:   React.PropTypes.func.isRequired,
        reactive:  React.PropTypes.func.isRequired,
        minimongo: React.PropTypes.object.isRequired
    };



    state = {
        tab:  -1,
        tabs: [],

        isReactive: false,
        isTextMode: false,
        isHelpVisible: true,
        isSidebarVisible: true
    };



    componentWillReceiveProps = ({ minimongo }) =>
        this.setState({
            tabs: this.state.tabs.map(tab =>
                ({ ...tab, ...this.getResult(tab.collection, tab.query, minimongo) })
            )
        });
    ;



    render = () =>
        <section className="window">
            <section className="window-content">
                <section className="pane-group">
                    {this.renderSidebar()}

                    {this.state.isHelpVisible
                        ? this.renderHelp()
                        : this.renderView()
                    }
                </section>
            </section>

            {this.renderToolbar()}
        </section>
    ;

    renderHelp = () =>
        <section className="pane">
            <section className="pane-group">
                <section className="pane pane-center pane-flex">
                    <section className="nav-group">
                        <span className="nav-group-item"><i className="icon icon-left" /> {translations.sidebar.hide}</span>
                        <span className="nav-group-item"><i className="icon icon-right" /> {translations.sidebar.show}</span>
                        <span className="nav-group-item"><i className="icon icon-play" /> {translations.reactivity.enable}</span>
                        <span className="nav-group-item"><i className="icon icon-stop" /> {translations.reactivity.disable}</span>
                        <span className="nav-group-item"><i className="icon icon-lifebuoy" /> {translations.help.toggle}</span>
                        <span className="nav-group-item"><i className="icon icon-quote" /> {translations.text.enable}</span>
                        <span className="nav-group-item"><i className="icon icon-newspaper" /> {translations.text.disable}</span>
                        <span className="nav-group-item"><i className="icon icon-arrows-ccw" /> {translations.ui.refresh}</span>
                        <span className="nav-group-item"><i className="icon icon-cancel" /> {translations.ui.closeAll}</span>
                    </section>
                </section>
            </section>
        </section>
    ;

    renderQuery = () =>
        <textarea className={`form-control${this.getTab().error ? ' form-error' : ''}`} spellCheck={false} rows="1" value={this.getTab().query} onChange={event => this.onQuery(event.currentTarget.value)} />
    ;

    renderResult = () =>
        <section className="pane-scroll">
            {this.state.isTextMode
                ? <pre dangerouslySetInnerHTML={{ __html: JSON.stringify(this.getTab().result, null, 4).replace(/[\u00A0-\u9999<>\&]/gim, char => `&#${char.charCodeAt(0)};`) }} />
                : <ObjectInspector key={this.state.tab} initialExpandedPaths={['root']} data={this.getTab().result} />
            }
        </section>
    ;

    renderSidebar = () =>
        this.state.isSidebarVisible &&
            <section className="pane-sm sidebar">
                <section className="nav-group nav-group-sm">
                    <h1 className="nav-group-title">
                        {translations.ui.collections}
                    </h1>

                    {this.getCollections().map(collection =>
                        <a key={collection.name} onClick={() => this.onTabOpen(collection.name)} className="nav-group-item">
                            <span className="pull-left"  dangerouslySetInnerHTML={{ __html: collection.name }}/>
                            <span className="pull-right" dangerouslySetInnerHTML={{ __html: collection.count }}/>
                        </a>
                    )}
                </section>
            </section>
    ;

    renderToolbar = () =>
        <section className="toolbar toolbar-footer">
            <section className="toolbar-actions">
                <section className="btn-group">
                    <button className="btn btn-default btn-mini" onClick={() => this.onToggleSidebar(this.state.isSidebarVisible)} title={this.state.isSidebarVisible ? translations.sidebar.hide : translations.sidebar.show}>
                        <i className={`icon icon-${this.state.isSidebarVisible ? 'left' : 'right'}`} />
                    </button>

                    <button className="btn btn-default btn-mini" onClick={() => this.onToggleReactivity(this.state.isReactive)} title={this.state.isReactive ? translations.reactivity.disable : translations.reactivity.enable}>
                        <i className={`icon icon-${this.state.isReactive ? 'stop' : 'play'}`} />
                    </button>

                    <button className="btn btn-default btn-mini" onClick={() => this.onToggleTextMode(this.state.isTextMode)} title={this.state.isTextMode ? translations.text.disable : translations.text.enable}>
                        <i className={`icon icon-${this.state.isTextMode ? 'newspaper' : 'quote'}`} />
                    </button>

                    <button className="btn btn-default btn-mini" onClick={() => this.props.refresh()} title={translations.ui.refresh}>
                        <i className="icon icon-arrows-ccw" />
                    </button>

                    <button className="btn btn-default btn-mini" onClick={() => this.onTabClose()} title={translations.ui.closeAll}>
                        <i className="icon icon-cancel" />
                    </button>
                </section>

                <a className="btn btn-default btn-mini pull-right" target="_blank" href="https://github.com/radekmie/MiniMongoExplorer" title="MiniMongoExplorer on GitHub">
                    <i className="icon icon-github" />
                </a>

                <button className={`btn btn-default btn-mini pull-right${this.state.isHelpVisible ? ' active' : ''}`} onClick={() => this.onToggleHelp(this.state.isHelpVisible)} title={translations.help.toggle}>
                    <i className="icon icon-lifebuoy" />
                </button>
            </section>
        </section>
    ;

    renderView = () =>
        <section className="pane pane-flex">
            {this.state.tabs.length > 0 &&
                <section className="tab-group">
                    {this.state.tabs.map(tab =>
                        <section key={tab.id} className={`tab-item${tab.id === this.state.tab ? ' active' : ''}`} onClick={() => this.onTabSelect(tab.id)}>
                            <i className="icon icon-cancel icon-close-tab" onClick={() => this.onTabClose(tab.id)} />
                            {tab.collection}
                            {tab.count}
                        </section>
                    )}
                </section>
            }

            {this.getTab() && this.renderQuery()}
            {this.getTab() && this.renderResult()}
        </section>
    ;



    getCollections = () =>
        Object.keys(this.props.minimongo)
            .sort()
            .map(collection => ({ name: collection, count: Object.keys(this.props.minimongo[collection]).length }));
    ;

    getResult = (collection, query = '{}', minimongo = this.props.minimongo) => {
        let error = false;
        let documentsArray = Object
            .keys(minimongo[collection])
            .sort()
            .map(_id => minimongo[collection][_id]);

        try {
            documentsArray = sift(eval(`(${query})`), documentsArray);
        } catch (_) {
            error = true;
        }

        return {
            error,
            query,
            collection,
            count:  documentsArray.length,
            result: documentsArray.reduce((result, doc) => ({ ...result, [doc._id]: doc }), {})
        };
    };

    getTab = () =>
        this.state.tabs.filter(tab => tab.id === this.state.tab)[0]
    ;



    onQuery = query =>
        this.setState({
            tabs: this.state.tabs
                .filter(tab => tab.id === this.state.tab)
                .map(tab => ({ ...tab, ...this.getResult(tab.collection, query) }))
        })
    ;

    onTabClose = id =>
        this.setState({
            tab:  id ? this.state.tab === id ? -1 : this.state.tab  : -1,
            tabs: id ? this.state.tabs.filter(tab => tab.id !== id) : []
        })
    ;

    onTabOpen = collection =>
        this.setState({
            tabs: this.state.tabs.concat({ id: Date.now(), ...this.getResult(collection) })
        }, () =>
            this.setState({
                tab: this.state.tabs[this.state.tabs.length - 1].id,
                isHelpVisible: false
            })
        )
    ;

    onTabSelect = id =>
        this.setState({
            tab: id
        })
    ;

    onToggleHelp = previous =>
        this.setState({
            isHelpVisible: !previous
        })
    ;

    onToggleReactivity = previous =>
        this.setState({
            isReactive: !previous
        }, () =>
            this.props.reactive(!previous)
        )
    ;

    onToggleSidebar = previous =>
        this.setState({
            isSidebarVisible: !previous
        })
    ;

    onToggleTextMode = previous =>
        this.setState({
            isTextMode: !previous
        })
    ;
}
