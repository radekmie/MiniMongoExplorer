import sift            from 'sift';
import React           from 'react';
import ObjectInspector from 'react-object-inspector';

export default class MiniMongoExplorer extends React.Component {
    state = {
        tabs:  [],
        tabId: -1,

        minimongo: {},

        viewSide: true,
        viewText: false
    };

    componentWillMount () {
        this.onRefresh();
    }

    render () {
        const { tabs, tabId, minimongo, viewSide, viewText } = this.state;

        return (
            <main>
                {viewSide &&
                    <aside>
                        <h3>collections</h3>
                        <ul>
                            {Object.keys(minimongo).sort().map(collection =>
                                <li key = {collection} onClick = {() => this.onTabAdd(collection)}>
                                    <span dangerouslySetInnerHTML = {{ __html: collection }} />
                                    <span dangerouslySetInnerHTML = {{ __html: `<i>(${Object.keys(minimongo[collection]).length})</i>` }} />
                                </li>
                            )}
                        </ul>

                        <button onClick = {this.onRefresh}>
                            refresh
                        </button>
                        <button onClick = {this.onText}>
                            {viewText
                                ? 'toggle text mode off'
                                : 'toggle text mode on'
                            }
                        </button>
                    </aside>
                }

                <section>
                    <nav>
                        <a><span onClick = {this.onSide}><b>{viewSide ? '<' : '>'}</b></span></a>
                        <a><span onClick = {this.onHelp}><b>?</b></span></a>
                        <a><span onClick = {this.onTabCloseAll}><b>x</b></span></a>

                        {tabs.map(({ collection, count }, tab) =>
                            <a key = {tab} onClick = {() => this.onTabChange(tab)}>
                                {tab === tabId
                                    ? <b>{collection}</b>
                                    : <i>{collection}</i>
                                }

                                <i dangerouslySetInnerHTML = {{ __html: `(${count})` }} />

                                <span onClick = {event => (event.stopPropagation(), this.onTabClose(tab))}>
                                    <b>x</b>
                                </span>
                            </a>
                        )}
                    </nav>

                    {tabs[tabId] &&
                        <textarea rows = {1}
                                  spellCheck = {false}
                                  style = {{ color: tabs[tabId].error ? '#f00' : 'initial' }}
                                  value = {tabs[tabId].query}
                                  onChange = {event => this.onQuery(tabId, event.currentTarget.value)}
                        />
                    }

                    {tabs[tabId]
                        ? viewText
                            ? <pre dangerouslySetInnerHTML = {{ __html: JSON.stringify(tabs[tabId].result, null, 4).replace(/[\u00A0-\u9999<>\&]/gim, char => `&#${char.charCodeAt(0)};`) }} />
                            : <ObjectInspector key = {tabId} initialExpandedPaths = {['root']} data = {tabs[tabId].result} />
                        : (
                            <section>
                                <article>
                                    <h3>Quick overview:</h3>
                                    <ul>
                                        <li>select collection</li>
                                        <li>select tab</li>
                                        <li>compose query</li>
                                        <li>toggle mode</li>
                                        <li>refresh if necessary</li>
                                    </ul>
                                </article>
                            </section>
                        )
                    }
                </section>
            </main>
        );
    }

    onHelp = () =>
        this.setState({ tabId: -1 })
    ;

    onQuery = (tabId, query) =>
        this.setState({
            tabs: this.state.tabs.slice(0, tabId)
                .concat({
                    ...this.state.tabs[tabId],
                    ...this.runQuery(query, this.state.tabs[tabId].collection)
                })
                .concat(this.state.tabs.slice(tabId + 1))
        })
    ;

    onRefresh = () =>
        this.props.fetch(minimongo =>
            this.setState({ minimongo }, () =>
                this.setState({
                    tabs: this.state.tabs.map(({ collection, query, ...rest }) =>
                        ({
                            collection,
                            ...rest,
                            ...this.runQuery(query, collection)
                        })
                    )
                })
            )
        )
    ;

    onSide = () =>
        this.setState({ viewSide: !this.state.viewSide })
    ;

    onTabAdd = collection =>
        this.setState({
            tabs:  this.state.tabs.concat({ collection, ...this.runQuery('{}', collection) }),
            tabId: this.state.tabs.length
        })
    ;

    onTabChange = tabId =>
        this.setState({ tabId })
    ;

    onTabClose = tabId =>
        this.setState({
            tabId: this.state.tabId === tabId
                ? -1
                : this.state.tabId < tabId
                    ? this.state.tabId
                    : this.state.tabId - 1,
            tabs: this.state.tabs.slice(0, tabId).concat(this.state.tabs.slice(tabId + 1))
        })
    ;

    onTabCloseAll = () =>
        this.setState({ tabs: [], tabId: -1 })
    ;

    onText = () =>
        this.setState({ viewText: !this.state.viewText })
    ;

    runQuery = (query, collection) => {
        let error = false;
        let documentsArray = Object
            .keys(this.state.minimongo[collection])
            .sort()
            .map(key => this.state.minimongo[collection][key]);

        try {
            documentsArray = sift(eval(`(${query})`), documentsArray);
        } catch (_) {
            error = true;
        }

        return {
            error,
            query,
            count:  documentsArray.length,
            result: documentsArray.reduce((result, doc) => ({ ...result, [doc._id]: doc }), {})
        };
    };
}
