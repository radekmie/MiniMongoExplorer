import React         from 'react';
import { Component } from 'react';
import { PropTypes } from 'react';

import safeDocumentSorter    from '../lib/safeDocumentSorter';
import safeDocumentMatcher   from '../lib/safeDocumentMatcher';
import safeDocumentProjector from '../lib/safeDocumentProjector';

import Help          from './Help';
import View          from './View';
import Query         from './Query';
import Result        from './Result';
import Methods       from './Methods';
import Sidebar       from './Sidebar';
import Toolbar       from './Toolbar';
import Subscriptions from './Subscriptions';

export default class MiniMongoExplorer extends Component {
    static propTypes = {
        tab:  PropTypes.number.isRequired,
        tabs: PropTypes.arrayOf(PropTypes.shape({
            collection: PropTypes.string.isRequired,
            count:      PropTypes.number.isRequired,
            error:      PropTypes.bool.isRequired,
            id:         PropTypes.number.isRequired,
            query:      PropTypes.string.isRequired,
            result:     PropTypes.object.isRequired
        })).isRequired,

        dispatch: PropTypes.func.isRequired,

        isHelpView:          PropTypes.bool.isRequired,
        isMethodsView:       PropTypes.bool.isRequired,
        isReactive:          PropTypes.bool.isRequired,
        isSidebarView:       PropTypes.bool.isRequired,
        isSubscriptionsView: PropTypes.bool.isRequired,

        methods: PropTypes.arrayOf(PropTypes.string).isRequired,

        mode: PropTypes.number.isRequired,

        snapshot:          PropTypes.object.isRequired,
        snapshotRequested: PropTypes.bool.isRequired,
        snapshotTimestamp: PropTypes.number.isRequired,

        subscriptions: PropTypes.object.isRequired
    };



    componentWillReceiveProps = ({ snapshot, snapshotTimestamp }) => {
        if (this.props.snapshotTimestamp < snapshotTimestamp) {
            this.props.dispatch({
                tabs: this.props.tabs.map(tab =>
                    ({ ...tab, ...this.getResult(tab.collection, tab.query, snapshot) })
                )
            });
        }
    };



    render = () =>
        <section className="window">
            <section className="window-content">
                <section className="pane-group">
                    {this.props.isSidebarView && (
                        <Sidebar collections={this.getCollections()} onTabOpen={this.onTabOpen} />
                    )}

                    {this.props.isHelpView
                        ? <Help />
                        : this.props.isSubscriptionsView
                            ? <Subscriptions data={this.props.subscriptions} />
                            : this.props.isMethodsView
                                ? <Methods methods={this.props.methods} />
                                : (tab =>
                                    <View
                                        onTabClose={this.onTabClose}
                                        onTabSelect={this.onTabSelect}
                                        tab={this.props.tab}
                                        tabs={this.props.tabs}
                                    >
                                        {tab && (
                                            <Query error={tab.error} query={tab.query} onQuery={this.onQuery} />
                                        )}

                                        {tab && (
                                            <Result data={tab.result} mode={this.props.mode} />
                                        )}
                                    </View>
                                )(this.getTab())
                    }
                </section>
            </section>

            <Toolbar
                isHelpView={this.props.isHelpView}
                isMethodsView={this.props.isMethodsView}
                isReactive={this.props.isReactive}
                isSidebarView={this.props.isSidebarView}
                isSubscriptionsView={this.props.isSubscriptionsView}
                mode={this.props.mode}
                onRefresh={this.onRefresh}
                onTabClose={this.onTabClose}
                onToggleHelp={this.onToggleHelp}
                onToggleMethods={this.onToggleMethods}
                onToggleMode={this.onToggleMode}
                onToggleReactivity={this.onToggleReactivity}
                onToggleSidebar={this.onToggleSidebar}
                onToggleSubscriptions={this.onToggleSubscriptions}
            />
        </section>
    ;



    getCollections = () =>
        Object.keys(this.props.snapshot).sort().map(collection => ({
            name: collection,
            count: Object.keys(this.props.snapshot[collection]).length
        }));
    ;

    getId = doc =>
        doc._id
            ? typeof doc._id === 'string'
                ? doc._id
                : doc._id._str
            : `noID#${Math.random().toFixed(15).slice(2)}`
    ;

    getResult = (collection, query = '{query: {}, fields: {}, sort: {}, limit: 50}', snapshot = this.props.snapshot) => {
        let limit;
        let error;
        let sorter    = safeDocumentSorter(query);
        let matcher   = safeDocumentMatcher(query);
        let projector = safeDocumentProjector(query);

        try {
            let parsed = eval(`(${query})`);
            if (parsed && parsed.limit !== undefined) {
                error = parsed.limit < 0;
                limit = Math.max(0, parsed.limit);
            }
        } catch (_) {
            limit = 50;
            error = true;
        }

        let documentsArray = Object.keys(snapshot[collection])
            .map(_id => snapshot[collection][_id])
            .filter(matcher.action)
            .sort(sorter.action)
        ;

        return {
            collection,

            query,
            error: error || sorter.error || matcher.error || projector.error,

            count:  documentsArray.length,
            result: documentsArray
                .slice(0, limit)
                .map(projector.action)
                .reduce((result, doc) => ({ ...result, [this.getId(doc)]: doc }), {})
        };
    };

    getTab = () =>
        this.props.tabs.filter(tab => tab.id === this.props.tab)[0]
    ;



    onQuery = query =>
        this.props.dispatch({
            tabs: this.props.tabs.map(tab =>
                tab.id === this.props.tab
                    ? ({ ...tab, ...this.getResult(tab.collection, query) })
                    : tab
            )
        })
    ;

    onRefresh = () =>
        this.props.dispatch({
            snapshotRequested: true
        });
    ;

    onTabClose = id =>
        this.props.dispatch({
            tab:  id === -1 ? -1 : this.props.tab === id ? -1 : this.props.tab,
            tabs: id === -1 ? [] : this.props.tabs.filter(tab => tab.id !== id)
        })
    ;

    onTabOpen = collection => {
        const id = Date.now();

        this.props.dispatch({
            tab:  id,
            tabs: this.props.tabs.concat({ id, ...this.getResult(collection) }),
            isHelpView:  false,
            isMethodsView: false,
            isSubscriptionsView: false
        });
    };

    onTabSelect = id =>
        this.props.dispatch({
            tab: id
        })
    ;

    onToggleHelp = previous =>
        this.props.dispatch({
            isHelpView: !previous,
            isMethodsView: false,
            isSubscriptionsView: false
        })
    ;

    onToggleMethods = previous =>
        this.props.dispatch({
            isHelpView: false,
            isMethodsView: !previous,
            isSubscriptionsView: false
        })
    ;

    onToggleMode = previous =>
        this.props.dispatch({
            mode: (previous + 1) % 3
        })
    ;

    onToggleReactivity = previous =>
        this.props.dispatch({
            isReactive: !previous
        })
    ;

    onToggleSidebar = previous =>
        this.props.dispatch({
            isSidebarView: !previous
        })
    ;

    onToggleSubscriptions = previous =>
        this.props.dispatch({
            isHelpView: false,
            isMethodsView: false,
            isSubscriptionsView: !previous
        })
    ;
}
