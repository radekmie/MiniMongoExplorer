import React         from 'react';
import { Component } from 'react';
import { PropTypes } from 'react';

import safeDocumentSorter  from '../lib/safeDocumentSorter';
import safeDocumentMatcher from '../lib/safeDocumentMatcher';

import Help    from './Help';
import View    from './View';
import Query   from './Query';
import Result  from './Result';
import Sidebar from './Sidebar';
import Toolbar from './Toolbar';

export default class MiniMongoExplorer extends Component {
    static propTypes = {
        refresh:   PropTypes.func.isRequired,
        reactive:  PropTypes.func.isRequired,
        minimongo: PropTypes.object.isRequired
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
                ({ ...tab, ...this.getResult(tab.collection, tab.query, tab.sort, minimongo) })
            )
        });
    ;



    render = () =>
        <section className="window">
            <section className="window-content">
                <section className="pane-group">
                    {this.state.isSidebarVisible &&
                        <Sidebar collections={this.getCollections()} onTabOpen={this.onTabOpen} />
                    }

                    {this.state.isHelpVisible
                        ? <Help />
                        : (
                            <View tab={this.state.tab} tabs={this.state.tabs} onTabClose={this.onTabClose} onTabSelect={this.onTabSelect}>
                                {this.getTab() && <Query tab={this.getTab()} onQuery={this.onQuery} onSort={this.onSort} />}
                                {this.getTab() && <Result data={this.getTab().result} isTextMode={this.state.isTextMode} />}
                            </View>
                        )
                    }
                </section>
            </section>

            <Toolbar isHelpVisible={this.state.isHelpVisible}
                     isReactive={this.state.isReactive}
                     isSidebarVisible={this.state.isSidebarVisible}
                     isTextMode={this.state.isTextMode}
                     onRefresh={this.props.refresh}
                     onTabClose={this.onTabClose}
                     onToggleHelp={this.onToggleHelp}
                     onToggleReactivity={this.onToggleReactivity}
                     onToggleSidebar={this.onToggleSidebar}
                     onToggleTextMode={this.onToggleTextMode}
            />
        </section>
    ;



    getCollections = () =>
        Object.keys(this.props.minimongo)
            .sort()
            .map(collection => ({ name: collection, count: Object.keys(this.props.minimongo[collection]).length }));
    ;

    getId = doc =>
        typeof doc._id === 'string'
            ? doc._id
            : doc._id._str
    ;

    getResult = (collection, query = '{}', sort = '{}', minimongo = this.props.minimongo) => {
        let sorter  = safeDocumentSorter(sort);
        let matcher = safeDocumentMatcher(query);

        let documentsArray = Object.keys(minimongo[collection])
            .map(_id => minimongo[collection][_id])
            .filter(matcher.match)
            .sort(sorter.match);

        return {
            collection,

            sort:  sorter.text,
            query: matcher.text,

            errorSort:  sorter.error,
            errorQuery: matcher.error,

            count:  documentsArray.length,
            result: documentsArray.reduce((result, doc) => ({ ...result, [this.getId(doc)]: doc }), {})
        };
    };

    getTab = () =>
        this.state.tabs.filter(tab => tab.id === this.state.tab)[0]
    ;



    onQuery = query =>
        this.setState({
            tabs: this.state.tabs.map(tab =>
                tab.id === this.state.tab
                    ? ({ ...tab, ...this.getResult(tab.collection, query, tab.sort) })
                    : tab
            )
        })
    ;

    onSort = sort =>
        this.setState({
            tabs: this.state.tabs.map(tab =>
                tab.id === this.state.tab
                    ? ({ ...tab, ...this.getResult(tab.collection, tab.query, sort) })
                    : tab
            )
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
