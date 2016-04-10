import React         from 'react';
import { Component } from 'react';
import { PropTypes } from 'react';

import safeDocumentSorter    from '../lib/safeDocumentSorter';
import safeDocumentMatcher   from '../lib/safeDocumentMatcher';
import safeDocumentProjector from '../lib/safeDocumentProjector';

import Help    from './Help';
import View    from './View';
import Query   from './Query';
import Table   from './Table';
import Result  from './Result';
import Sidebar from './Sidebar';
import Toolbar from './Toolbar';

export default class MiniMongoExplorer extends Component {
    static propTypes = {
        tab:  PropTypes.number.isRequired,
        tabs: PropTypes.arrayOf(PropTypes.shape({
            error: PropTypes.bool.isRequired,
            query: PropTypes.string.isRequired,

            count:  PropTypes.number.isRequired,
            result: PropTypes.object.isRequired,

            id:         PropTypes.number.isRequired,
            collection: PropTypes.string.isRequired
        })).isRequired,

        dispatch: PropTypes.func.isRequired,

        isReactive:       PropTypes.bool.isRequired,
        isTextMode:       PropTypes.bool.isRequired,
        isHelpVisible:    PropTypes.bool.isRequired,
        isTableVisible:   PropTypes.bool.isRequired,
        isSidebarVisible: PropTypes.bool.isRequired,

        subscriptions: PropTypes.object.isRequired,

        snapshot:          PropTypes.object.isRequired,
        snapshotTimestamp: PropTypes.number.isRequired,
        snapshotRequested: PropTypes.bool.isRequired
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
                    {this.props.isSidebarVisible &&
                        <Sidebar collections={this.getCollections()} onTabOpen={this.onTabOpen} />
                    }

                    {this.props.isHelpVisible
                        ? <Help />
                        : this.props.isTableVisible
                            ? <Table data={this.props.subscriptions} />
                            : (
                                <View tab={this.props.tab} tabs={this.props.tabs} onTabClose={this.onTabClose} onTabSelect={this.onTabSelect}>
                                    {this.getTab() && <Query error={this.getTab().error} query={this.getTab().query} onQuery={this.onQuery} />}
                                    {this.getTab() && <Result data={this.getTab().result} isTextMode={this.props.isTextMode} />}
                                </View>
                            )
                    }
                </section>
            </section>

            <Toolbar isHelpVisible={this.props.isHelpVisible}
                     isReactive={this.props.isReactive}
                     isSidebarVisible={this.props.isSidebarVisible}
                     isTableVisible={this.props.isTableVisible}
                     isTextMode={this.props.isTextMode}
                     onRefresh={this.onRefresh}
                     onTabClose={this.onTabClose}
                     onToggleHelp={this.onToggleHelp}
                     onToggleReactivity={this.onToggleReactivity}
                     onToggleSidebar={this.onToggleSidebar}
                     onToggleTable={this.onToggleTable}
                     onToggleTextMode={this.onToggleTextMode}
            />
        </section>
    ;



    getCollections = () =>
        Object.keys(this.props.snapshot)
            .sort((a, b) => a.localeCompare(b))
            .map(collection => ({ name: collection, count: Object.keys(this.props.snapshot[collection]).length }));
    ;

    getId = doc =>
        doc._id
            ? typeof doc._id === 'string'
                ? doc._id
                : doc._id._str
            : `noID#${Math.random().toFixed(15).slice(2)}`
    ;

    getResult = (collection, query = '{query: {}, fields: {}, sort: {}}', snapshot = this.props.snapshot) => {
        let sorter    = safeDocumentSorter(query);
        let matcher   = safeDocumentMatcher(query);
        let projector = safeDocumentProjector(query);

        let documentsArray = Object.keys(snapshot[collection])
            .map(_id => snapshot[collection][_id])
            .filter(matcher.action)
            .sort(sorter.action)
            .map(projector.action);

        return {
            collection,

            query,
            error: sorter.error || matcher.error || projector.error,

            count:  documentsArray.length,
            result: documentsArray.reduce((result, doc) => ({ ...result, [this.getId(doc)]: doc }), {})
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
            isHelpVisible:  false,
            isTableVisible: false
        })
    };

    onTabSelect = id =>
        this.props.dispatch({
            tab: id
        })
    ;

    onToggleHelp = previous =>
        this.props.dispatch({
            isHelpVisible: !previous,
            isTableVisible: false
        })
    ;

    onToggleReactivity = previous =>
        this.props.dispatch({
            isReactive: !previous
        })
    ;

    onToggleSidebar = previous =>
        this.props.dispatch({
            isSidebarVisible: !previous
        })
    ;

    onToggleTable = previous =>
        this.props.dispatch({
            isHelpVisible: false,
            isTableVisible: !previous
        })
    ;

    onToggleTextMode = previous =>
        this.props.dispatch({
            isTextMode: !previous
        })
    ;
}
