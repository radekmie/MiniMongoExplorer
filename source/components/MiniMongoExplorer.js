import sift            from 'sift';
import React           from 'react';
import ObjectInspector from 'react-object-inspector';

export default class MiniMongoExplorer extends React.Component {
    state = {
        minimongo: {},
        tab: undefined,
        tabs: [],
        text: false
    };

    componentWillMount () {
        this.onRefresh();
    }

    render () {
        return (
            <main>
                <aside>
                    <h3>collections</h3>
                    <ul>
                        {Object.keys(this.state.minimongo).sort().map(collection =>
                            <li key = {collection} onClick = {() => this.onTabAdd(collection)}>
                                <span dangerouslySetInnerHTML = {{ __html: collection }} />
                                <span dangerouslySetInnerHTML = {{ __html: `<i>(${Object.keys(this.state.minimongo[collection]).length})</i>` }} />
                            </li>
                        )}
                    </ul>

                    <button onClick = {() => this.setState({ text: !this.state.text })}>
                        {this.state.text
                            ? 'toggle view mode'
                            : 'toggle text mode'
                        }
                    </button>
                    <button onClick = {() => this.onRefresh()}>
                        refresh
                    </button>
                </aside>

                <section>
                    <nav>
                        <a>
                            <span onClick = {() => this.onTabCloseAll()}><b>x</b></span>
                        </a>

                        {this.state.tabs.map(({ collection, count }, tab) =>
                            <a key = {tab} onClick = {() => this.onTabChange(tab)}>
                                {tab === this.state.tab
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

                    {this.state.tabs[this.state.tab] &&
                        <textarea rows = {1}
                                  spellCheck = {false}
                                  style = {{ color: this.state.tabs[this.state.tab].error ? '#f00' : 'initial' }}
                                  value = {this.state.tabs[this.state.tab] && this.state.tabs[this.state.tab].query}
                                  onChange = {event => this.state.tabs[this.state.tab] && this.onQuery(this.state.tab, event.currentTarget.value)}
                        />
                    }

                    {this.state.tabs[this.state.tab]
                        ? this.state.text
                            ? <pre dangerouslySetInnerHTML = {{ __html: JSON.stringify(this.state.tabs[this.state.tab].result, null, 4).replace(/[\u00A0-\u9999<>\&]/gim, char => `&#${char.charCodeAt(0)};`) }} />
                            : <ObjectInspector key = {this.state.tab} initialExpandedPaths = {['root']} data = {this.state.tabs[this.state.tab].result} />
                        : (
                            <div>
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
                            </div>
                        )
                    }
                </section>
            </main>
        );
    }

    onAction = (action, key) =>
        this.props[action](data => this.setState({ [key]: data }))
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

    onQuery = (tab, query) =>
        this.setState({
            tabs: this.state.tabs.slice(0, tab)
                .concat({
                    ...this.state.tabs[tab],
                    ...this.runQuery(query, this.state.tabs[tab].collection)
                })
                .concat(this.state.tabs.slice(tab + 1))
        })
    ;

    onTabAdd = collection =>
        this.setState({
            tab:  this.state.tabs.length,
            tabs: this.state.tabs.concat({ collection, ...this.runQuery('{}', collection) })
        })
    ;

    onTabChange = tab =>
        this.setState({ tab })
    ;

    onTabClose = tab =>
        this.setState({
            tab: this.state.tab === tab
                ? undefined
                : this.state.tab < tab
                    ? this.state.tab
                    : this.state.tab - 1,
            tabs: this.state.tabs.slice(0, tab).concat(this.state.tabs.slice(tab + 1))
        })
    ;

    onTabCloseAll = () =>
        this.setState({ tab: undefined, tabs: [], })
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
