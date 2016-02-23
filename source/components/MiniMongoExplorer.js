import sift            from 'sift';
import React           from 'react';
import ObjectInspector from 'react-object-inspector';

export default class MiniMongoExplorer extends React.Component {
    constructor ({ minimongo }) {
        super({ minimongo });

        this.state = {
            collection: Object.keys(minimongo).sort()[0],

            query:       '',
            queryError:  false,
            queryResult: []
        };
    }

    componentDidMount () {
        this.onQuery('');
    }

    render () {
        const { minimongo } = this.props;
        const { collection, query, queryError, queryResult } = this.state;

        return (
            <main>
                <select value = {collection} onChange = {event => this.onCollection(event.target.value)}>
                    {Object.keys(minimongo).sort().map(collection =>
                        <option key = {collection} value = {collection}>
                            {collection} ({Object.keys(minimongo[collection]).length})
                        </option>
                    )}
                </select>

                <pre style={{ color: queryError ? 'red' : 'initial' }}>
                    <code contentEditable
                          data-before = "query = {"
                          data-after = "}"
                          spellCheck = {false}
                          onBlur  = {event => this.onQuery(event.target.innerText)}
                          onInput = {event => this.onQuery(event.target.innerText)}
                          dangerouslySetInnerHTML = {{ __html: query }}
                    />

                    <br />

                    <code data-before = "count = " dangerouslySetInnerHTML = {{ __html: queryResult.length }} />
                </pre>

                <pre>
                    <ObjectInspector initialExpandedPaths = {['root']} data = {queryResult} />
                </pre>
            </main>
        );
    }

    onCollection = collection => {
        this.setState({ collection }, () => this.onQuery(this.state.query));
    };

    onQuery = query => {
        const minimongo  = this.props.minimongo;
        const collection = this.state.collection;

        const documents = Object.keys(minimongo[collection]).map(id => minimongo[collection][id]);

        try {
            this.setState({ query, queryError: false, queryResult: sift(eval(`({${query}})`), documents) });
        } catch (error) {
            this.setState({ query, queryError: true, queryResult: documents });
        }
    }
}
